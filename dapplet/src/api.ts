import {
  IDappletApi,
  Lootbox,
  BoxCreationPrice,
  LootboxStat,
  LootboxWinner,
  LootboxClaimResult,
} from '../../common/interfaces';
import { sum } from './helpers';

const { parseNearAmount, formatNearAmount } = Core.near.utils.format;

export class DappletApi implements IDappletApi {
  private _contract = Core.contract('near', 'dev-1650928735605-51635263468190', {
    viewMethods: [
      'get_lootbox_by_id',
      'get_lootboxes_by_account',
      'get_claim_by_id',
      'get_lootbox_claim_status',
      'get_claims_by_lootbox',
    ],
    changeMethods: ['create_lootbox', 'claim_lootbox'],
    network: 'testnet',
  });

  async getLootboxById(lootboxId: number): Promise<Lootbox> {
    if (lootboxId === undefined) return null;
    const contract = await this._contract;
    const lootbox = await contract.get_lootbox_by_id({ lootbox_id: lootboxId.toString() });
    return lootbox ? this._convertLootboxFromContract(lootbox) : null;
  }

  async connectWallet(): Promise<string> {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    await wallet.connect();
    return wallet.accountId;
  }

  async disconnectWallet(): Promise<void> {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    wallet.disconnect();
  }

  async isWalletConnected(): Promise<boolean> {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    return wallet.isConnected();
  }

  async getCurrentNearAccount(): Promise<string> {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    return wallet.accountId;
  }

  async getBoxesByAccount(account_id: string): Promise<Lootbox[]> {
    const contract = await this._contract;
    const lootboxes_ = await contract.get_lootboxes_by_account({
      account_id,
      from_index: null,
      limit: null,
    });

    return lootboxes_.map((x) => this._convertLootboxFromContract(x));
  }

  async createNewBox(lootbox: Lootbox): Promise<string> {
    const contract = await this._contract;
    const prices = await this.calcBoxCreationPrice(lootbox);

    const lootboxStruct = this._convertLootboxToContract(lootbox);

    const receipt = await contract.account.functionCall(
      contract.contractId,
      'create_lootbox',
      lootboxStruct,
      undefined,
      parseNearAmount(prices.fillAmount),
    );

    const id = JSON.parse(atob(receipt.lootboxId.status.SuccessValue));

    return id;
  }

  async calcBoxCreationPrice(lootbox: Lootbox): Promise<BoxCreationPrice> {
    const lootboxStruct = this._convertLootboxToContract(lootbox);

    let fillAmount = '0';

    for (const item of lootboxStruct.loot_items) {
      if ('Near' in item) {
        fillAmount = sum(fillAmount, item.Near.total_amount);
      }
    }

    return {
      feeAmount: '0',
      fillAmount: formatNearAmount(fillAmount),
      gasAmount: '0.01',
      totalAmount: formatNearAmount(sum('0', fillAmount, parseNearAmount('0.01'))),
    };
  }

  async getLootboxStat(lootboxId: number): Promise<LootboxStat> {
    if (lootboxId === undefined) return null;
    const contract = await this._contract;
    const lootbox = await contract.get_lootbox_by_id({ lootbox_id: lootboxId.toString() });

    let totalAmount = 0;
    for (const item of lootbox.loot_items) {
      if (item.Near !== undefined) {
        totalAmount += Number(formatNearAmount(item.Near.total_amount));
      } else if (item.Ft !== undefined) {
        console.error('Total amount calculation is not implemented for FT.');
      } else if (item.Nft !== undefined) {
        console.error('Total amount calculation is not implemented for NFT.');
      } else {
        console.error('Unknown loot item');
      }
    }

    const claims = await contract.get_claims_by_lootbox({ lootbox_id: lootboxId.toString() });

    let winAmount = 0;

    for (const item of claims) {
      if (item.WinNear !== undefined) {
        winAmount += Number(formatNearAmount(item.WinNear.total_amount));
      } else if (item.WinFt !== undefined) {
        console.error('Total amount calculation is not implemented for FT.');
      } else if (item.WinNft !== undefined) {
        console.error('Total amount calculation is not implemented for NFT.');
      } else if (item.NotWin !== undefined) {
        // Nothing to do
      } else {
        console.error('Unknown loot item');
      }
    }

    return {
      totalAmount: totalAmount,
      winAmount: winAmount,
      currentBalance: totalAmount - winAmount,
      totalViews: claims.length,
    };
  }

