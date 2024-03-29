import { NetworkConfig } from '@loot-box/common/helpers'
import {
  BoxCreationPrice,
  FtMetadata,
  IDappletApi,
  Lootbox,
  LootboxClaimResult,
  LootboxStat,
  LootboxWinner,
} from '@loot-box/common/interfaces'
import { BN } from './bn.js'
import * as format from './format'
import { div, groupBy, mul, sub, sum, toPrecision, zerofyEmptyString } from './helpers'

const { parseNearAmount } = Core.near.utils.format
const { transactions } = Core.near
const { utils } = Core.ethers

const MAX_GAS_PER_TX = 300000000000000

export class DappletApi implements IDappletApi {
  private _contract
  private _cachedTokenMetadataPromises = new Map<string, Promise<FtMetadata | null>>()

  constructor(private _config: NetworkConfig) {
    this._contract = Core.contract('near', _config.contractAddress, {
      viewMethods: [
        'get_lootbox_by_id',
        'get_lootboxes_by_account',
        'get_claim_by_id',
        'get_lootbox_claim_status',
        'get_claims_by_lootbox',
      ],
      changeMethods: ['create_lootbox', 'claim_lootbox'],
      network: _config.networkId,
    })
  }

  async getLootboxById(lootboxId: string): Promise<Lootbox> {
    if (lootboxId === undefined) return null
    const contract = await this._contract
    const lootbox = await contract.get_lootbox_by_id({ lootbox_id: lootboxId.toString() })
    if (!lootbox) return null

    return await this._convertLootboxFromContract(lootbox)
  }

  async connectWallet(): Promise<string> {
    const wallet = await Core.wallet({ type: 'near', network: this._config.networkId as any })
    await wallet.connect()
    return wallet.accountId
  }

  async disconnectWallet(): Promise<void> {
    const wallet = await Core.wallet({ type: 'near', network: this._config.networkId as any })
    wallet.disconnect()
  }

  async isWalletConnected(): Promise<boolean> {
    const wallet = await Core.wallet({ type: 'near', network: this._config.networkId as any })
    return wallet.isConnected()
  }

  async getCurrentNearAccount(): Promise<string> {
    const wallet = await Core.wallet({ type: 'near', network: this._config.networkId as any })
    return wallet.accountId
  }

  async getBoxesByAccount(
    account_id: string,
    from_index?: number,
    limit?: number
  ): Promise<Lootbox[]> {
    if (!account_id) return []
    const contract = await this._contract
    const lootboxes_: any[] = await contract.get_lootboxes_by_account({
      account_id,
      from_index,
      limit,
    })

    return Promise.all(lootboxes_.map((x) => this._convertLootboxFromContract(x)))
  }

  async createNewBox(lootbox: Lootbox): Promise<string> {
    const contract = await this._contract
    const prices = await this.calcBoxCreationPrice(lootbox)
    const lootboxStruct = await this._convertLootboxToContract(lootbox)

    const nftItems = lootboxStruct.loot_items.filter((x) => 'Nft' in x).map((x) => x['Nft'])
    const ftItems = lootboxStruct.loot_items.filter((x) => 'Ft' in x).map((x) => x['Ft'])

    // remove nft and ft from loot_items to add them later
    lootboxStruct.loot_items = lootboxStruct.loot_items.filter((x) => 'Near' in x)

    // make transaction via functionCall to set a custom gas amount
    const receipt = await contract.account.functionCall(
      contract.contractId,
      'create_lootbox',
      lootboxStruct,
      new BN(MAX_GAS_PER_TX.toString()),
      parseNearAmount(prices.fillAmount)
    )

    const debased64 = atob(receipt.status.SuccessValue)
    const lootboxId = JSON.parse(debased64)

    // send transactions for nft transfering
    if (nftItems.length > 0) {
      // nfts from one contract are able to transfer in one batch tx
      const nftItemsByContract = groupBy(nftItems, 'token_contract')
      for (const contractId in nftItemsByContract) {
        const tokenIds = nftItemsByContract[contractId].map((x) => x.token_id)

        const actions = tokenIds.map((x) =>
          transactions.functionCall(
            'nft_transfer_call',
            {
              token_id: x,
              receiver_id: contract.contractId,
              msg: JSON.stringify({ lootbox_id: lootboxId }),
            },
            new BN(Math.floor(MAX_GAS_PER_TX / tokenIds.length).toString()), // split 300 Tgas for every action
            new BN('1') // 1 yoctoNEAR is required for NFT transfering
          )
        )

        await contract.account.signAndSendTransaction(contractId, actions)
      }
    }

    // send transactions for ft transfering
    if (ftItems.length > 0) {
      // ft from one contract are able to transfer in one batch tx
      const ftItemsByContract = groupBy(ftItems, 'token_contract')
      for (const contractId in ftItemsByContract) {
        const fts = ftItemsByContract[contractId]

        const storageBalance = await contract.account.viewFunction(
          contractId,
          'storage_balance_of',
          { account_id: contract.contractId }
        )

        const actions = []
        const actionsCount = !storageBalance ? fts.length + 1 : fts.length

        // top up storage balance for new tokens
        if (!storageBalance) {
          const balanceBounds = await contract.account.viewFunction(
            contractId,
            'storage_balance_bounds',
            {}
          )

          const storageDepositAction = transactions.functionCall(
            'storage_deposit',
            {
              account_id: contract.contractId,
            },
            new BN(Math.floor(MAX_GAS_PER_TX / actionsCount).toString()), // split 300 Tgas for every action
            new BN(balanceBounds.min)
          )

          actions.push(storageDepositAction)
        }

        actions.push(
          ...fts.map((x) =>
            transactions.functionCall(
              'ft_transfer_call',
              {
                receiver_id: contract.contractId,
                amount: x.total_amount,
                msg: JSON.stringify({
                  lootbox_id: lootboxId,
                  drop_amount_from: x.drop_amount_from,
                  drop_amount_to: x.drop_amount_to,
                }),
              },
              new BN(Math.floor(MAX_GAS_PER_TX / actionsCount).toString()), // split 300 Tgas for every action
              new BN('1') // 1 yoctoNEAR is required for FT transfering
            )
          )
        )

        await contract.account.signAndSendTransaction(contractId, actions)
      }
    }

    return lootboxId
  }

