import { IDappletApiForLanding, Lootbox, LootboxStat } from '../../common/interfaces';
import * as nearAPI from 'near-api-js';
import * as format from './format';

const { connect, keyStores, WalletConnection, Contract } = nearAPI;
const { formatNearAmount, parseNearAmount } = nearAPI.utils.format;

export class DappletApi implements IDappletApiForLanding {
  async getLootboxById(lootboxId: string): Promise<Lootbox | null> {
    if (lootboxId === undefined) return null;
    const contract = await this.getContract();
    const lootbox = await contract.get_lootbox_by_id({ lootbox_id: lootboxId.toString() });
    return lootbox ? this._convertLootboxFromContract(lootbox) : null;
  }

  async getLootboxStat(lootboxId: string): Promise<LootboxStat | null> {
    if (lootboxId === undefined) return null;
    const contract = await this.getContract();
    const lootbox = await contract.get_lootbox_by_id({ lootbox_id: lootboxId.toString() });

    const all_loot_items = [...lootbox.loot_items, ...lootbox.distributed_items];

    let totalAmount = 0;
    for (const item of all_loot_items) {
      if (item.Near !== undefined) {
        totalAmount += Number(formatNearAmount(item.Near.total_amount));
      } else if (item.Ft !== undefined) {
        console.error('Total amount calculation is not implemented for FT.');
      } else if (item.Nft !== undefined) {
        // console.error('Total amount calculation is not implemented for NFT.');
        totalAmount += 1; // ToDo: how to calculate statistics of NFT?
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
        // console.error('Total amount calculation is not implemented for NFT.');
        winAmount += 1; // ToDo: how to calculate statistics of NFT?
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

  async getContract(): Promise<any> {
    const config = {
      networkId: 'testnet',
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
      headers: {},
    };

    const near = await connect(config);

    // create wallet connection
    const wallet = new WalletConnection(near, null);

    const contract = new Contract(wallet.account(), 'dev-1651162408741-46233879712819', {
      viewMethods: ['get_lootbox_by_id', 'get_claims_by_lootbox'],
      changeMethods: [],
    });

    return contract;
  }

  private _convertLootboxFromContract(x: any): Lootbox {
    const all_loot_items = [...x.loot_items, ...x.distributed_items];
    return {
      id: x.id,
      pictureId: x.picture_id,
      dropChance: Math.floor((x.drop_chance * 100) / 255),
      // ownerId: x.owner_id,
      status: x.status.toLowerCase(),
      nearContentItems: all_loot_items
        .filter((x) => x['Near'])
        .map((x) => ({
          tokenAmount: formatNearAmount(x.Near.total_amount),
          dropAmountFrom: formatNearAmount(x.Near.drop_amount_from),
          dropAmountTo: formatNearAmount(x.Near.drop_amount_to),
          dropType: x.Near.drop_amount_from === x.Near.drop_amount_to ? 'fixed' : 'variable',
        })),
      ftContentItems: all_loot_items
        .filter((x) => x['Ft'])
        .map((x) => ({
          contractAddress: x.Ft.token_contract,
          tokenAmount: format.formatNearAmount(x.Ft.total_amount, 6),
          dropAmountFrom: format.formatNearAmount(x.Ft.drop_amount_from, 6),
          dropAmountTo: format.formatNearAmount(x.Ft.drop_amount_to, 6),
          dropType: x.Ft.drop_amount_from === x.Ft.drop_amount_to ? 'fixed' : 'variable',
        })),
      nftContentItems: all_loot_items
        .filter((x) => x['Nft'])
        .map((x) => ({
          contractAddress: x.Nft.token_contract,
          tokenId: x.Nft.token_id,
        })),
    };
  }
}
