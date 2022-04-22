import {
  IDappletApi,
  Lootbox,
  BoxCreationPrice,
  LootboxStat,
  LootboxWinner,
  LootboxClaimStatus,
  LootboxClaimResult,
} from '../../common/interfaces';

const { parseNearAmount, formatNearAmount } = Core.near.utils.format;

export class DappletApi implements IDappletApi {
  private _contract = Core.contract('near', 'dev-1650658484393-79396311861979', {
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

  async createNewBox(lootbox: Lootbox): Promise<number> {
    const contract = await this._contract;
    const id = await contract.create_lootbox({
      picture_id: lootbox.pictureId,
      drop_chance: lootbox.dropChance,
      loot_items: [
        ...lootbox.nearContentItems.map((x) => ({
          Near: {
            total_amount: parseNearAmount(x.tokenAmount),
            drop_amount_from: parseNearAmount(x.dropAmountFrom),
            drop_amount_to: parseNearAmount(x.dropAmountTo),
          },
        })),
        ...lootbox.ftContentItems.map((x) => ({
          Ft: {
            token_contract: x.contractAddress,
            total_amount: parseNearAmount(x.tokenAmount),
            drop_amount_from: parseNearAmount(x.dropAmountFrom),
            drop_amount_to: parseNearAmount(x.dropAmountTo),
          },
        })),
        ...lootbox.nftContentItems.map((x) => ({
          Nft: {
            token_contract: x.contractAddress,
            token_id: x.tokenId,
          },
        })),
      ],
    });
    return id;
  }

  async calcBoxCreationPrice(lootbox: Lootbox): Promise<BoxCreationPrice> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      feeAmount: 0.1,
      fillAmount: 10,
      gasAmount: 0.003,
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
        console.error("Total amount calculation is not implemented for FT.");        
      } else if (item.Nft !== undefined) {
        console.error("Total amount calculation is not implemented for NFT.");
      } else {
        console.error("Unknown loot item");
      }
    }

    const claims = await contract.get_claims_by_lootbox({ lootbox_id: lootboxId.toString() });

    let winAmount = 0;

    for (const item of claims) {
      if (item.WinNear !== undefined) {
        winAmount += Number(formatNearAmount(item.WinNear.total_amount));
      } else if (item.WinFt !== undefined) {
        console.error("Total amount calculation is not implemented for FT.");        
      } else if (item.WinNft !== undefined) {
        console.error("Total amount calculation is not implemented for NFT.");
      } else {
        console.error("Unknown loot item");
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

    /*
NotExists,
    NotOpened,
    NotWin,
    WinNear { total_amount: u64 },
    WinFt { token_contract: AccountId, total_amount: u64 },
    WinNft { token_contract: AccountId, token_id: u64 },

    */

    return claims.map((x) => {
      if (typeof x === 'object' && x.NotWin !== undefined) {
        return {
          lootboxId: x.NotWin.lootbox_id,
          nearAccount: x.NotWin.claimer_id,
          amount: "0",
          txLink: null,
        };
      }
      if (typeof x === 'object' && x.WinNear !== undefined) {
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

    console.log('claim_status', claim_status);

    const result = this._convertClaimResultFromContract(claim_status);
    console.log('claim_result', result);
    return result;
  }

  public async _claimLootbox(lootboxId: number, accountId: string): Promise<LootboxClaimResult> {
    const contract = await this._contract;

    const claim_status = await contract.claim_lootbox({
      lootbox_id: lootboxId.toString(),
    });

    console.log('claim_status', claim_status);

    return this._convertClaimResultFromContract(claim_status);
  }

  private _convertLootboxFromContract(x: any): Lootbox {
    return {
      id: x.id,
      pictureId: x.picture_id,
      dropChance: x.drop_chance,
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
