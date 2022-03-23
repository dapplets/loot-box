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

import { LootboxClaimStatus } from '../../common/interfaces';
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
    await this._api.clearAll();
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

          getBoxesById: this._api.getLootboxById.bind(this._api),
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
            img: { DARK: boxDef, LIGHT: White },
            hidden: true,
            replace: `lootbox.org/`,
            text: '',
            init: async (ctx, me) => {
              const Tweet = ctx.text;

              const tweetParse = getTweetParse(Tweet);
              const numIndex = getNumIndex(tweetParse);
              // id не  существует - не моенять ссылку

              // me.replace = `lootbox.org/${numIndex}`;
              // me.hidden = false;

              const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
              //  todo: feat - contract function - search getlootboxById
              // const lootboxImg = await this._api
              //   .getBoxesByAccount(wallet.accountId)
              //   .then((x) => x.map((x) => x.pictureId));
              // console.log(lootboxImg[0]);

              // console.log(await this._api.getLootboxById(numIndex).then((x) => x));

              const lootboxId = await this._api.getLootboxById(numIndex);
              if (lootboxId === null || lootboxId === undefined) {
                // me.hidden = true;
                return;
              } else {
                me.hidden = false;
                me.replace = `lootbox.org/${numIndex}`;
                me.img = BOX_DEFAULT[lootboxId.pictureId];
                await this._api.getLootboxClaimStatus(numIndex, wallet.accountId).then((x) => {
                  console.log(x);
                  if (x === 0) {
                    me.exec = async (ctx, me) => {
                      const Tweet = ctx.text;
                      const tweetParse = getTweetParse(Tweet);
                      const numIndex = getNumIndex(tweetParse);
                      // await this.getClaimExec(me, numIndex, lootboxId.pictureId);
                      me.img = { DARK: boxDef, LIGHT: White };
                      await this._api
                        .claimLootbox(numIndex, wallet.accountId)
                        .then((x) => {
                          try {
                            if (x === 2) {
                              me.img = BOX_OPEN[lootboxId.pictureId];
                              this._api
                                ._getLootboxClaimStatus(numIndex, wallet.accountId)
                                .then((x) => {
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
                                    me.text = 'empty';
                                  }
                                });
                            } else {
                              me.img = BOX_EMPTY[lootboxId.pictureId];
                              me.text = 'empty';
                            }
                            console.log(x);
                            me.exec = () => {};
                          } catch {
                            me.img = BOX_EMPTY[lootboxId.pictureId];
                            me.text = 'empty';
                          }
                        })
                        .catch(() => {
                          me.img = BOX_EMPTY[lootboxId.pictureId];
                          me.text = 'empty';
                        });
                    };
                  } else if (x === 1) {
                    me.img = BOX_EMPTY[lootboxId.pictureId];
                    me.text = 'empty';
                  } else {
                    me.exec = async (ctx, me) => {
                      const Tweet = ctx.text;
                      const tweetParse = getTweetParse(Tweet);
                      const numIndex = getNumIndex(tweetParse);

                      await this._api
                        .claimLootbox(numIndex, wallet.accountId)
                        .then((x) => {
                          try {
                            if (x === 2) {
                              me.img = BOX_OPEN[lootboxId.pictureId];
                              this._api
                                ._getLootboxClaimStatus(numIndex, wallet.accountId)
                                .then((x) => {
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
                                    me.text = 'empty';
                                  }
                                });
                            } else {
                              me.img = BOX_EMPTY[lootboxId.pictureId];
                              me.text = 'empty';
                            }
                            console.log(x);
                            me.exec = () => {};
                          } catch {
                            me.img = BOX_EMPTY[lootboxId.pictureId];
                            me.text = 'empty';
                          }
                        })
                        .catch(() => {
                          me.img = BOX_EMPTY[lootboxId.pictureId];
                          me.text = 'empty';
                        });

                      // await this.getClaimExec(me, numIndex, lootboxId.pictureId);
                    };
                  }
                });
              }
              // if lootbox == null && undef = return, hidden= true

              //   await this._api.getLootboxClaimStatus(numIndex, wallet.accountId).then((x) => {
              //     if (x !== 2) {
              //       // me.img = BOX_DEFAULT[lootboxImg[numIndex - 1] as number];

              //       me.exec = async (ctx, me) => {
              //         const Tweet = ctx.text;
              //         const tweetParse = getTweetParse(Tweet);
              //         const numIndex = getNumIndex(tweetParse);
              //         await this.getClaimExec(me, numIndex, lootboxId.pictureId);
              //       };
              //     } else {
              //       // me.img = BOX_EMPTY[lootboxImg[numIndex - 1] as number];
              //       me.img = BOX_EMPTY[lootboxId.pictureId];
              //       me.exec = () => {};
              //     }
              //   });
              //   console.log(lootboxId);

              //   // console.log(ClaimStatus);
            },
            exec: async (ctx, me) => {
              // const Tweet = ctx.text;
              // const tweetParse = getTweetParse(Tweet);
              // const numIndex = getNumIndex(tweetParse);
              // // const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
              // // const lootboxImg = await this._api
              // //   .getBoxesByAccount(wallet.accountId)
              // //   .then((x) => x.map((x) => x.pictureId));
              // // console.log(lootboxImg);
              // const lootboxId = await this._api.getLootboxById(numIndex);
              // await this.getClaimExec(me, numIndex, lootboxId.pictureId);
            },
          },
        }),
      ],
    });
  }

  // async getClaimExec(me, num, numImg): Promise<void> {
  //   me.img = { DARK: boxDef, LIGHT: White };
  //   const wallet = await Core.wallet({ type: 'near', network: 'testnet' });

  //   try {
  //     await this._api.claimLootbox(num, wallet.accountId).then((x) => {
  //       if (x === 2) {
  //         // me.state = 'boxWin';
  //         this._api._getLootboxClaimStatus(num, wallet.accountId).then((x) => {
  //           if (x.ftContentItems.length !== 0) {
  //             x.ftContentItems.map(
  //               (x) =>
  //                 // x.contractAddress,
  //                 // x.tokenAmount,
  //                 (me.text = `You win: ${x.tokenAmount} tokens - Contract Address: ${x.contractAddress}`),
  //             );
  //             console.log(x.ftContentItems);
  //           } else if (x.nearContentItems.length !== 0) {
  //             x.nearContentItems.map(
  //               (x) =>
  //                 // x.tokenAmount,
  //                 (me.text = `You win: ${x.tokenAmount} near`),
  //             );
  //             console.log(x.nearContentItems);
  //           } else if (x.nftContentItems.length !== 0) {
  //             x.nftContentItems.map(
  //               (x) => (
  //                 x.contractAddress,
  //                 x.quantity,
  //                 x.tokenId,
  //                 (me.text = `You win: ${x.quantity} quantity! ${x.tokenId} - token ID, ${x.contractAddress} - contract address`)
  //               ),
  //             );
  //             console.log(x.nftContentItems);
  //           } else {
  //             return 'false';
  //           }

  //           // console.log(
  //           //   // Object.keys(x.ftContentItems).length === 0 && x.ftContentItems.constructor === Object,
  //           //   // Object.keys(x.nearContentItems).length === 0 &&
  //           //   //   x.nearContentItems.constructor === Object,
  //           //   // Object.keys(x.nftContentItems).length === 0 && x.nftContentItems.constructor === Object,

  //           //   x.ftContentItems,
  //           //   x.nearContentItems.map((x) => x.tokenAmount),
  //           //   x.nftContentItems.map((x, i) => (x.contractAddress, x.quantity, x.tokenId)),
  //           // );
  //         });
  //         me.img = BOX_OPEN[numImg];
  //         me.exec = () => {};
  //       } else {
  //         me.img = BOX_EMPTY[numImg];
  //         me.text = 'empty';
  //         me.exec = () => {};
  //       }
  //     });
  //   } catch (error) {}
  // }

  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }
}
