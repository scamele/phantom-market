# 🎭 Phantom Market

> A privacy-first decentralized prediction market platform powered by Fully Homomorphic Encryption (FHE)

[![Deployment](https://img.shields.io/badge/vercel-deployed-success)](https://phantom-market.vercel.app)
[![Solidity](https://img.shields.io/badge/solidity-0.8.24-blue)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/react-18.3.1-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 🌟 Overview

**Phantom Market** is a cutting-edge decentralized prediction market platform that leverages **Zama's Fully Homomorphic Encryption (FHE)** technology to enable completely private on-chain betting. Unlike traditional prediction markets where all positions are publicly visible, Phantom Market encrypts every bet on-chain, preventing front-running, market manipulation, and privacy leaks.

### Live Demo

**Production**: https://phantom-market.vercel.app

**Smart Contract**: `0x47A51b25bB93072514798bC4432a4d83aa052a79` (Sepolia)

**Block Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x47A51b25bB93072514798bC4432a4d83aa052a79)

### Key Features

- 🔐 **Fully Encrypted Positions** - All bets encrypted with FHE
- ⚖️ **Fair & Transparent** - Winners split pool equally, 0% fees
- 🚀 **User-Friendly** - Auto network switching, one-click betting
- 🛡️ **Trustless** - Smart contract-based, no intermediaries
- 💰 **Zero Protocol Fees** - Only entry fees set by creators

## 📚 Table of Contents

- [Technical Architecture](#-technical-architecture)
- [Technology Stack](#-technology-stack)
- [How It Works](#-how-it-works)
- [Smart Contract](#-smart-contract-architecture)
- [Installation](#-installation--setup)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Security](#-security-considerations)
- [Roadmap](#-roadmap)

## 🏗️ Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Markets  │  │  Bet UI  │  │  Stats   │  │  Wallet  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Frontend Layer (React)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  State Management (TanStack Query)                  │   │
│  │  ├─ Market Cache                                    │   │
│  │  ├─ Position Cache                                  │   │
│  │  └─ User Session                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Web3 Integration (Ethers.js v6)                    │   │
│  │  ├─ Wallet Connection                               │   │
│  │  ├─ Contract Interaction                            │   │
│  │  └─ Transaction Management                          │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                FHE Encryption Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Zama Relayer SDK v0.3.0-5                          │   │
│  │  ├─ SDK Initialization                              │   │
│  │  ├─ Encrypted Input Creation                        │   │
│  │  ├─ Proof Generation                                │   │
│  │  └─ Handle Management                               │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Gateway: https://gateway.sepolia.zama.ai           │   │
│  │  ├─ KMS Signer Retrieval                            │   │
│  │  ├─ Public Key Exchange                             │   │
│  │  └─ Signature Verification                          │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│             Blockchain Layer (Sepolia)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PhantomRelayLeague Smart Contract                  │   │
│  │  Address: 0x47A51b25bB93072514798bC4432a4d83aa052a79│   │
│  │  ├─ Market Management                               │   │
│  │  ├─ Position Management                             │   │
│  │  ├─ FHE Operations (euint64)                        │   │
│  │  └─ Payout Distribution                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Zama fhEVM                                          │   │
│  │  ACL: 0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5   │   │
│  │  ├─ Encrypted State Variables                       │   │
│  │  ├─ FHE Operations Library                          │   │
│  │  └─ Access Control List                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Places Bet
       │
       ▼
┌──────────────┐
│ FHE Encrypt  │  amount → euint64
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Smart Contract│  placePosition()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ On-Chain FHE │  FHE.add(exposure, share)
└──────────────┘
```

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 5.4.19 | Build tool & dev server |
| **TailwindCSS** | 3.4.17 | Utility-first styling |
| **Shadcn/ui** | Latest | Component library |
| **TanStack Query** | 5.83.0 | Async state management |
| **React Router** | 6.30.1 | Client-side routing |
| **Ethers.js** | 6.13.4 | Ethereum interactions |
| **Lucide React** | 0.462.0 | Icon library |
| **Next Themes** | 0.3.0 | Dark/light mode |

### Blockchain

| Technology | Version | Purpose |
|------------|---------|---------|
| **Solidity** | 0.8.24 | Smart contract language |
| **Hardhat** | 2.22.0 | Development framework |
| **fhEVM Solidity** | 0.9.1 | FHE operations library |
| **Zama Relayer SDK** | 0.3.0-5 | Client-side FHE |
| **Ethereum Sepolia** | Testnet | Deployment network |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Vercel** | Frontend hosting |
| **Zama Gateway** | FHE key management |
| **Etherscan** | Block explorer |
| **MetaMask** | Wallet provider |

## 🎮 How It Works

### For Users (Bettors)

#### 1. Connect Wallet
```typescript
// Automatic network detection and switching
const provider = await getBrowserProvider();
const signer = await provider.getSigner();
```

Connect your MetaMask or any Web3 wallet. The app automatically switches to Sepolia testnet if needed.

#### 2. Browse Markets

Markets are categorized by:
- **Crypto** (Bitcoin, Ethereum price predictions)
- **Sports** (FIFA World Cup, Olympics)
- **Politics** (Elections, policy outcomes)
- **Economy** (GDP growth, inflation rates)
- **Technology** (Product launches, AI milestones)

#### 3. Place Encrypted Position

```typescript
// Frontend encryption
const { handle, proof } = await encryptConfidenceShare(
  shareValue,      // Your bet amount
  contractAddress, // Market contract
  walletAddress    // Your address
);

// Submit to blockchain
await contract.placePosition(marketId, voteYes, handle, proof, {
  value: entryFee
});
```

**Key Privacy Features:**
- Your bet amount is encrypted client-side before submission
- Only you and the smart contract can see your position
- Other users cannot front-run or copy your strategy

#### 4. Wait for Resolution

Market creators resolve outcomes based on oracle data:
- **Crypto prices**: CoinGecko API
- **Sports results**: FIFA.com, Olympics official site
- **Economic data**: Federal Reserve, World Bank
- **Technology events**: Official company announcements

#### 5. Claim Rewards

If you predicted correctly:
```typescript
await contract.claimRewards(marketId);
```

**Payout Formula:**
```
Your Share = Total Pool / Number of Winners
```

Example: 10 ETH total pool, 5 winners → Each winner gets 2 ETH

### For Market Creators

#### 1. Create Market

```typescript
await contract.createMarket(
  question,     // "Will Bitcoin hit $100K by Dec 31?"
  category,     // "Crypto"
  rules,        // Resolution criteria
  entryFee,     // 0.01 ETH
  duration      // 30 days (in seconds)
);
```

**Market Parameters:**
- **Question**: Binary YES/NO question
- **Category**: Crypto, Sports, Politics, Economy, Technology
- **Rules**: Clear resolution criteria linked to oracle
- **Entry Fee**: Minimum stake (0.001 - 1 ETH)
- **Duration**: 1 hour to 30 days

#### 2. Monitor Market

Track market statistics:
- Total participants
- YES/NO pool sizes (encrypted)
- Time remaining
- Your creator fee earnings

#### 3. Enable Exposure Reveal (Optional)

```typescript
await contract.enableExposureReveal(marketId);
```

Makes total YES/NO exposures publicly decryptable for transparency.

#### 4. Resolve Outcome

```typescript
await contract.resolveMarket(marketId, outcome); // true = YES, false = NO
```

Submit final outcome based on real-world data. Winners can then claim rewards.

## 📜 Smart Contract Architecture

### Contract Structure

```solidity
contract PhantomRelayLeague {
    struct Market {
        address creator;
        string question;
        string category;
        string rules;
        uint256 entryFee;
        uint256 createdAt;
        uint256 duration;
        bool resolved;
        bool outcome;
        bool cancelled;
        uint256 participantCount;
        euint64 yesExposure;
        euint64 noExposure;
    }

    struct Position {
        address participant;
        bool voteYes;
        euint64 encryptedShare;
        bool claimed;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => Position[]) public positions;
}
```

### Key Functions

#### `createMarket()`
```solidity
function createMarket(
    string memory _question,
    string memory _category,
    string memory _rules,
    uint256 _entryFee,
    uint256 _duration
) external returns (uint256)
```

Creates a new prediction market. Returns market ID.

**Requirements:**
- Entry fee: 0.001 - 1 ETH
- Duration: 3600 - 2592000 seconds (1 hour - 30 days)
- Non-empty question, category, rules

#### `placePosition()`
```solidity
function placePosition(
    uint256 _marketId,
    bool _voteYes,
    bytes calldata _encryptedShare,
    bytes calldata _inputProof
) external payable
```

Places encrypted position on a market.

**Requirements:**
- Market must be active (not locked, resolved, or cancelled)
- Must send exact entry fee
- Valid FHE proof and handle

**Privacy Guarantee:**
- `_encryptedShare` is euint64 encrypted with user's public key
- Only user and contract can decrypt
- Position invisible to other participants

#### `adjustPosition()`
```solidity
function adjustPosition(
    uint256 _marketId,
    uint256 _positionIndex,
    bytes calldata _newEncryptedShare,
    bytes calldata _inputProof
) external
```

Updates existing position before market locks.

**Use Cases:**
- Increase bet size
- Decrease bet size
- Change YES/NO vote

#### `resolveMarket()`
```solidity
function resolveMarket(
    uint256 _marketId,
    bool _outcome
) external onlyCreator(_marketId)
```

Resolves market outcome (true = YES, false = NO).

**Requirements:**
- Only creator can resolve
- Market must be locked (duration expired)
- Cannot resolve cancelled markets

#### `claimRewards()`
```solidity
function claimRewards(uint256 _marketId) external
```

Claims proportional share of total pool if winner.

**Payout Calculation:**
```solidity
uint256 totalPool = market.yesExposure.decrypt() + market.noExposure.decrypt();
uint256 winnerCount = countWinners(marketId);
uint256 payout = totalPool / winnerCount;
```

#### `cancelMarket()`
```solidity
function cancelMarket(uint256 _marketId) external onlyCreator(_marketId)
```

Cancels market and refunds all participants.

**Refund Process:**
- All participants receive full entry fee back
- No winners or losers
- Market permanently cancelled

## 📦 Installation & Setup

### Prerequisites

- **Node.js** v18+ and npm/yarn/pnpm
- **MetaMask** or compatible Web3 wallet
- **Sepolia ETH** for testnet transactions

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/phantom-market.git
cd phantom-market
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Smart Contracts
```bash
cd ..
npm install
```

### 3. Environment Configuration

Create `.env` in project root:
```env
# Blockchain
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here

# Contract
PHANTOM_CONTRACT=0x47A51b25bB93072514798bC4432a4d83aa052a79
```

Create `frontend/.env`:
```env
VITE_PHANTOM_CONTRACT=0x47A51b25bB93072514798bC4432a4d83aa052a79
VITE_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

### 4. Compile Contracts

```bash
npm run compile
```

### 5. Run Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:5173

### 6. Deploy Contract (Optional)

```bash
npm run deploy
```

Creates new contract instance on Sepolia.

## 🗂️ Project Structure

```
phantom-market/
├── contracts/
│   └── PhantomRelayLeague.sol    # Main smart contract
├── scripts/
│   ├── deploy.cjs                # Deployment script
│   └── create-markets.cjs        # Market seeding script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Shadcn components
│   │   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   │   ├── MarketCard.tsx    # Market display card
│   │   │   └── ThemeProvider.tsx # Dark/light mode
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Market listing
│   │   │   ├── MarketDetails.tsx # Individual market
│   │   │   ├── Docs.tsx          # Documentation
│   │   │   ├── Leaderboard.tsx   # Top traders
│   │   │   ├── News.tsx          # News articles
│   │   │   └── Integrations.tsx  # Tech stack
│   │   ├── lib/
│   │   │   ├── fhe.ts            # FHE encryption logic
│   │   │   ├── phantom.ts        # Contract interactions
│   │   │   └── utils.ts          # Utility functions
│   │   ├── hooks/
│   │   │   ├── useWallet.ts      # Wallet connection
│   │   │   └── useMarkets.ts     # Market data fetching
│   │   └── App.tsx               # Main app component
│   ├── public/
│   │   └── bet_demo.mp4          # Demo video
│   └── vercel.json               # SPA routing config
├── hardhat.config.js
├── package.json
└── README.md
```

## 🔌 API Reference

### Frontend SDK (`src/lib/phantom.ts`)

#### `getMarkets()`
```typescript
async function getMarkets(): Promise<Market[]>
```

Fetches all markets from contract.

**Returns:** Array of market objects

#### `getMarketDetails()`
```typescript
async function getMarketDetails(marketId: bigint): Promise<MarketDetail>
```

Fetches detailed information for specific market.

**Parameters:**
- `marketId`: Market ID (bigint)

**Returns:** Market details including positions

#### `placeEncryptedPosition()`
```typescript
async function placeEncryptedPosition({
  marketId: bigint,
  voteYes: boolean,
  shareValue: bigint,
  entryFee: bigint
}): Promise<TransactionResponse>
```

Places encrypted position on market.

**Parameters:**
- `marketId`: Target market ID
- `voteYes`: true for YES, false for NO
- `shareValue`: Bet amount (wei)
- `entryFee`: Entry fee (wei)

**Returns:** Transaction response

### FHE SDK (`src/lib/fhe.ts`)

#### `initializeFHE()`
```typescript
async function initializeFHE(provider?: any): Promise<FHEVMInstance>
```

Initializes FHE SDK with Zama Gateway.

**Parameters:**
- `provider`: Optional wallet provider (defaults to window.ethereum)

**Returns:** FHE instance for encryption

#### `encryptConfidenceShare()`
```typescript
async function encryptConfidenceShare(
  shareValue: bigint | number,
  contractAddress: string,
  walletAddress: string
): Promise<{ handle: `0x${string}`, proof: `0x${string}` }>
```

Encrypts bet amount for on-chain submission.

**Parameters:**
- `shareValue`: Amount to encrypt
- `contractAddress`: Target contract
- `walletAddress`: User's address

**Returns:** Encrypted handle and proof

## 🚀 Deployment

### Frontend Deployment (Vercel)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Configure SPA Routing

Ensure `frontend/vercel.json` exists:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 3. Deploy
```bash
cd frontend
vercel --prod --token YOUR_VERCEL_TOKEN --name phantom-market
```

#### 4. Configure Environment Variables

In Vercel dashboard, add:
- `VITE_PHANTOM_CONTRACT`
- `VITE_PUBLIC_RPC_URL`

### Smart Contract Deployment

#### 1. Configure Hardhat

Update `hardhat.config.js`:
```javascript
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

#### 2. Deploy
```bash
npm run deploy
```

#### 3. Verify on Etherscan
```bash
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

#### 4. Seed Markets
```bash
node scripts/create-markets.cjs
```

## 🔒 Security Considerations

### Smart Contract Security

1. **Access Control**
   - Only market creators can resolve/cancel markets
   - Position adjustments restricted to original participant
   - Reward claims validated against winner status

2. **Reentrancy Protection**
   - Uses checks-effects-interactions pattern
   - No external calls before state updates
   - Single withdrawal per position

3. **FHE Security**
   - Encrypted data uses euint64 (64-bit unsigned integers)
   - ACL (Access Control List) restricts decryption
   - Only contract and user can decrypt positions

4. **Edge Cases Handled**
   - Market cancellation refunds
   - Division by zero in payout calculation
   - Timestamp manipulation resistance

### Frontend Security

1. **Input Validation**
   - All user inputs sanitized
   - BigInt overflow checks
   - Entry fee range validation

2. **Wallet Security**
   - Never stores private keys
   - All signatures requested through wallet UI
   - Transaction simulation before submission

3. **FHE Client Security**
   - SDK loaded from trusted CDN
   - Gateway communication over HTTPS
   - Proof verification before submission

### Recommended Audits

- **Smart Contract Audit**: Before mainnet deployment
- **FHE Implementation Review**: Verify encryption correctness
- **Frontend Security Audit**: XSS, CSRF, injection attacks

## 🗺️ Roadmap

### Phase 1: Foundation (Completed ✅)
- [x] Core smart contract with FHE encryption
- [x] Web interface with wallet connection
- [x] Binary prediction markets (YES/NO)
- [x] Testnet deployment and testing
- [x] Production hosting

### Phase 2: Platform Enhancement
- [ ] Public market creation interface
- [ ] Advanced filtering and search
- [ ] Portfolio dashboard
- [ ] Historical position tracking
- [ ] Real-time notifications
- [ ] Performance analytics

### Phase 3: Oracle Integration
- [ ] Chainlink price feeds
- [ ] Sports result oracles
- [ ] Economic data providers
- [ ] Automated resolution system
- [ ] Dispute mechanism
- [ ] Multi-source verification

### Phase 4: Liquidity & Economics
- [ ] Additional payment tokens (USDC, USDT)
- [ ] Liquidity mining rewards
- [ ] Market maker incentives
- [ ] Trading fee optimization
- [ ] Revenue sharing model

### Phase 5: Security Hardening
- [ ] Third-party smart contract audit
- [ ] Bug bounty program
- [ ] Formal verification
- [ ] Insurance fund
- [ ] Emergency pause mechanism

### Phase 6: Mainnet Expansion
- [ ] Ethereum mainnet deployment
- [ ] Layer 2 integration (Arbitrum, Optimism)
- [ ] Cross-chain bridge
- [ ] Multi-network support
- [ ] Gas optimization

### Phase 7: Governance & Community
- [ ] Native governance token
- [ ] DAO structure
- [ ] Proposal voting system
- [ ] Community treasury
- [ ] Parameter adjustment rights

### Phase 8: Mobile & Accessibility
- [ ] Progressive Web App (PWA)
- [ ] Native mobile apps (iOS/Android)
- [ ] Telegram/Discord bots
- [ ] API for third-party integrations
- [ ] Multi-language support

### Phase 9: Advanced Privacy Features
- [ ] Zero-knowledge proof resolution
- [ ] Private market creation
- [ ] Encrypted messaging
- [ ] Anonymous betting
- [ ] Privacy-preserving analytics

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- **Zama** - For groundbreaking FHE technology
- **Ethereum Foundation** - For Sepolia testnet
- **Shadcn/ui** - For beautiful component library
- **Vercel** - For seamless hosting

## 📞 Contact & Support

- **Website**: https://phantom-market.vercel.app
- **Documentation**: https://phantom-market.vercel.app/docs
- **Twitter**: [@PhantomMarket](https://twitter.com/PhantomMarket)
- **Discord**: [Join Community](https://discord.gg/phantom-market)
- **Email**: support@phantom-market.io

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with privacy-first principles. Powered by FHE. 🎭**
