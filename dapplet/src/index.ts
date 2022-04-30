import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/near_dapplet_icon.svg';
import { IDappletApi } from '../../common/interfaces';

import boxDef from './icons/LightsOut.gif';
import boxDim from './icons/Dim.gif';
import White from './icons/White.gif';

import bag from './icons/boxCreate/bag.png';
import blueBox from './icons/boxCreate/blue_box.png';
import box from './icons/boxCreate/box.png';
import pig from './icons/boxCreate/pig.png';
import pinata from './icons/boxCreate/pinata.png';
import redBox from './icons/boxCreate/red_box.png';
import safe from './icons/boxCreate/safe.png';

import bagEmpty from './icons/boxEmpty/bag_empty.png';
import blueBoxEmpty from './icons/boxEmpty/blue_box_empty.png';
import boxEmpty from './icons/boxEmpty/box_empty.png';
import pigEmpty from './icons/boxEmpty/pig_empty.png';
import pinataEmpty from './icons/boxEmpty/pinata_empty.png';
import redBoxEmpty from './icons/boxEmpty/red_box_empty.png';
import safeEmpty from './icons/boxEmpty/safe_empty.png';

import bagOpen from './icons/boxOpen/bag_open.png';
import blueBoxOpen from './icons/boxOpen/blue_box_open.png';
import boxOpen from './icons/boxOpen/box_open.png';
import pigOpen from './icons/boxOpen/pig_open.png';
import pinataOpen from './icons/boxOpen/pinata_open.png';
import redBoxOpen from './icons/boxOpen/red_box_open.png';
import safeOpen from './icons/boxOpen/safe_open.png';

import { LootboxClaimResult } from '../../common/interfaces';
import { DappletApi } from './api';

export const BOX_DEFAULT = [blueBox, redBox, safe, box, bag, pinata, pig];
export const BOX_OPEN = [blueBoxOpen, redBoxOpen, safeOpen, boxOpen, bagOpen, pinataOpen, pigOpen];
export const BOX_EMPTY = [
  blueBoxEmpty,
  redBoxEmpty,
  safeEmpty,
  boxEmpty,
  bagEmpty,
  pinataEmpty,
  pigEmpty,
];

@Injectable
export default class TwitterFeature {
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  private _overlay: any;

  private _api = new DappletApi();

  async activate(): Promise<void> {
    if (!this._overlay) {
      this._overlay = (<any>Core)
        .overlay({
          name: 'overlay',
          title: 'LootBox',
        })
        .declare({
          connectWallet: this._api.connectWallet.bind(this._api),
          disconnectWallet: this._api.disconnectWallet.bind(this._api),
          isWalletConnected: this._api.isWalletConnected.bind(this._api),
          getCurrentNearAccount: this._api.getCurrentNearAccount.bind(this._api),

          getBoxesByAccount: this._api.getBoxesByAccount.bind(this._api),
          createNewBox: this._api.createNewBox.bind(this._api),

          getBoxesById: this._api.getLootboxById.bind(this._api),
          calcBoxCreationPrice: this._api.calcBoxCreationPrice.bind(this._api),
          getLootboxStat: this._api.getLootboxStat.bind(this._api),
          getLootboxWinners: this._api.getLootboxWinners.bind(this._api),
          // getLootboxClaimStatus: this._api.getLootboxClaimStatus.bind(this._api),
          // claimLootbox: this._api.claimLootbox.bind(this._api),
          _getLootboxClaimStatus: this._api._getLootboxClaimStatus.bind(this._api),
          _claimLootbox: this._api._claimLootbox.bind(this._api),
        });
    }

    const regExpLootbox = new RegExp(/.*(https:\/\/ltbx\.app\/\d+)/);
    const regExpIndex = new RegExp(/\d+/);
    const getTweetParse = (tweet) => {
      if (tweet.search(regExpLootbox) != -1) {
        const numEl = tweet.match(regExpLootbox);
        return String(numEl[0]);
      }
    };

    const getNumIndex = (tweet) => {
      try {
        const numEl = parseInt(tweet.match(regExpIndex)).toString();
        return numEl;
      } catch (_) {
        //
      }
    };

    this.openOverlay();
    Core.onAction(() => this.openOverlay());

    const { box } = this.adapter.exports;

    this.adapter.attachConfig({
      POST: async (ctx) => [
        box({
          initial: 'DEFAULT',
          DEFAULT: {
            img: { DARK: boxDef, LIGHT: White },
            hidden: true,
            replace: `ltbx.app/`,
            position: 'bottom',
            text: '',
            init: async (ctx, me) => {
              const Tweet = ctx.text;

              const tweetParse = getTweetParse(Tweet);

              const numIndex = getNumIndex(tweetParse);

              const wallet = await Core.wallet({ type: 'near', network: 'testnet' });

              const lootboxId = await this._api.getLootboxById(numIndex);
              if (lootboxId === null || lootboxId === undefined) {
                return;
              } else {
                me.hidden = false;
                me.replace = `ltbx.app/${numIndex}`;
                await this.getClaimStatus(me, numIndex, lootboxId);
                // me.exec = null;
                // me.img = BOX_DEFAULT[lootboxId.pictureId];
                // const getClaim = await this._api.claimLootbox(numIndex, wallet.accountId);
              }
            },
            exec: async (ctx, me) => {},
          },
        }),
      ],
    });
  }

