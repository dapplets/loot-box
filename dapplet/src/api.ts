import {
  IDappletApi,
  Lootbox,
  BoxCreationPrice,
  LootboxStat,
  LootboxWinner,
  LootboxClaimResult,
  FtMetadata,
} from '../../common/interfaces';
import { sum, groupBy } from './helpers';
import { BN } from './bn.js';
import * as format from './format';

const { parseNearAmount, formatNearAmount } = Core.near.utils.format;
const { transactions } = Core.near;

export class DappletApi implements IDappletApi {
  private _contract = Core.contract('near', 'dev-1651162408741-46233879712819', {
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

  async getLootboxById(lootboxId: string): Promise<Lootbox> {
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
    const { account } = contract;

    const prices = await this.calcBoxCreationPrice(lootbox);

    const lootboxStruct = this._convertLootboxToContract(lootbox);

    const nftItems = lootboxStruct.loot_items.filter((x) => 'Nft' in x).map((x) => x['Nft']);

    const approveResults = await Promise.all(nftItems.map((x) =>
      account.viewFunction(x.token_contract, 'nft_is_approved', {
        token_id: x.token_id,
        approved_account_id: 'dev-1651162408741-46233879712819',
      }).then(is_approved => ({ ...x, is_approved }))
    ));

    const nonApprovedNftItems = approveResults.filter(x => x.is_approved === false);

    if (nonApprovedNftItems.length > 0) {
      const nftItemsByContract = groupBy(nonApprovedNftItems, 'token_contract');
      for (const contractId in nftItemsByContract) {
        const tokenIds = nftItemsByContract[contractId].map((x) => x.token_id);
        const actions = tokenIds.map((x) =>
          transactions.functionCall(
            'nft_approve',
            {
              token_id: x,
              account_id: contract.contractId,
            },
            new BN(Math.floor(300000000000000 / tokenIds.length).toString()), // split 300 Tgas for every action
            new BN('1000000000000000000000'), // for storage More info: https://github.com/near/near-sdk-rs/blob/fe6b193ec14d2fc2a0b9030b61892e37d7ad835f/near-contract-standards/src/non_fungible_token/utils.rs#L5
          ),
        );

        const result = await account.signAndSendTransaction(contractId, actions);
      }
    }

    const receipt = await contract.account.functionCall(
      contract.contractId,
      'create_lootbox',
      lootboxStruct,
      new BN('300000000000000'),
      parseNearAmount(prices.fillAmount),
    );

    const debased64 = atob(receipt.status.SuccessValue);
    const result = JSON.parse(debased64);

    if (typeof result === 'string') {
      return result;
    } else if (typeof result === 'object' && 'Right' in result) {
      return result.Right;
    } else {
      throw new Error('Invalid result received: ' + debased64);
    }
  }

  async calcBoxCreationPrice(lootbox: Lootbox): Promise<BoxCreationPrice> {
    const lootboxStruct = this._convertLootboxToContract(lootbox);

    let fillAmount = '0';

    for (const item of lootboxStruct.loot_items) {
      if ('Near' in item) {
        fillAmount = sum(fillAmount, item.Near.total_amount);
      } else if ('Nft' in item) {
        fillAmount = sum(fillAmount, '1'); // 1 yoctoNEAR is required
      } else if ('Ft' in item) {
        fillAmount = sum(fillAmount, '1'); // 1 yoctoNEAR is required
      } else {
        console.error('Unknown loot_item', item);
      }
    }

    return {
      feeAmount: '0',
      fillAmount: formatNearAmount(fillAmount),
      gasAmount: formatNearAmount('300000000000000'),
      totalAmount: formatNearAmount(sum('0', fillAmount, parseNearAmount('0.01'))),
    };
  }

  async getLootboxStat(lootboxId: string): Promise<LootboxStat> {
    if (lootboxId === undefined) return null;
    const contract = await this._contract;
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

  async getLootboxWinners(lootboxId: string): Promise<LootboxWinner[]> {
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
      } else if (typeof x === 'object' && x.WinFt !== undefined) {
        return {
          lootboxId: x.WinFt.lootbox_id,
          nearAccount: x.WinFt.claimer_id,
          amount: format.formatNearAmount(x.WinFt.total_amount, 6),
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
  }

  // @CacheMethod()
  public async getFtMetadata(address: string): Promise<FtMetadata | null> {
    try {
      const contract = await Core.contract('near', address, {
        viewMethods: ['ft_metadata'],
        changeMethods: [],
        network: 'testnet',
      });

      return contract.ft_metadata();
    } catch (_) {
      return null;
    }
  }

  public async _getLootboxClaimStatus(
    lootboxId: string,
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

  public async _claimLootbox(lootboxId: string, accountId: string): Promise<LootboxClaimResult> {
    const contract = await this._contract;

    const receipt = await contract.account.functionCall(
      contract.contractId,
      'claim_lootbox',
      {
        lootbox_id: lootboxId.toString(),
      },
      new BN('300000000000000'),
    );

    const result = JSON.parse(atob(receipt.status.SuccessValue));

    return this._convertClaimResultFromContract(result);
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
            total_amount: format.parseNearAmount(x.tokenAmount, 6),
            drop_amount_from: format.parseNearAmount(x.dropAmountFrom, 6),
            drop_amount_to: format.parseNearAmount(x.dropAmountTo, 6),
            balance: format.parseNearAmount(x.tokenAmount, 6),
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
    } else if (typeof claim_status === 'object' && claim_status.WinNft) {
      return {
        status: 2,
        nearContentItems: [],
        ftContentItems: [],
        nftContentItems: [
          {
            contractAddress: claim_status.WinNft.token_contract,
            tokenId: claim_status.WinNft.token_id,
          },
        ],
      };
    } else if (typeof claim_status === 'object' && claim_status.WinFt) {
      return {
        status: 2,
        nearContentItems: [],
        ftContentItems: [
          {
            contractAddress: claim_status.WinFt.token_contract,
            tokenAmount: format.formatNearAmount(claim_status.WinFt.total_amount.toString(), 6),
          },
        ],
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
