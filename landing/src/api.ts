import {
  FtMetadata,
  IDappletApiForLanding,
  Lootbox,LootboxWinner,
  LootboxStat,
} from '@loot-box/common/interfaces';
import * as nearAPI from 'near-api-js';
import * as format from './format';
import { utils } from 'ethers';
import { sum, groupBy, sub, div, mul, toPrecision, zerofyEmptyString } from './helpers';

const { connect, keyStores, WalletConnection, Contract } = nearAPI;

export class DappletApi implements IDappletApiForLanding {
  private _contract = this.getContract();

  constructor(
    private _config: {
      networkId: 'mainnet' | 'testnet';
      contractAddress: string;
      nodeUrl: string;
      walletUrl: string;
      helperUrl: string;
      explorerUrl: string;
    },
  ) {}

  async getLootboxById(lootboxId: string): Promise<Lootbox | null> {
    if (lootboxId === undefined) return null;
    const contract = await this._contract;
    const lootbox = await contract.get_lootbox_by_id({ lootbox_id: lootboxId.toString() });
    if (!lootbox) return null;

    return this._fillTokenTickers(await this._convertLootboxFromContract(lootbox));
  }

  async getLootboxStat(lootboxId: string): Promise<LootboxStat | null> {
    if (lootboxId === undefined) return null;
    const contract = await this._contract;
    const lootbox = await contract.get_lootbox_by_id({ lootbox_id: lootboxId.toString() });
    const claims = await contract.get_claims_by_lootbox({ lootbox_id: lootboxId.toString() });

    const ft_token_contracts = [...lootbox.loot_items, ...claims].filter((x) => x['Ft'] || x['WinFt']).map(x => (x.Ft || x.WinFt).token_contract);
    const metadataArray = await Promise.all(ft_token_contracts.map(x => this._getFtMetadata(x).then(y => ({ address: x, ...y }))));
    
    let remainedAmount = '0';
    let winLabel = '';
    for (const item of lootbox.loot_items) {
      if (item.Near !== undefined) {
        winLabel = 'Near';
        remainedAmount = sum(remainedAmount, utils.formatUnits(item.Near.balance, 24));
      } else if (item.Ft !== undefined) {
        winLabel = 'Token';
        const metadata = metadataArray.find(x => x.address === item.Ft.token_contract);
        if (!metadata) throw new Error("Lootbox: no metadata found.");
        remainedAmount = sum(remainedAmount, utils.formatUnits(item.Ft.balance, metadata.decimals));
      } else if (item.Nft !== undefined) {
        winLabel = 'NFT';
        // console.error('Total amount calculation is not implemented for NFT.');
        remainedAmount = sum(remainedAmount, '1'); // ToDo: how to calculate statistics of NFT?
      } else {
        console.error('Unknown loot item');
      }
    }

    let winAmount = '0';

    for (const item of claims) {
      if (item.WinNear !== undefined) {
        winAmount = sum(winAmount, utils.formatUnits(item.WinNear.total_amount, 24));
      } else if (item.WinFt !== undefined) {
        const metadata = metadataArray.find(x => x.address === item.WinFt.token_contract);
        if (!metadata) throw new Error("Lootbox: no metadata found.");
        winAmount = sum(winAmount, utils.formatUnits(item.WinFt.total_amount, metadata.decimals));
        // console.error('Total amount calculation is not implemented for FT.');
      } else if (item.WinNft !== undefined) {
        // console.error('Total amount calculation is not implemented for NFT.');
        winAmount = sum(winAmount, '1'); // ToDo: how to calculate statistics of NFT?
      } else if (item.NotWin !== undefined) {
        // Nothing to do
      } else {
        console.error('Unknown loot item');
      }
    }

    const totalAmount = sum(remainedAmount, winAmount);
    const completedPercents = totalAmount === '0' ? '0' : mul(div(winAmount, totalAmount), '100');
    const remainingPercents = totalAmount === '0' ? '0' : sub('100', completedPercents);

    const result = {
      totalAmount: totalAmount,
      winAmount: winAmount,
      currentBalance: remainedAmount,
      totalViews: claims.length,
      completedPercents: toPrecision(completedPercents, 3),
      remainingPercents: toPrecision(remainingPercents, 3),
      winLabel: winLabel,
    };
    
    console.log(result)

    return result;
  }