  async calcBoxCreationPrice(lootbox: Lootbox): Promise<BoxCreationPrice> {
    const lootboxStruct = await this._convertLootboxToContract(lootbox)

    let fillAmount = '0'

    for (const item of lootboxStruct.loot_items) {
      if ('Near' in item) {
        fillAmount = sum(fillAmount, item.Near.total_amount)
      } else if ('Nft' in item) {
        // fillAmount = sum(fillAmount, '1'); // 1 yoctoNEAR is required
      } else if ('Ft' in item) {
        // fillAmount = sum(fillAmount, '1'); // 1 yoctoNEAR is required
      } else {
        console.error('Unknown loot_item', item)
      }
    }

    const result = {
      feeAmount: '0',
      fillAmount: utils.formatUnits(fillAmount, 24),
      gasAmount: utils.formatUnits(MAX_GAS_PER_TX.toString(), 24),
      totalAmount: utils.formatUnits(sum('0', fillAmount, MAX_GAS_PER_TX.toString()), 24),
    }

    return result
  }

  async getLootboxStat(lootboxId: string): Promise<LootboxStat> {
    if (lootboxId === undefined) return null
    const contract = await this._contract
    const lootbox = await contract.get_lootbox_by_id({ lootbox_id: lootboxId.toString() })
    const claims = await contract.get_claims_by_lootbox({ lootbox_id: lootboxId.toString() })

    const ft_token_contracts = [...lootbox.loot_items, ...claims]
      .filter((x) => x['Ft'] || x['WinFt'])
      .map((x) => (x.Ft || x.WinFt).token_contract)
    const metadataArray = await Promise.all(
      ft_token_contracts.map((x) => this._getFtMetadata(x).then((y) => ({ address: x, ...y })))
    )

    let remainedAmount = '0'
    let winLabel = ''
    for (const item of lootbox.loot_items) {
      if (item.Near !== undefined) {
        winLabel = 'Near'
        remainedAmount = sum(remainedAmount, utils.formatUnits(item.Near.balance, 24))
      } else if (item.Ft !== undefined) {
        winLabel = 'Token'
        const metadata = metadataArray.find((x) => x.address === item.Ft.token_contract)
        if (!metadata) throw new Error('Lootbox: no metadata found.')
        remainedAmount = sum(remainedAmount, utils.formatUnits(item.Ft.balance, metadata.decimals))
      } else if (item.Nft !== undefined) {
        winLabel = 'NFT'
        // console.error('Total amount calculation is not implemented for NFT.');
        remainedAmount = sum(remainedAmount, '1') // ToDo: how to calculate statistics of NFT?
      } else {
        console.error('Unknown loot item')
      }
    }

    let winAmount = '0'

    for (const item of claims) {
      if (item.WinNear !== undefined) {
        winAmount = sum(winAmount, utils.formatUnits(item.WinNear.total_amount, 24))
      } else if (item.WinFt !== undefined) {
        const metadata = metadataArray.find((x) => x.address === item.WinFt.token_contract)
        if (!metadata) throw new Error('Lootbox: no metadata found.')
        winAmount = sum(winAmount, utils.formatUnits(item.WinFt.total_amount, metadata.decimals))
        // console.error('Total amount calculation is not implemented for FT.');
      } else if (item.WinNft !== undefined) {
        // console.error('Total amount calculation is not implemented for NFT.');
        winAmount = sum(winAmount, '1') // ToDo: how to calculate statistics of NFT?
      } else if (item.NotWin !== undefined) {
        // Nothing to do
      } else {
        console.error('Unknown loot item')
      }
    }

    const totalAmount = sum(remainedAmount, winAmount)
    const completedPercents = totalAmount === '0' ? '0' : mul(div(winAmount, totalAmount), '100')
    const remainingPercents = totalAmount === '0' ? '0' : sub('100', completedPercents)

    const result = {
      totalAmount: totalAmount,
      winAmount: winAmount,
      currentBalance: remainedAmount,
      totalViews: claims.length,
      completedPercents: toPrecision(completedPercents, 3),
      remainingPercents: toPrecision(remainingPercents, 3),
      winLabel: winLabel,
    }

    return result
  }

