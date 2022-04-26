import {
  IDappletApi,
  Lootbox,
  BoxCreationPrice,
  LootboxStat,
  LootboxWinner,
  LootboxClaimStatus,
  LootboxClaimResult,
} from '../../common/interfaces';
import {} from '@dapplets/dapplet-extension';
function _createFakeLootbox(id: number): Lootbox {
  return {
    id: id,
    pictureId: id,
    dropChance: 0.5,
    status: 'created',
    nearContentItems: [],
    ftContentItems: [],
    nftContentItems: [
      {
        contractAddress: 'nft.testnet',
        tokenId: '',
        quantity: 1,
      },
      {
        contractAddress: 'nft.testnet',
        tokenId: '',
        quantity: 1,
      },
      {
        contractAddress: 'nft.testnet',
        tokenId: '',
        quantity: 1,
      },
    ],
  };
}

export class DappletApi implements IDappletApi {
  getLootboxById(lootboxId: number): Promise<Lootbox> {
    throw new Error('Method not implemented.');
  }
  _getLootboxClaimStatus(lootboxId: number, accountId: string): Promise<LootboxClaimResult> {
    throw new Error('Method not implemented.');
  }
  _claimLootbox(lootboxId: number, accountId: string): Promise<LootboxClaimResult> {
    throw new Error('Method not implemented.');
  }
  async connectWallet() {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    await wallet.connect();
    return wallet.accountId;
  }

  async disconnectWallet() {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    wallet.disconnect();
  }

  async isWalletConnected() {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    return wallet.isConnected();
  }

  async getCurrentNearAccount() {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    return wallet.accountId;
  }

  async getBoxesByAccount(account: string): Promise<Lootbox[]> {
    await new Promise((r) => setTimeout(r, 300));
    const lootboxes = this._getValue('lootboxes', []);
    if (lootboxes.length === 0) {
      return [1, 2, 3, 4, 5].map((x) => _createFakeLootbox(x));
    } else {
      return lootboxes;
    }
  }

  async createNewBox(lootbox: Lootbox): Promise<string> {
    await new Promise((r) => setTimeout(r, 3000));
    const lootboxes = this._getValue('lootboxes', []);
    const id = lootboxes.length + 1;
    lootbox.id = id;
    lootboxes.push(lootbox);
    this._setValue('lootboxes', lootboxes);
    return id;
  }

  async calcBoxCreationPrice(lootbox: Lootbox): Promise<BoxCreationPrice> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      feeAmount: "0.1",
      fillAmount: "10",
      gasAmount: "0.003",
      totalAmount: "0"
    };
  }

  async getLootboxStat(lootboxId: number): Promise<LootboxStat> {
    await new Promise((r) => setTimeout(r, 1000));
    return {
      totalAmount: lootboxId * 10,
      winAmount: lootboxId * 2,
      currentBalance: lootboxId * 8,
      totalViews: lootboxId * 17,
    };
  }

  async getLootboxWinners(lootboxId: number): Promise<LootboxWinner[]> {
    await new Promise((r) => setTimeout(r, 1000));
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => ({
      nearAccount: `tester_${x}.testnet`,
      amount: x / 10,
      txLink:
        'https://explorer.testnet.near.org/transactions/59S6ZUhgjnCXKiu7rWcf3N2tMkGrDjDysqZSQ2dJUnmy',
    }));
  }

  async getLootboxClaimStatus(lootboxId: number, accountId: string): Promise<LootboxClaimStatus> {
    await new Promise((r) => setTimeout(r, 500));
    const lootboxStatuses = this._getValue('lootboxes-status', []);
    const entry = lootboxStatuses.find(
      (x: any) => x.lootboxId === lootboxId && x.accountId === accountId,
    );
    return entry?.status ?? 0;
  }

  async claimLootbox(lootboxId: number, accountId: string): Promise<LootboxClaimStatus> {
    await new Promise((r) => setTimeout(r, 4000));
    if ((await this.getLootboxClaimStatus(lootboxId, accountId)) !== 0) {
      throw new Error('The lootbox is opened already.');
    }

    const lootboxStatuses = this._getValue('lootboxes-status', []);

    const status: LootboxClaimStatus = getRandomIntInclusive(0, 2);

    lootboxStatuses.push({
      lootboxId,
      accountId,
      status,
    });

    this._setValue('lootboxes-status', lootboxStatuses);

    return status;
  }

  private _getValue(key: string, defaultValue: any): any {
    return localStorage[key] ? JSON.parse(localStorage[key]) : defaultValue;
  }

  private _setValue(key: string, value: any) {
    localStorage[key] = JSON.stringify(value);
  }
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
