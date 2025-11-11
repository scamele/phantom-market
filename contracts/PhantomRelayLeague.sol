// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { FHE, euint64, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title Phantom Relay League - Binary Prediction Market
 * @notice Simple YES/NO prediction markets where confidence shares are encrypted with FHE.
 *         Anyone can create markets, participate, reveal exposures and settle without admins.
 */
contract PhantomRelayLeague is ZamaEthereumConfig {
    struct Market {
        bool exists;
        string marketId;
        string question;
        string category;
        string rules;
        string oracleURI;
        address creator;
        uint256 entryFee;
        uint256 lockTime;
        uint256 yesPool;
        uint256 noPool;
        bool cancelled;
        bool resolved;
        bool decryptable;
        bool outcomeYes;
        bool pushAll;
        uint256 winnerCount;
        euint64 yesExposure;
        euint64 noExposure;
        uint64 revealedYes;
        uint64 revealedNo;
        address[] traders;
    }

    struct Position {
        bool exists;
        bool voteYes;
        bool claimed;
        euint64 shareCipher;
        uint256 stake;
    }

    mapping(string => Market) private markets;
    mapping(string => mapping(address => Position)) private positions;
    string[] private marketIds;

    uint256 public constant MIN_ENTRY_FEE = 0.001 ether;
    uint256 public constant MIN_DURATION = 1 hours;
    uint256 public constant MAX_DURATION = 30 days;

    event MarketCreated(string indexed marketId, address indexed creator, string question, uint256 lockTime);
    event PositionPlaced(string indexed marketId, address indexed trader, bool voteYes);
    event PositionAdjusted(string indexed marketId, address indexed trader, bool voteYes);
    event ExposurePrepared(string indexed marketId);
    event ExposureRevealed(string indexed marketId, uint64 yesExposure, uint64 noExposure);
    event MarketResolved(string indexed marketId, bool outcomeYes, uint256 winnerCount);
    event MarketCancelled(string indexed marketId);
    event PayoutClaimed(string indexed marketId, address indexed trader, uint256 amount);
    event RefundClaimed(string indexed marketId, address indexed trader, uint256 amount);

    error MarketExists();
    error MarketMissing();
    error InvalidFee();
    error InvalidDuration();
    error Locked();
    error AlreadyParticipated();
    error PositionMissing();
    error NotCreator();
    error RevealAlreadyEnabled();
    error RevealNotEnabled();
    error AlreadyResolved();
    error NotResolved();
    error NotWinner();
    error AlreadyClaimed();
    error NotRefundable();

    /** -------------------------- Lifecycle -------------------------- */

    function createMarket(
        string calldata marketId,
        string calldata question,
        string calldata category,
        string calldata rules,
        string calldata oracleURI,
        uint256 entryFee,
        uint256 duration
    ) external {
        if (markets[marketId].exists) revert MarketExists();
        if (entryFee < MIN_ENTRY_FEE) revert InvalidFee();
        if (duration < MIN_DURATION || duration > MAX_DURATION) revert InvalidDuration();

        Market storage market = markets[marketId];
        market.exists = true;
        market.marketId = marketId;
        market.question = question;
        market.category = category;
        market.rules = rules;
        market.oracleURI = oracleURI;
        market.creator = msg.sender;
        market.entryFee = entryFee;
        market.lockTime = block.timestamp + duration;

        marketIds.push(marketId);
        emit MarketCreated(marketId, msg.sender, question, market.lockTime);
    }

    function placePosition(
        string calldata marketId,
        bool voteYes,
        externalEuint64 encryptedShare,
        bytes calldata proof
    ) external payable {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        if (market.cancelled) revert Locked();
        if (block.timestamp >= market.lockTime) revert Locked();
        if (msg.value != market.entryFee) revert InvalidFee();

        Position storage position = positions[marketId][msg.sender];
        if (position.exists) revert AlreadyParticipated();

        euint64 share = FHE.fromExternal(encryptedShare, proof);
        _updateExposure(market, share, voteYes, true);

        position.exists = true;
        position.voteYes = voteYes;
        position.claimed = false;
        position.shareCipher = share;
        position.stake = msg.value;

        if (voteYes) {
            market.yesPool += msg.value;
        } else {
            market.noPool += msg.value;
        }

        market.traders.push(msg.sender);
        FHE.allow(share, msg.sender);

        emit PositionPlaced(marketId, msg.sender, voteYes);
    }

    function adjustPosition(
        string calldata marketId,
        bool voteYes,
        externalEuint64 newEncryptedShare,
        bytes calldata proof
    ) external {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        if (market.cancelled) revert Locked();
        if (block.timestamp >= market.lockTime) revert Locked();

        Position storage position = positions[marketId][msg.sender];
        if (!position.exists) revert PositionMissing();

        _updateExposure(market, position.shareCipher, position.voteYes, false);

        if (position.voteYes) {
            market.yesPool -= position.stake;
        } else {
            market.noPool -= position.stake;
        }

        euint64 newShare = FHE.fromExternal(newEncryptedShare, proof);
        _updateExposure(market, newShare, voteYes, true);

        if (voteYes) {
            market.yesPool += position.stake;
        } else {
            market.noPool += position.stake;
        }

        position.voteYes = voteYes;
        position.shareCipher = newShare;
        position.claimed = false;
        FHE.allow(newShare, msg.sender);

        emit PositionAdjusted(marketId, msg.sender, voteYes);
    }

    /** -------------------------- Exposure Reveal -------------------------- */

    function enableExposureReveal(string calldata marketId) external {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        if (market.creator != msg.sender) revert NotCreator();
        if (market.cancelled) revert Locked();
        if (block.timestamp < market.lockTime) revert Locked();
        if (market.decryptable) revert RevealAlreadyEnabled();
        if (market.resolved) revert AlreadyResolved();

        FHE.makePubliclyDecryptable(market.yesExposure);
        FHE.makePubliclyDecryptable(market.noExposure);
        market.decryptable = true;
        emit ExposurePrepared(marketId);
    }

    function submitExposureReveal(
        string calldata marketId,
        bytes calldata cleartexts,
        bytes calldata proof
    ) external {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        if (!market.decryptable) revert RevealNotEnabled();

        bytes32[] memory handles = new bytes32[](2);
        handles[0] = FHE.toBytes32(market.yesExposure);
        handles[1] = FHE.toBytes32(market.noExposure);

        FHE.checkSignatures(handles, cleartexts, proof);
        uint64[] memory totals = abi.decode(cleartexts, (uint64[]));
        require(totals.length == 2, "Invalid exposure data");

        market.revealedYes = totals[0];
        market.revealedNo = totals[1];
        market.decryptable = false;

        emit ExposureRevealed(marketId, totals[0], totals[1]);
    }

    /** -------------------------- Resolution -------------------------- */

    function resolveMarket(string calldata marketId, bool outcomeYes) external {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        if (market.creator != msg.sender) revert NotCreator();
        if (market.cancelled) revert Locked();
        if (block.timestamp < market.lockTime) revert Locked();
        if (market.resolved) revert AlreadyResolved();

        uint256 winners = 0;
        for (uint256 i = 0; i < market.traders.length; i++) {
            Position storage position = positions[marketId][market.traders[i]];
            if (!position.exists) continue;
            if (position.voteYes == outcomeYes) {
                winners += 1;
            }
        }

        market.outcomeYes = outcomeYes;
        market.resolved = true;
        market.winnerCount = winners;
        market.pushAll = (winners == 0);

        emit MarketResolved(marketId, outcomeYes, winners);
    }

    function cancelMarket(string calldata marketId) external {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        if (market.creator != msg.sender) revert NotCreator();
        if (market.resolved) revert AlreadyResolved();

        market.cancelled = true;
        market.resolved = true;
        emit MarketCancelled(marketId);
    }

    /** -------------------------- Claims -------------------------- */

    function claimPayout(string calldata marketId) external {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        if (!market.resolved || market.cancelled || market.pushAll) revert NotResolved();

        Position storage position = positions[marketId][msg.sender];
        if (!position.exists) revert NotWinner();
        if (position.claimed) revert AlreadyClaimed();
        if (position.voteYes != market.outcomeYes) revert NotWinner();

        uint256 winners = market.winnerCount;
        require(winners > 0, "No winners");
        uint256 totalPool = market.yesPool + market.noPool;
        uint256 payout = totalPool / winners;

        position.claimed = true;
        (bool sent, ) = payable(msg.sender).call{ value: payout }("");
        require(sent, "Transfer failed");

        emit PayoutClaimed(marketId, msg.sender, payout);
    }

    function claimRefund(string calldata marketId) external {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();

        Position storage position = positions[marketId][msg.sender];
        if (!position.exists) revert NotRefundable();
        if (position.claimed) revert AlreadyClaimed();

        bool refundable = market.cancelled || (market.resolved && market.pushAll);
        if (!refundable) revert NotRefundable();

        position.claimed = true;
        (bool sent, ) = payable(msg.sender).call{ value: position.stake }("");
        require(sent, "Refund failed");

        emit RefundClaimed(marketId, msg.sender, position.stake);
    }

    /** -------------------------- Views -------------------------- */

    function listMarkets() external view returns (string[] memory) {
        return marketIds;
    }

    function getMarket(string calldata marketId)
        external
        view
        returns (
            string memory question,
            string memory category,
            string memory rules,
            string memory oracleURI,
            address creator,
            uint256 entryFee,
            uint256 lockTime,
            uint256 yesPool,
            uint256 noPool,
            bool cancelled,
            bool resolved,
            bool decryptable,
            bool outcomeYes,
            bool pushAll,
            uint256 winnerCount,
            uint64 revealedYes,
            uint64 revealedNo
        )
    {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        return (
            market.question,
            market.category,
            market.rules,
            market.oracleURI,
            market.creator,
            market.entryFee,
            market.lockTime,
            market.yesPool,
            market.noPool,
            market.cancelled,
            market.resolved,
            market.decryptable,
            market.outcomeYes,
            market.pushAll,
            market.winnerCount,
            market.revealedYes,
            market.revealedNo
        );
    }

    function getExposureHandles(string calldata marketId) external view returns (bytes32[] memory) {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketMissing();
        bytes32[] memory handles = new bytes32[](2);
        handles[0] = FHE.toBytes32(market.yesExposure);
        handles[1] = FHE.toBytes32(market.noExposure);
        return handles;
    }

    function getPosition(string calldata marketId, address trader)
        external
        view
        returns (
            bool exists,
            bool voteYes,
            bool claimed,
            uint256 stake
        )
    {
        Position storage position = positions[marketId][trader];
        return (position.exists, position.voteYes, position.claimed, position.stake);
    }

    /** -------------------------- Internal Helpers -------------------------- */

    function _updateExposure(
        Market storage market,
        euint64 share,
        bool voteYes,
        bool add
    ) internal {
        if (market.traders.length == 0 && !FHE.isInitialized(market.yesExposure)) {
            market.yesExposure = FHE.asEuint64(0);
            market.noExposure = FHE.asEuint64(0);
            FHE.allowThis(market.yesExposure);
            FHE.allowThis(market.noExposure);
        }

        if (voteYes) {
            market.yesExposure = add ? FHE.add(market.yesExposure, share) : FHE.sub(market.yesExposure, share);
            FHE.allowThis(market.yesExposure);
        } else {
            market.noExposure = add ? FHE.add(market.noExposure, share) : FHE.sub(market.noExposure, share);
            FHE.allowThis(market.noExposure);
        }
    }
}