  async getLootboxWinners(lootboxId: string): Promise<LootboxWinner[]> {
    const contract = await this._contract
    const claims = await contract.get_claims_by_lootbox({
      lootbox_id: lootboxId.toString(),
      from_index: null,
      limit: null,
    })

    const ft_token_contracts: string[] = claims
      .filter((x) => typeof x === 'object' && x.WinFt !== undefined)
      .map((x) => x.WinFt.token_contract)
    const metadataArray = await Promise.all(
      ft_token_contracts.map((x) => this._getFtMetadata(x).then((y) => ({ address: x, ...y })))
    )

    const result = claims.map((x) => {
      if (typeof x === 'object' && x.NotWin !== undefined) {
        return {
          lootboxId: x.NotWin.lootbox_id,
          nearAccount: x.NotWin.claimer_id,
          amount: '0',
          txLink: null,
        }
      } else if (typeof x === 'object' && x.WinNear !== undefined) {
        return {
          lootboxId: x.WinNear.lootbox_id,
          nearAccount: x.WinNear.claimer_id,
          amount: toPrecision(utils.formatUnits(x.WinNear.total_amount, 24), 6),
          txLink: null,
        }
      } else if (typeof x === 'object' && x.WinFt !== undefined) {
        const metadata = metadataArray.find((y) => y.address === x.WinFt.token_contract)
        return {
          lootboxId: x.WinFt.lootbox_id,
          nearAccount: x.WinFt.claimer_id,
          amount: toPrecision(utils.formatUnits(x.WinFt.total_amount, metadata.decimals), 6), // ToDo: get metadata
          txLink: null,
        }
      } else if (typeof x === 'object' && x.WinNft !== undefined) {
        return {
          lootboxId: x.WinNft.lootbox_id,
          nearAccount: x.WinNft.claimer_id,
          amount: `NFT: ${x.WinNft.token_contract} / ${x.WinNft.token_id}`,
          txLink: null,
        }
      } else {
        console.error('Unknown claim result', x)
        throw new Error('Unknown claim result.')
      }
    })

    return result
  }

  public async getFtMetadata(address: string): Promise<FtMetadata | null> {
    if (this._cachedTokenMetadataPromises.has(address)) {
      return this._cachedTokenMetadataPromises.get(address)
    } else {
      const metadataPromise = this._getFtMetadata(address)
      this._cachedTokenMetadataPromises.set(address, metadataPromise)
      return metadataPromise
    }
  }

  private async _getFtMetadata(address: string): Promise<FtMetadata | null> {
    try {
      const contract = await Core.contract('near', address, {
        viewMethods: ['ft_metadata'],
        changeMethods: [],
        network: this._config.networkId,
      })

      return contract.ft_metadata()
    } catch (_) {
      // console.error('Unknown address', _);
      return null
    }
  }

  public async getNetworkConfig(): Promise<NetworkConfig> {
    return this._config
  }

  public async _getLootboxClaimStatus(
    lootboxId: string,
    accountId: string
  ): Promise<LootboxClaimResult> {
    const contract = await this._contract

    const claim_status = await contract.get_lootbox_claim_status({
      lootbox_id: lootboxId.toString(),
      account_id: accountId,
    })

    const result = await this._convertClaimResultFromContract(claim_status)
    return result
  }

  public async _claimLootbox(lootboxId: string, accountId: string): Promise<LootboxClaimResult> {
    const contract = await this._contract

    const receipt = await contract.account.functionCall(
      contract.contractId,
      'claim_lootbox',
      {
        lootbox_id: lootboxId.toString(),
      },
      new BN(MAX_GAS_PER_TX.toString()),
      parseNearAmount('0.005') // stake for storage management NEP-145
    )

    const result = JSON.parse(atob(receipt.status.SuccessValue))

    return await this._convertClaimResultFromContract(result)
  }

