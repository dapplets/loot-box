import {} from '@dapplets/dapplet-extension'
import { getNetworkConfig, NetworkConfig } from '@loot-box/common/helpers'
import { LootboxClaimResult } from '@loot-box/common/interfaces'
import { DappletApi } from './api'
import { sum, toPrecision } from './helpers'
import bag from './icons/boxCreate/bag.png'
import blueBox from './icons/boxCreate/blue_box.png'
import box from './icons/boxCreate/box.png'
import pig from './icons/boxCreate/pig.png'
import pinata from './icons/boxCreate/pinata.png'
import redBox from './icons/boxCreate/red_box.png'
import safe from './icons/boxCreate/safe.png'
import bagEmpty from './icons/boxEmpty/bag_empty.png'
import blueBoxEmpty from './icons/boxEmpty/blue_box_empty.png'
import boxEmpty from './icons/boxEmpty/box_empty.png'
import pigEmpty from './icons/boxEmpty/pig_empty.png'
import pinataEmpty from './icons/boxEmpty/pinata_empty.png'
import redBoxEmpty from './icons/boxEmpty/red_box_empty.png'
import safeEmpty from './icons/boxEmpty/safe_empty.png'
import bagOpen from './icons/boxOpen/bag_open.png'
import blueBoxOpen from './icons/boxOpen/blue_box_open.png'
import boxOpen from './icons/boxOpen/box_open.png'
import pigOpen from './icons/boxOpen/pig_open.png'
import pinataOpen from './icons/boxOpen/pinata_open.png'
import redBoxOpen from './icons/boxOpen/red_box_open.png'
import safeOpen from './icons/boxOpen/safe_open.png'
import boxDef from './icons/LightsOut.gif'
import White from './icons/White.gif'

export const BOX_DEFAULT = [blueBox, redBox, safe, box, bag, pinata, pig]
export const BOX_OPEN = [blueBoxOpen, redBoxOpen, safeOpen, boxOpen, bagOpen, pinataOpen, pigOpen]
export const BOX_EMPTY = [
  blueBoxEmpty,
  redBoxEmpty,
  safeEmpty,
  boxEmpty,
  bagEmpty,
  pinataEmpty,
  pigEmpty,
]

@Injectable
export default class TwitterFeature {
  @Inject('twitter-adapter.dapplet-base.eth')
  public adapter: any

  private _overlay: any
  private _api: DappletApi
  private _config: NetworkConfig

  async activate(): Promise<void> {
    const networkId = await Core.storage.get('network')

    this._config = getNetworkConfig(networkId)
    this._api = new DappletApi(this._config)

    if (!this._overlay) {
      this._overlay = Core.overlay({ name: 'overlay', title: 'LootBox' }).declare(this._api)
    }

    const regExpLootbox = new RegExp(this._config.landingUrlRegexp)
    const regExpIndex = new RegExp(/\d+/)
    const getTweetParse = (tweet) => {
      if (tweet.search(regExpLootbox) != -1) {
        const numEl = tweet.match(regExpLootbox)
        return String(numEl[0])
      }
    }

    const getNumIndex = (tweet) => {
      try {
        const numEl = parseInt(tweet.match(regExpIndex)).toString()
        return numEl
      } catch (_) {
        //
      }
    }

    Core.onAction(() => this.openOverlay())

    const { box } = this.adapter.exports

    this.adapter.attachConfig({
      POST: async (ctx) => [
        box({
          initial: 'DEFAULT',
          DEFAULT: {
            img: { DARK: boxDef, LIGHT: White },
            width: '60%',
            hidden: true,
            replace: this._config.landingUrlReplace,
            position: 'bottom',
            text: '',
            init: async (ctx, me) => {
              const Tweet = ctx.el.innerText

              const tweetParse = getTweetParse(Tweet)

              const numIndex = getNumIndex(tweetParse)
              const wallet = await Core.wallet({
                type: 'near',
                network: this._config.networkId as any,
              })

              const lootboxId = await this._api.getLootboxById(numIndex)

              if (lootboxId === null || lootboxId === undefined) {
                return
              } else if (lootboxId.status === 'dropped') {
                me.replace = `${this._config.landingUrlReplace}${numIndex}`
                me.img = BOX_EMPTY[lootboxId.pictureId]
                me.text = 'This Lootbox is empty'
                me.exec = null
                me.hidden = false
              } else {
                me.replace = `${this._config.landingUrlReplace}${numIndex}`
                me.hidden = false
                await this.getClaimStatus(me, numIndex, lootboxId)
              }
            },
            exec: async (ctx, me) => {
              // empty
            },
          },
        }),
      ],
    })
  }