  async getLootboxWinners(lootboxId: number): Promise<LootboxWinner[]> {
    const contract = await this._contract;
    const claims = await contract.get_claims_by_lootbox({
      lootbox_id: lootboxId.toString(),
      from_index: null,
      limit: null,
    });

    return claims.map((x) => {
      if (typeof x === 'object' && x.NotWin !== undefined) {
        return {
          lootboxId: x.NotWin.lootbox_id,
          nearAccount: x.NotWin.claimer_id,
          amount: '0',
          txLink: null,
        };
      } else if (typeof x === 'object' && x.WinNear !== undefined) {
        return {
          lootboxId: x.WinNear.lootbox_id,
          nearAccount: x.WinNear.claimer_id,
          amount: formatNearAmount(x.WinNear.total_amount),
          txLink: null,
        };
      } else {
        throw new Error('Unknown claim result.');
      }
    });
  }

  public async _getLootboxClaimStatus(
    lootboxId: number,
    accountId: string,
  ): Promise<LootboxClaimResult> {
    const contract = await this._contract;

    const claim_status = await contract.get_lootbox_claim_status({
      lootbox_id: lootboxId.toString(),
      account_id: accountId,
    });

    const result = this._convertClaimResultFromContract(claim_status);
    return result;
  }

  public async _claimLootbox(lootboxId: number, accountId: string): Promise<LootboxClaimResult> {
    const contract = await this._contract;

    const claim_status = await contract.claim_lootbox({
      lootbox_id: lootboxId.toString(),
    });

    return this._convertClaimResultFromContract(claim_status);
  }

  private _convertLootboxFromContract(x: any): Lootbox {
    return {
      id: x.id,
      pictureId: x.picture_id,
      dropChance: Math.floor((x.drop_chance * 100) / 255),
      // ownerId: x.owner_id,
      status: { 0: 'created', 1: 'filled', 2: 'payed', 3: 'dropping', 4: 'dropped' }[x.status], // ToDo: why is string here?
      nearContentItems: x.loot_items
        .filter((x) => x['Near'])
        .map((x) => ({
          tokenAmount: formatNearAmount(x.Near.total_amount),
          dropAmountFrom: formatNearAmount(x.Near.drop_amount_from),
          dropAmountTo: formatNearAmount(x.Near.drop_amount_to),
          dropType: x.Near.drop_amount_from === x.Near.drop_amount_to ? 'fixed' : 'variable',
        })),
      ftContentItems: x.loot_items
        .filter((x) => x['Ft'])
        .map((x) => ({
          contractAddress: x.Ft.token_contract,
          tokenAmount: formatNearAmount(x.Ft.total_amount),
          dropAmountFrom: formatNearAmount(x.Ft.drop_amount_from),
          dropAmountTo: formatNearAmount(x.Ft.drop_amount_to),
          dropType: x.Ft.drop_amount_from === x.Ft.drop_amount_to ? 'fixed' : 'variable',
        })),
      nftContentItems: x.loot_items
        .filter((x) => x['Nft'])
        .map((x) => ({
          contractAddress: x.Nft.token_contract,
          tokenId: x.Nft.token_id,
        })),
    };
  }

  private _convertLootboxToContract(lootbox: Lootbox) {
    return {
      picture_id: lootbox.pictureId,
      drop_chance: Math.floor((lootbox.dropChance * 255) / 100),
      loot_items: [
        ...lootbox.nearContentItems.map((x) => ({
          Near: {
            total_amount: parseNearAmount(x.tokenAmount),
            drop_amount_from: parseNearAmount(x.dropAmountFrom),
            drop_amount_to: parseNearAmount(x.dropAmountTo),
            balance: parseNearAmount(x.tokenAmount),
          },
        })),
        ...lootbox.ftContentItems.map((x) => ({
          Ft: {
            token_contract: x.contractAddress,
            total_amount: parseNearAmount(x.tokenAmount),
            drop_amount_from: parseNearAmount(x.dropAmountFrom),
            drop_amount_to: parseNearAmount(x.dropAmountTo),
            balance: parseNearAmount(x.tokenAmount),
          },
        })),
        ...lootbox.nftContentItems.map((x) => ({
          Nft: {
            token_contract: x.contractAddress,
            token_id: x.tokenId,
          },
        })),
      ],
    };
  }

  private _convertClaimResultFromContract(claim_status: any): LootboxClaimResult {
    if (claim_status === 'NotOpened') {
      return {
        status: 0, //LootboxClaimStatus.CLOSED,
        nearContentItems: [],
        ftContentItems: [],
        nftContentItems: [],
      };
    } else if (typeof claim_status === 'object' && claim_status.WinNear) {
      return {
        status: 2,
        nearContentItems: [
          {
            tokenAmount: formatNearAmount(claim_status.WinNear.total_amount.toString()),
          },
        ],
        ftContentItems: [],
        nftContentItems: [],
      };
    } else if (typeof claim_status === 'object' && claim_status.NotWin) {
      return {
        status: 1,
        nearContentItems: [],
        ftContentItems: [],
        nftContentItems: [],
      };
    } else {
      throw new Error('Unknown claim result');
    }
  }
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