  private async _convertLootboxFromContract(x: any): Promise<Lootbox> {
    // _getFtMetadata

    const all_loot_items = [...x.loot_items]
    const ft_token_contracts = all_loot_items.filter((x) => x['Ft']).map((x) => x.Ft.token_contract)
    const metadataArray = await Promise.all(
      ft_token_contracts.map((x) => this._getFtMetadata(x).then((y) => ({ address: x, ...y })))
    )

    return {
      id: x.id,
      pictureId: x.picture_id,
      dropChance: Math.floor((x.drop_chance * 100) / 255),
      // ownerId: x.owner_id,
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
          const metadata = metadataArray.find((y) => y.address === x.Ft.token_contract)
          if (!metadata) throw new Error('Lootbox: no metadata found.')

          return {
            contractAddress: x.Ft.token_contract,
            tokenAmount: utils.formatUnits(x.Ft.total_amount, metadata.decimals),
            dropAmountFrom: utils.formatUnits(x.Ft.drop_amount_from, metadata.decimals),
            dropAmountTo: utils.formatUnits(x.Ft.drop_amount_to, metadata.decimals),
            dropType: x.Ft.drop_amount_from === x.Ft.drop_amount_to ? 'fixed' : 'variable',
            tokenTicker: metadata.symbol,
          }
        }),
      nftContentItems: all_loot_items
        .filter((x) => x['Nft'])
        .map((x) => ({
          contractAddress: x.Nft.token_contract,
          tokenId: x.Nft.token_id,
        })),
    }
  }

  private async _convertLootboxToContract(lootbox: Lootbox) {
    const ft_token_contracts = lootbox.ftContentItems.map((x) => x.contractAddress)
    const metadataArray = await Promise.all(
      ft_token_contracts.map((x) => this._getFtMetadata(x).then((y) => ({ address: x, ...y })))
    )

    return {
      picture_id: lootbox.pictureId,
      drop_chance: Math.floor((lootbox.dropChance * 255) / 100),
      loot_items: [
        ...lootbox.nearContentItems.map((x) => ({
          Near: {
            total_amount: parseNearAmount(zerofyEmptyString(x.tokenAmount)),
            drop_amount_from: parseNearAmount(zerofyEmptyString(x.dropAmountFrom)),
            drop_amount_to: parseNearAmount(zerofyEmptyString(x.dropAmountTo)),
            balance: parseNearAmount(zerofyEmptyString(x.tokenAmount)),
          },
        })),
        ...lootbox.ftContentItems.map((x) => {
          const metadata = metadataArray.find((y) => y.address === x.contractAddress)

          return {
            Ft: {
              token_contract: x.contractAddress,
              total_amount: format.parseNearAmount(
                zerofyEmptyString(x.tokenAmount),
                metadata.decimals
              ),
              drop_amount_from: format.parseNearAmount(
                zerofyEmptyString(x.dropAmountFrom),
                metadata.decimals
              ),
              drop_amount_to: format.parseNearAmount(
                zerofyEmptyString(x.dropAmountTo),
                metadata.decimals
              ),
              balance: format.parseNearAmount(zerofyEmptyString(x.tokenAmount), metadata.decimals),
            },
          }
        }),
        ...lootbox.nftContentItems.map((x) => ({
          Nft: {
            token_contract: x.contractAddress,
            token_id: x.tokenId,
          },
        })),
      ],
    }
  }

  private async _convertClaimResultFromContract(claim_status: any): Promise<LootboxClaimResult> {
    if (claim_status === 'NotOpened') {
      return {
        status: 0, //LootboxClaimStatus.CLOSED,
        nearContentItems: [],
        ftContentItems: [],
        nftContentItems: [],
      }
    } else if (typeof claim_status === 'object' && claim_status.WinNear) {
      return {
        status: 2,
        nearContentItems: [
          {
            tokenAmount: utils.formatUnits(claim_status.WinNear.total_amount.toString(), 24),
          },
        ],
        ftContentItems: [],
        nftContentItems: [],
      }
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
      }
    } else if (typeof claim_status === 'object' && claim_status.WinFt) {
      const metadata = await this._getFtMetadata(claim_status.WinFt.token_contract)

      return {
        status: 2,
        nearContentItems: [],
        ftContentItems: [
          {
            contractAddress: claim_status.WinFt.token_contract,
            tokenAmount: utils.formatUnits(
              claim_status.WinFt.total_amount.toString(),
              metadata.decimals
            ),
          },
        ],
        nftContentItems: [],
      }
    } else if (
      typeof claim_status === 'object' &&
      (claim_status.NotWin || claim_status.Right?.NotWin)
    ) {
      return {
        status: 1,
        nearContentItems: [],
        ftContentItems: [],
        nftContentItems: [],
      }
    } else {
      console.error('Unknown claim result', claim_status)
      throw new Error('Unknown claim result')
    }
  }
}
