export type NftContentItem = {
  contractAddress: string;
  tokenId: number | null;
  quantity: number | null;
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
  id?: number;
  name: string;
  pictureId: number;
  dropChance: number;
  nearContentItems: NearContentItem[];
  nftContentItems: NftContentItem[];
  ftContentItems: FtContentItem[];
  status?: 'created' | 'filled' | 'payed' | 'dropping' | 'dropped';
};

export type BoxCreationPrice = {
  fillAmount: number;
  gasAmount: number;
  feeAmount: number;
};

export type LootboxStat = {
  totalAmount: number;
  winAmount: number;
  currentBalance: number;
  totalViews: number;
};

export type LootboxWinner = {
  nearAccount: string;
  amount: number;
  txLink: string;
};

export interface IDappletApi {
  connectWallet: () => Promise<string>;
  disconnectWallet: () => Promise<void>;
  isWalletConnected: () => Promise<boolean>;
  getCurrentNearAccount: () => Promise<string>;

  getBoxesByAccount(account: string): Promise<Lootbox[]>;
  createNewBox(lootbox: Lootbox): Promise<number>;
  calcBoxCreationPrice(lootbox: Lootbox): Promise<BoxCreationPrice>;
  getLootboxStat(lootboxId: number): Promise<LootboxStat>;
  getLootboxWinners(lootboxId: number): Promise<LootboxWinner[]>;

  clearAll: () => Promise<void>;
}