  async getClaimStatus(me, numIndex, lootbox): Promise<void> {
    me.img = { DARK: boxDef, LIGHT: White };
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    const result = await this._api._getLootboxClaimStatus(numIndex, wallet.accountId);
    me.exec = null;
    if (result.status === 0) {
      me.img = BOX_DEFAULT[lootbox.pictureId];
      me.exec = () => {
        this.getClaimLoot(me, numIndex, lootbox);
      };
    } else if (result.status === 1) {
      me.img = BOX_EMPTY[lootbox.pictureId];
      me.text = 'Empty';
      me.exec = null;
    } else if (result.status === 2) {
      me.img = BOX_OPEN[lootbox.pictureId];
      me.text = this._formatWinningText(result);
      me.exec = null;
    }
  }

  async getClaimLoot(me, numIndex, lootbox): Promise<void> {
    me.img = { DARK: boxDef, LIGHT: White };
    me.exec = null;
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    await this._api
      ._claimLootbox(numIndex, wallet.accountId)
      .then((x) => {
        if (x.status === 2 || x.status === 0) {
          me.img = BOX_OPEN[lootbox.pictureId];
          me.text = this._formatWinningText(x);
          me.exec = null;
        } else if (x.status === 1) {
          me.img = BOX_EMPTY[lootbox.pictureId];
          me.exec = null;
          me.text = 'Empty';
        }
      })
      .catch((err) => {
        me.img = BOX_DEFAULT[lootbox.pictureId];
        me.exec = null;
        me.text = 'breaking transaction, refresh page';
        console.log(err);
      });
  }
  // } catch (error) {
  //   // me.text = 'Empty';
  //   me.img = BOX_DEFAULT[lootbox.pictureId];
  //   me.exec = async () => {
  //     this.getClaimLoot(me, numIndex, lootbox);
  //   };
  //   console.error(error);
  //   console.log('lolo');
  //   return null;
  // }

  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }

  private _formatWinningText(x: LootboxClaimResult): string {
    let text = undefined;

    if (x.ftContentItems.length !== 0) {
      x.ftContentItems.map(
        (x) => (text = `You win: ${x.tokenAmount} tokens - Contract Address: ${x.contractAddress}`),
      );
    } else if (x.nearContentItems.length !== 0) {
      x.nearContentItems.map((x) => (text = `You win: ${x.tokenAmount} $NEAR`));
    } else if (x.nftContentItems.length !== 0) {
      text = `You win: ${x.nftContentItems.length} NFT`;
    }

    return text;
  }
}
