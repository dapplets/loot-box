import React, { CSSProperties, ReactElement, ReactNode, FC, useState } from 'react';

import styles from './FillBoxNFT.module.scss';
import cn from 'classnames';

import { LabelSettings } from '../atoms/LabelSettings';
import { SettingTitle } from '../atoms/SettingTitle';
import { PayInfo } from '../atoms/PayInfo/PayInfo';
import { ButtonPay } from '../atoms/ButtonPay';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';

export interface FillBoxProps_Nft {
  onSetId?: any;
  imgVal: string;

  price: any;
  onDoneClick: () => void;
}
export const FillBox_Nft: FC<FillBoxProps_Nft> = (props: FillBoxProps_Nft) => {
  const { imgVal, price, onDoneClick } = props;

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Fill your box" isActive />
      <div className={cn(styles.img)}>
        <img src={imgVal} />
      </div>
      <div className={styles.textNft}>
        You need to transfer selected NFTs to lootbox.near account and pay gas and service fee.
      </div>
      <div className={cn(styles.payBlock)}>
        <div className={cn(styles.payBtn)}>
          <div className={cn(styles.payBtn_block)}>
            <Link to="/deploy_your_box">
              <ButtonPay
                onClick={onDoneClick}
                styleBtn="default"
                title={`PAY ${[(price.gasAmount + price.feeAmount).toFixed(3)]} NEAR`}
              />
            </Link>
            <ButtonPay styleBtn="disable" title="NFTs transferred" />
          </div>

          <LabelSettings title="You need to pay" />
        </div>
        <div className={cn(styles.payInfo)}>
          <PayInfo title="Gas Amount" value={`${[price.gasAmount]} NEAR`} size="big" />
          <PayInfo title="Service Fee" value={`${[price.feeAmount]} NEAR`} size="big" />
        </div>
      </div>

      <div className={cn(styles.navigation)}>
        <Link to="/box_settings_value">
          <LinksStep step="prev" label="Back" />
        </Link>
      </div>
    </div>
  );
};
