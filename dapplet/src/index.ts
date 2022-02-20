import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/near_dapplet_icon.svg';
import { DappletApi } from './api';
import emptyBox from './icons/emptyBox.png';
import fullBox from './icons/FullBox.png';

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
        });
    }

    Core.onAction(() => this.openOverlay());

    const {
      button,
      box,
      picture,
      label,
      caption,
      usernameBadge,
      avatarBadge,
      avatar,
    } = this.adapter.exports;

    const { $ } = this.adapter.attachConfig({
      POST: (ctx) => [
        box({
          id: 'picDef',
          initial: 'DEFAULT',
          DEFAULT: {
            img: fullBox,
            // text: '5,000 NEAR',
            replace: 'lootbox.org',
            hidden: false,
            exec: (ctx, me) => {
              $(ctx, 'pic').hidden = !$(ctx, 'pic').hidden;
            },
          },
        }),
        box({
          id: 'pic',
          initial: 'DEFAULT',
          DEFAULT: {
            img: emptyBox,
            hidden: true,
            // color: 'white',
            // textBackground: 'black',
            // replace: 'lootbox.org',
          },
        }),
        // box({
        //   initial: 'DEFAULT',
        //   DEFAULT: {
        //     img: fullBox,
        //     hidden: false,
        //     // replace: 'lootbox.org',
        //     exec: (_, me) => {
        //       me.state = 'ANOTHER';
        //       me.hidden = true;
        //     },
        //   },
        //   ANOTHER: {
        //     img: emptyBox,
        //     replace: 'lootbox.org',
        //   },
        // }),
      ],
    });
  }

  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }
}