  async getClaimStatus(me, numIndex, lootbox): Promise<void> {
    me.img = { DARK: boxDef, LIGHT: White }
    const wallet = await Core.wallet({ type: 'near', network: this._config.networkId as any })
    const getWin = (y: any) => {
      if (y.ftContentItems.length !== 0) {
        const label = y.ftContentItems.map((x: any) => `${x.tokenAmount} ${x.tokenTicker}`)
        return label
      } else if (y.nearContentItems.length !== 0) {
        const label = y.nearContentItems.map((x: any) => `${x.tokenAmount} NEAR`)
        return label
      } else if (y.nftContentItems.length !== 0) {
        const winNft = String(y.nftContentItems.length) + ` NFT`
        return winNft
      }
    }

    if (wallet.accountId) {
      const result = await this._api._getLootboxClaimStatus(numIndex, wallet.accountId)
      me.exec = null

      if (result.status === 0) {
        me.text = getWin(lootbox)
        me.img = BOX_DEFAULT[lootbox.pictureId]

        me.exec = async () => {
          await this.getClaimLoot(me, numIndex, lootbox)
        }
      } else if (result.status === 1) {
        me.img = BOX_EMPTY[lootbox.pictureId]
        me.text = 'This Lootbox is empty'
        me.exec = null
      } else if (result.status === 2) {
        me.img = BOX_OPEN[lootbox.pictureId]
        me.text = await this._formatWinningText(result)
        me.exec = null
      }
    } else {
      me.img = BOX_DEFAULT[lootbox.pictureId]
      me.text = 'Please log into your wallet and refresh the page'
      me.exec = null
    }
  }

  async getClaimLoot(me, numIndex, lootbox): Promise<void> {
    me.img = { DARK: boxDef, LIGHT: White }
    me.exec = null
    const wallet = await Core.wallet({ type: 'near', network: this._config.networkId as any })
    if (wallet.accountId) {
      await this._api
        ._claimLootbox(numIndex, wallet.accountId)
        .then(async (x) => {
          if (x.status === 2) {
            me.img = BOX_OPEN[lootbox.pictureId]
            me.text = await this._formatWinningText(x)
            me.exec = null
          } else {
            me.img = BOX_EMPTY[lootbox.pictureId]
            me.text = 'This Lootbox is empty'
            me.exec = null
          }
        })
        .catch((err) => {
          me.img = BOX_EMPTY[lootbox.pictureId]
          me.exec = async () => {
            me.exec = null
          }
          me.text = 'Transaction rejected, refresh the page'
        })
    } else {
      me.img = BOX_DEFAULT[lootbox.pictureId]
      me.text = 'Please log into your wallet and refresh the page'
      me.exec = null
    }
  }

  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props)
  }

  private async _formatWinningText(claim: LootboxClaimResult): Promise<string> {
    const winLoots: string[] = []

    // NEAR
    let nearTotal = null
    claim.nearContentItems.forEach((x) => (nearTotal = sum(nearTotal ?? '0', x.tokenAmount)))
    if (nearTotal) {
      winLoots.push(toPrecision(nearTotal, 6) + ' NEAR')
    }

    // FT
    for (const ft of claim.ftContentItems) {
      const { symbol } = await this._api.getFtMetadata(ft.contractAddress)
      winLoots.push(toPrecision(ft.tokenAmount, 6) + ' ' + symbol)
    }

    // NFT
    if (claim.nftContentItems.length > 0) {
      winLoots.push(claim.nftContentItems.length + ' NFTs')
    }

    return winLoots.length > 0 ? `You win: ${winLoots.join(', ')}` : 'This Lootbox is empty'
  }
}
