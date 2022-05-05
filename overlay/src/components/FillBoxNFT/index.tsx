import React, { FC, useState } from 'react';

import styles from './FillBoxNFT.module.scss';
import cn from 'classnames';

import { LabelSettings } from '../atoms/LabelSettings';
import { SettingTitle } from '../atoms/SettingTitle';
import { PayInfo } from '../atoms/PayInfo/PayInfo';
import { ButtonPay } from '../atoms/ButtonPay';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import { Lootbox } from '@loot-box/common/interfaces';

export interface FillBoxProps_Nft {
  onSetId?: any;
  imgVal: string;
  creationForm: Lootbox;
  price: any;
  onDoneClick: () => void;
  winInfo: string;
  setWinInfo: (x: string) => void;
}
export const FillBox_Nft: FC<FillBoxProps_Nft> = (props: FillBoxProps_Nft) => {
  const { imgVal, price, onDoneClick, creationForm, winInfo, setWinInfo } = props;
  const [winInfoNft, setWinInfoNft] = useState(winInfo);

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Fill your box" isActive />
      <div className={cn(styles.img)}>
        <img src={imgVal} />
        <span className={styles.spanWin}>{creationForm.nftContentItems.length} NFT</span>
      </div>

      <div className={cn(styles.payBlock)}>
        <div className={cn(styles.payBtn)}>
          <LabelSettings title="You need to pay" />
        </div>
        <div className={cn(styles.payInfo)}>
          <PayInfo title="Gas Amount" value={`${price.gasAmount} NEAR`} size="big" />

          <PayInfo title="Service Fee" value={`${price.feeAmount} NEAR`} size="big" />
        </div>
        <div className={cn(styles.payBtn_block)}>
          <Link to="/deploy_your_box">
            <ButtonPay
              onClick={onDoneClick}
              styleBtn="default"
              title={`PAY ${price.totalAmount} NEAR`}
            />
          </Link>
        </div>
      </div>

      <div className={cn(styles.navigation)}>
        <Link to="/settings_NFT">
          <LinksStep step="prev" label="Back" />
        </Link>
      </div>
    </div>
  );
};
