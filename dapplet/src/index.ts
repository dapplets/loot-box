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

    Core.onAction(() => this.openOverlay());

    const { box } = this.adapter.exports;

    this.adapter.attachConfig({
      POST: (ctx) => [
        box({
          initial: 'DEFAULT',
          DEFAULT: {
            img: fullBox,
            hidden: false,
            replace: 'lootbox.org',
            exec: async (_, me) => {
              await this.getClaim(me);
            },
          },
          ANOTHERDef: {
            // text: `5000 near`,
            img: boxDef,
            replace: 'lootbox.org',
          },
          ANOTHER: {
            text: `5000 near`,
            img: BigBox,
            replace: 'lootbox.org',
          },
          ANOTHER2: {
            text: `empty`,
            img: emptyBox,
            replace: 'lootbox.org',
          },
        }),
      ],
    });
  }
  async getClaim(props?: any): Promise<void> {
    try {
      props.state = 'ANOTHERDef';
      const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
      this._overlay.send('getCurrentNearAccount_done', wallet.accountId);

      const Boxes = await this._api.getBoxesByAccount('dapplets_lootbox.testnet');
      const BoxesId = await Boxes.map((item, i) => item.id);

      const ClaimStatus = await this._api.getLootboxClaimStatus(BoxesId as any, wallet.accountId);
      console.log(ClaimStatus, 'ClaimStatus');
      const claimLoot = await this._api.claimLootbox(BoxesId as any, wallet.accountId);

      if (claimLoot === 2) {
        props.state = 'ANOTHER';
      } else {
        props.state = 'ANOTHER2';
      }

      console.log(claimLoot, 'claimLoot');
      this.adapter;
    } catch {}
  }
  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }
}
