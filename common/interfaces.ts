import { NetworkConfig } from './helpers'

export type NftContentItem = {
  contractAddress: string;
  tokenId: string;
};

export type FtContentItem = {
  contractAddress: string;
  tokenAmount: string;
  dropType: 'fixed' | 'variable';
  dropAmountFrom: string;
  dropAmountTo: string;
};

export type NearContentItem = {
  tokenAmount: string;
  dropType: 'fixed' | 'variable';
  dropAmountFrom: string;
  dropAmountTo: string;
};

export type Lootbox = {
  id?: string;
  // name: string;
  // message: string;
  pictureId: number;
  dropChance: number;
  nearContentItems: NearContentItem[];
  nftContentItems: NftContentItem[];
  ftContentItems: FtContentItem[];
  status?: 'created' | 'filled' | 'payed' | 'dropping' | 'dropped';
};

export type BoxCreationPrice = {
  fillAmount: string;
  gasAmount: string;
  feeAmount: string;
  totalAmount: string;
};

export type LootboxStat = {
  totalAmount: string;
  winAmount: string;
  currentBalance: string;
  totalViews: number;
  completedPercents: string;
  remainingPercents: string;
};

export type LootboxWinner = {
  nearAccount: string;
  amount: string;
  txLink: string;
};

export enum LootboxClaimStatus {
  CLOSED = 0, // Not opened
  EMPTY = 1, // Opened and empty
  FULL = 2, // Opened and full
}

export type ClaimedNftContentItem = {
  contractAddress: string;
  tokenId: string | null;
};

export type ClaimedFtContentItem = {
  contractAddress: string;
  tokenAmount: string;
};

export type ClaimedNearContentItem = {
  tokenAmount: string;
};

export interface LootboxClaimResult {
  status: LootboxClaimStatus;
  nearContentItems: ClaimedNearContentItem[];
  nftContentItems: ClaimedNftContentItem[];
  ftContentItems: ClaimedFtContentItem[];
}

export interface FtMetadata {
  spec: string;
  name: string;
  symbol: string;
  icon: string;
  reference: string;
  reference_hash: string;
  decimals: number;
}

export interface IDappletApiForLanding {
  getLootboxById(lootboxId: string): Promise<Lootbox | null>;
  getLootboxStat(lootboxId: string): Promise<LootboxStat | null>;
}

export interface IDappletApi extends IDappletApiForLanding {
  connectWallet: () => Promise<string>;
  disconnectWallet: () => Promise<void>;
  isWalletConnected: () => Promise<boolean>;
  getCurrentNearAccount: () => Promise<string>;

  getBoxesByAccount(account: string, from_index?: number, limit?: number): Promise<Lootbox[]>;
  createNewBox(lootbox: Lootbox): Promise<string>;

  calcBoxCreationPrice(lootbox: Lootbox): Promise<BoxCreationPrice>;
  getLootboxWinners(lootboxId: string): Promise<LootboxWinner[]>;

  _getLootboxClaimStatus(lootboxId: string, accountId: string): Promise<LootboxClaimResult>;
  _claimLootbox(lootboxId: string, accountId: string): Promise<LootboxClaimResult>;

  getFtMetadata(address: string): Promise<FtMetadata | null>;
  getNetworkConfig(): Promise<NetworkConfig>;
}
