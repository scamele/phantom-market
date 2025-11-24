export interface MarketSnapshot {
  id: string;
  question: string;
  category: string;
  rules: string;
  oracleURI: string;
  creator: string;
  entryFee: bigint;
  lockTime: bigint;
  yesPool: bigint;
  noPool: bigint;
  cancelled: boolean;
  resolved: boolean;
  decryptable: boolean;
  outcomeYes: boolean;
  pushAll: boolean;
  winnerCount: bigint;
  revealedYes: number;
  revealedNo: number;
}

export interface UserPosition {
  exists: boolean;
  voteYes: boolean;
  claimed: boolean;
  stake: bigint;
}
