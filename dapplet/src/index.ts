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
    // const num = (tweet) => {
    //   if (tweet.search(regExpLootbox) != -1) {
    //     let numEl = parseInt(tweet.match(/\d+/));
    //     // if (numEl !) return numEl;
    //     // console.log(numEl);
    //     if (numEl !== undefined && numEl !== null) return numEl;
    //   }
    // };

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
            init: async (ctx, me) => {
              const Tweet = await ctx.text;

              // const getTweetParse = (tweet) => {
              //   if (tweet.search(regExpLootbox) != -1) {
              //     return String(tweet);
              //   }
              // };
              // const getNumIndex = (tweet) => {
              //   try {
              //     let numEl = parseInt(tweet.match(regExpIndex));
              //     return numEl;
              //   } catch {}
              // };
              const tweetParse = getTweetParse(Tweet);
              const numIndex = getNumIndex(tweetParse);
              // console.log(tweetParse);
              // console.log(numIndex);

              me.replace = `lootbox.org/${numIndex}`;
              me.hidden = false;
              // await this.getClaim(me, numIndex);
              const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
              this._overlay.send('getCurrentNearAccount_done', wallet.accountId);
              // const BoxesId = numIndex;
              const ClaimStatus = await this._api
                .getLootboxClaimStatus(numIndex, wallet.accountId)
                .then((x) => {
                  if (x === 2) {
                    me.img = fullBox;
                  } else {
                    me.img = emptyBox;
                  }
                });
              // const ClaimLoot = await this._api.getLootboxClaimStatus(BoxesId, wallet.accountId);
              // console.log(ClaimLoot);

              console.log(ClaimStatus);
              // if (ClaimStatus === 0) {
              //   // console.log(ClaimStatus);
              //   return (me.img = fullBox);
              // } else if (ClaimStatus === 1) {
              //   // console.log(ClaimStatus);
              //   return (me.img = emptyBox);
              // } else {
              //   // console.log(ClaimStatus);
              //   return (me.img = fullBox);
              // }
            },
            exec: async (ctx, me) => {
              const Tweet = await ctx.text;
              const tweetParse = getTweetParse(Tweet);
              const numIndex = getNumIndex(tweetParse);
              await this.getClaimExec(me, numIndex);
              // const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
              // this._overlay.send('getCurrentNearAccount_done', wallet.accountId);
              // console.log('lala');
              // await this._api.claimLootbox(numIndex, wallet.accountId).then((x) => {
              //   if (x === 2) {
              //     // me.state = 'boxWin';
              //     me.img = BigBox;
              //     console.log(x);
              //   } else {
              //     // me.state = 'boxEmpty';
              //     me.img = emptyBox;
              //     console.log(x);
              //   }
              // });
            },
          },
          boxDefault: {
            img: fullBox,
            replace: `lootbox.org/`,
          },
          boxLoad: {
            img: boxDef,
            replace: `lootbox.org/`,
          },
          boxWin: {
            text: `5000 near`,
            img: BigBox,
            replace: `lootbox.org/`,
            init: async (ctx, me) => {
              const Tweet = await ctx.text;
              const tweetParse = getTweetParse(Tweet);
              const numIndex = getNumIndex(tweetParse);
              me.replace = `lootbox.org/${numIndex}`;
            },
          },
          boxEmpty: {
            text: `empty`,
            img: emptyBox,
            replace: `lootbox.org/`,
            init: async (ctx, me) => {
              const Tweet = await ctx.text;
              const tweetParse = getTweetParse(Tweet);
              const numIndex = getNumIndex(tweetParse);
              me.replace = `lootbox.org/${numIndex}`;
            },
          },
        }),
      ],
    });
  }
  // async getClaim(me, num): Promise<void> {
  //   try {
  //     me.img = boxDef;
  //     const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
  //     this._overlay.send('getCurrentNearAccount_done', wallet.accountId);
  //     const BoxesId = num;
  //     const ClaimStatus = await this._api.getLootboxClaimStatus(BoxesId, wallet.accountId);
  //     if (ClaimStatus === 0) {
  //       me.img = fullBox;
  //     } else {
  //       me.img = emptyBox;
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // }
  async getClaimExec(me, num): Promise<void> {
    me.img = boxDef;
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    this._overlay.send('getCurrentNearAccount_done', wallet.accountId);
    console.log('lala');
    await this._api.claimLootbox(num, wallet.accountId).then((x) => {
      if (x === 2) {
        // me.state = 'boxWin';
        me.img = BigBox;
        console.log(x);
      } else {
        // me.state = 'boxEmpty';
        me.img = emptyBox;
        console.log(x);
      }
    });
  }
  // async getClaim(props?: any): Promise<void> {
  //   // this._overlay.listen(console.log('lalla'));
  //   try {
  //     props.state = 'ANOTHERDef';
  //     const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
  //     this._overlay.send('getCurrentNearAccount_done', wallet.accountId);
  //     // console.log(wallet.accountId);
  //     const Boxes = await this._api.getBoxesByAccount('dapplets_lootbox.testnet');
  //     const BoxesId = await Boxes.map((item, i) => item.id);
  //     // console.log(BoxesId, 'BoxesId');
  //     const ClaimStatus = await this._api.getLootboxClaimStatus(BoxesId as any, wallet.accountId);
  //     console.log(ClaimStatus, 'ClaimStatus');
  //     const claimLoot = await this._api.claimLootbox(BoxesId as any, wallet.accountId);
  //     // const status = await this._api.claimLootbox(BoxesId as any, 'dapplets_lootbox.testnet');
  //     // console.log(status);
  //     if (claimLoot === 2) {
  //       props.state = 'ANOTHER';
  //     } else {
  //       props.state = 'ANOTHER2';
  //     }

  //     console.log(claimLoot, 'claimLoot');
  //     this.adapter;
  //   } catch {}
  // }
  // async getTweets(ctx, regExpLootbox): Promise<void> {
  //   // const { ctx, regExpLootbox } = props;
  //   try {
  //     const Tweet = await ctx.text;
  //     const tweetText = String(Tweet);
  //     // let midstring;

  //     console.log(tweetText);
  //     console.log(Tweet);
  //     if (Tweet.search(regExpLootbox) != -1) {
  //       let numEl = parseInt(Tweet.match(/\d+/));
  //       console.log(Number(numEl));
  //       return await Tweet;
  //     }
  //   } catch {}

  //   // console.log(tweetText + midstring + regExpLootbox);
  // }
  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }
}
