import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import type { MarketSnapshot, UserPosition } from "@/types/market";
import PhantomRelayLeagueABI from "@/lib/PhantomRelayLeagueABI.json";
import { encryptConfidenceShare } from "./fhe";

const phantomAbi = PhantomRelayLeagueABI as const;

const CONTRACT_ADDRESS = import.meta.env.VITE_PHANTOM_CONTRACT;
const PUBLIC_RPC =
  import.meta.env.VITE_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

const readProvider = PUBLIC_RPC ? new JsonRpcProvider(PUBLIC_RPC) : null;

const assertConfig = () => {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Missing VITE_PHANTOM_CONTRACT in environment file.");
  }
  if (!readProvider) {
    throw new Error("Missing RPC provider configuration.");
  }
};

const getReadContract = () => {
  assertConfig();
  return new Contract(CONTRACT_ADDRESS, phantomAbi, readProvider!);
};

const getBrowserProvider = async () => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("Wallet provider not detected.");
  }
  return new BrowserProvider((window as any).ethereum);
};

export const requestWallet = async () => {
  const provider = await getBrowserProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0] as string;
};

export const getConnectedAccount = async () => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return null;
  }
  const provider = await getBrowserProvider();
  const accounts = await provider.send("eth_accounts", []);
  return accounts[0] ?? null;
};

export const fetchMarkets = async (): Promise<MarketSnapshot[]> => {
  const contract = getReadContract();
  const marketIds: string[] = await contract.listMarkets();
  if (!marketIds.length) return [];

  const snapshots = await Promise.all(
    marketIds.map(async (id) => {
      const raw = await contract.getMarket(id);
      return mapMarketStruct(id, raw);
    })
  );

  return snapshots;
};

export const fetchMarketById = async (marketId: string): Promise<MarketSnapshot | null> => {
  if (!marketId) return null;
  const contract = getReadContract();
  try {
    const raw = await contract.getMarket(marketId);
    return mapMarketStruct(marketId, raw);
  } catch (error) {
    console.error("Failed to fetch market", error);
    return null;
  }
};

interface PlaceEncryptedPositionParams {
  marketId: string;
  voteYes: boolean;
  shareValue: number;
  entryFee: bigint;
}

export const placeEncryptedPosition = async ({
  marketId,
  voteYes,
  shareValue,
  entryFee,
}: PlaceEncryptedPositionParams) => {
  assertConfig();
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();
  const account = await signer.getAddress();
  const { handle, proof } = await encryptConfidenceShare(shareValue, CONTRACT_ADDRESS!, account);

  const contract = new Contract(CONTRACT_ADDRESS!, phantomAbi, signer);
  const tx = await contract.placePosition(marketId, voteYes, handle, proof, {
    value: entryFee,
  });
  return tx;
};

export const fetchUserPosition = async (
  marketId: string,
  account: string
): Promise<UserPosition | null> => {
  if (!marketId || !account) return null;
  const contract = getReadContract();
  try {
    const raw = await contract.getPosition(marketId, account);
    return {
      exists: Boolean(raw[0]),
      voteYes: Boolean(raw[1]),
      claimed: Boolean(raw[2]),
      stake: BigInt(raw[3]),
    };
  } catch (error) {
    console.error("Failed to fetch position", error);
    return null;
  }
};

const mapMarketStruct = (id: string, raw: any): MarketSnapshot => ({
  id,
  question: raw[0],
  category: raw[1],
  rules: raw[2],
  oracleURI: raw[3],
  creator: raw[4],
  entryFee: BigInt(raw[5]),
  lockTime: BigInt(raw[6]),
  yesPool: BigInt(raw[7]),
  noPool: BigInt(raw[8]),
  cancelled: Boolean(raw[9]),
  resolved: Boolean(raw[10]),
  decryptable: Boolean(raw[11]),
  outcomeYes: Boolean(raw[12]),
  pushAll: Boolean(raw[13]),
  winnerCount: BigInt(raw[14]),
  revealedYes: Number(raw[15]),
  revealedNo: Number(raw[16]),
});