  async getContract(): Promise<any> {
    const config = {
      ...this._config,
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      headers: {},
    };

    const near = await connect(config);

    // create wallet connection
    const wallet = new WalletConnection(near, null);

    const contract = new Contract(wallet.account(), this._config.contractAddress, {
      viewMethods: ['get_lootbox_by_id', 'get_claims_by_lootbox'],
      changeMethods: [],
    });

    return contract;
  }
  async getLootboxWinners(lootboxId: string): Promise<LootboxWinner[]> {
  
    const contract = await this._contract;
    const claims = await contract.get_claims_by_lootbox({
      lootbox_id: lootboxId.toString(),
      from_index: null,
      limit: null,
    });

    const ft_token_contracts: string[] = claims.filter((x:any) => (typeof x === 'object' && x.WinFt !== undefined)).map((x:any) => x.WinFt.token_contract);
    const metadataArray = await Promise.all(ft_token_contracts.map(x => this._getFtMetadata(x).then(y => ({ address: x, ...y }))));

    const result = claims.map((x:any) => {
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
          amount: toPrecision(utils.formatUnits(x.WinNear.total_amount, 24), 6),
          txLink: null,
        };
      } else if (typeof x === 'object' && x.WinFt !== undefined) {
        const metadata = metadataArray.find(y => y.address === x.WinFt.token_contract);
        return {
          lootboxId: x.WinFt.lootbox_id,
          nearAccount: x.WinFt.claimer_id,
          amount: toPrecision(utils.formatUnits(x.WinFt.total_amount, metadata!.decimals), 6), // ToDo: get metadata
          txLink: null,
        };
      } else if (typeof x === 'object' && x.WinNft !== undefined) {
        return {
          lootboxId: x.WinNft.lootbox_id,
          nearAccount: x.WinNft.claimer_id,
          amount: `NFT: ${x.WinNft.token_contract} / ${x.WinNft.token_id}`,
          txLink: null,
        };
      } else {
        console.error('Unknown claim result', x);
        throw new Error('Unknown claim result.');
      }
    });

  

    return result;
  }

  public async getFtMetadata(address: string): Promise<FtMetadata | null> {
    try {
      const config = {
        ...this._config,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        headers: {},
      };

      const near = await connect(config);

      // create wallet connection
      const wallet = new WalletConnection(near, null);

      const contract: any = new Contract(wallet.account(), address, {
        viewMethods: ['ft_metadata'],
        changeMethods: [],
      });

      return contract.ft_metadata();
    } catch (_) {
      console.error('Unknown address', _);
      return null;
    }
  }
  private async _getFtMetadata(address: string): Promise<FtMetadata | null> {
    try {
      const config = {
        ...this._config,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        headers: {},
      };
      const near = await connect(config);
      const wallet = new WalletConnection(near, null);
      const contract: any = new Contract(wallet.account(), address, {
        viewMethods: ['ft_metadata'],
        changeMethods: [],
      });

      return contract.ft_metadata();
    } catch (_) {
      // console.error('Unknown address', _);
      return null;
    }
  }

  private async _convertLootboxFromContract(x: any):  Promise<Lootbox>  {
    const all_loot_items = [...x.loot_items];
    const ft_token_contracts = all_loot_items.filter((x) => x['Ft']).map(x => x.Ft.token_contract);
    const metadataArray = await Promise.all(ft_token_contracts.map(x => this._getFtMetadata(x).then(y => ({ address: x, ...y }))));
    
    return {
      id: x.id,
      pictureId: x.picture_id,
      dropChance: Math.floor((x.drop_chance * 100) / 255),
      ownerId: x.owner_id,
      status: x.status.toLowerCase(),
      nearContentItems: all_loot_items
        .filter((x) => x['Near'])
        .map((x) => ({
          tokenAmount: utils.formatUnits(x.Near.total_amount, 24),
          dropAmountFrom: utils.formatUnits(x.Near.drop_amount_from, 24),
          dropAmountTo: utils.formatUnits(x.Near.drop_amount_to, 24),
          dropType: x.Near.drop_amount_from === x.Near.drop_amount_to ? 'fixed' : 'variable',
        })),
      ftContentItems: all_loot_items
        .filter((x) => x['Ft'])
        .map((x) => {
          const metadata = metadataArray.find(y => y.address === x.Ft.token_contract);
          if (!metadata) throw new Error("Lootbox: no metadata found.");

          return ({
            contractAddress: x.Ft.token_contract,
            tokenAmount: utils.formatUnits(x.Ft.total_amount, metadata.decimals),
            dropAmountFrom: utils.formatUnits(x.Ft.drop_amount_from, metadata.decimals),
            dropAmountTo: utils.formatUnits(x.Ft.drop_amount_to, metadata.decimals),
            dropType: x.Ft.drop_amount_from === x.Ft.drop_amount_to ? 'fixed' : 'variable',
            tokenTicker: metadata.symbol
          });
        }),
      nftContentItems: all_loot_items
        .filter((x) => x['Nft'])
        .map((x) => ({
          contractAddress: x.Nft.token_contract,
          tokenId: x.Nft.token_id,
        })),
    };
  }

  private async _fillTokenTickers(lootbox: Lootbox) {
    for (const loot of lootbox.ftContentItems) {
      try {
        const metadata = await this.getFtMetadata(loot.contractAddress);
        if (!metadata) return lootbox;
        loot.tokenTicker = metadata.symbol;
      } catch (e) {
        console.error(`Cannot fetch metadata of ${loot.contractAddress} token`, e);
      }
    }

    return lootbox;
  }
}
