import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/near_dapplet_icon.svg';
import { DappletApi } from './api';
import emptyBox from './icons/emptyBox.png';
import fullBox from './icons/FullBox.png';
import BigBox from './icons/box.png';
import boxDef from './icons/box.gif';

import { LootboxClaimStatus } from '../../common/interfaces';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  private _overlay: any;

  private _api = new DappletApi();

  async activate(): Promise<void> {
    const contract = await Core.contract('near', 'dev-1634890606019-41631155713650', {
      viewMethods: ['getTweets'],
      changeMethods: ['addTweet', 'removeTweet'],
    });

    if (!this._overlay) {
      this._overlay = (<any>Core)
        .overlay({
          name: 'overlay',
          title: 'Dapplets x NEAR example',
        })
        .declare({
          connectWallet: this._api.connectWallet.bind(this._api),
          disconnectWallet: this._api.disconnectWallet.bind(this._api),
          isWalletConnected: this._api.isWalletConnected.bind(this._api),
          getCurrentNearAccount: this._api.getCurrentNearAccount.bind(this._api),

          getBoxesByAccount: this._api.getBoxesByAccount.bind(this._api),
          createNewBox: this._api.createNewBox.bind(this._api),
          calcBoxCreationPrice: this._api.calcBoxCreationPrice.bind(this._api),
          getLootboxStat: this._api.getLootboxStat.bind(this._api),
          getLootboxWinners: this._api.getLootboxWinners.bind(this._api),
          clearAll: this._api.clearAll.bind(this._api),
          getLootboxClaimStatus: this._api.getLootboxClaimStatus.bind(this._api),
          claimLootbox: this._api.claimLootbox.bind(this._api),
          _getLootboxClaimStatus: this._api.getLootboxClaimStatus.bind(this._api),
          _claimLootbox: this._api.claimLootbox.bind(this._api),
        });
    }
    const regExpLootbox = new RegExp(/.*(https:\/\/lootbox\.org\/\d+)/);
    const regExpIndex = new RegExp(/\d+/);
    const getTweetParse = (tweet) => {
      if (tweet.search(regExpLootbox) != -1) {
        return String(tweet);
      }
    };
    const getNumIndex = (tweet) => {
      try {
        let numEl = parseInt(tweet.match(regExpIndex));
        return numEl;
      } catch {}
    };

    Core.onAction(() => this.openOverlay());

    const { box } = this.adapter.exports;

    this.adapter.attachConfig({
      POST: async (ctx) => [
        box({
          initial: 'DEFAULT',
          DEFAULT: {
            img: boxDef,
            hidden: true,
            replace: `lootbox.org/`,
            text: '',
            init: async (ctx, me) => {
              const Tweet = ctx.text;

              const tweetParse = getTweetParse(Tweet);
              const numIndex = getNumIndex(tweetParse);

              me.replace = `lootbox.org/${numIndex}`;
              me.hidden = false;

              const wallet = await Core.wallet({ type: 'near', network: 'testnet' });

              const ClaimStatus = await this._api
                .getLootboxClaimStatus(numIndex, wallet.accountId)
                .then((x) => {
                  if (x === 2) {
                    me.img = fullBox;
                  } else {
                    me.img = emptyBox;
                  }
                });

              console.log(ClaimStatus);
            },
            exec: async (ctx, me) => {
              const Tweet = ctx.text;
              const tweetParse = getTweetParse(Tweet);
              const numIndex = getNumIndex(tweetParse);

              await this.getClaimExec(me, numIndex);
            },
          },
        }),
      ],
    });
  }

  async getClaimExec(me, num): Promise<void> {
    me.img = boxDef;
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });

    await this._api.claimLootbox(num, wallet.accountId).then((x) => {
      if (x === 2) {
        // me.state = 'boxWin';
        this._api._getLootboxClaimStatus(num, wallet.accountId).then((x) => {
          if (x.ftContentItems.length !== 0) {
            x.ftContentItems.map(
              (x) =>
                // x.contractAddress,
                // x.tokenAmount,
                (me.text = `You win: ${x.tokenAmount} tokens - Contract Address: ${x.contractAddress}`),
            );
            console.log(x.ftContentItems);
          } else if (x.nearContentItems.length !== 0) {
            x.nearContentItems.map(
              (x) =>
                // x.tokenAmount,
                (me.text = `You win: ${x.tokenAmount} near`),
            );
            console.log(x.nearContentItems);
          } else if (x.nftContentItems.length !== 0) {
            x.nftContentItems.map(
              (x) => (
                x.contractAddress,
                x.quantity,
                x.tokenId,
                (me.text = `You win: ${x.quantity} quantity! ${x.tokenId} - token ID, ${x.contractAddress} - contract address`)
              ),
            );
            console.log(x.nftContentItems);
          } else {
            return 'false';
          }

          // console.log(
          //   // Object.keys(x.ftContentItems).length === 0 && x.ftContentItems.constructor === Object,
          //   // Object.keys(x.nearContentItems).length === 0 &&
          //   //   x.nearContentItems.constructor === Object,
          //   // Object.keys(x.nftContentItems).length === 0 && x.nftContentItems.constructor === Object,

          //   x.ftContentItems,
          //   x.nearContentItems.map((x) => x.tokenAmount),
          //   x.nftContentItems.map((x, i) => (x.contractAddress, x.quantity, x.tokenId)),
          // );
        });
        me.img = BigBox;
        me.exec = () => {};
      } else {
        me.img = emptyBox;
        me.text = 'empty';
        me.exec = () => {};
      }
    });
  }

  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }
}
