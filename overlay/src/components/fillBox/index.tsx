import React, { CSSProperties, ReactElement, ReactNode, FC, useState } from 'react';
import cn from 'classnames';
import styles from './FillBox.module.scss';

import { LabelSettings } from '../atoms/LabelSettings';
import { RadioButton } from '../atoms/RadioButton';
import { PayInfo } from '../atoms/PayInfo/PayInfo';
import { ButtonPay } from '../atoms/ButtonPay';

import { SettingTitle } from '../atoms/SettingTitle';
import { LinksStep } from '../atoms/LinksStep';

import { Link } from 'react-router-dom';
import { Lootbox } from '../../../../common/interfaces';
import { useEffect } from 'react';

export interface FillBoxProps {
  // onSetId?: () => void;

  imgVal: string;
  // onClick?: () => void;
  price: any;
  onDoneClick: () => void;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: any) => void;
  winInfo: string;
  setWinInfo: (x: string) => void;
}
export const FillBox: FC<FillBoxProps> = (props: FillBoxProps) => {
  const {
    // onSetId,
    imgVal,
    // onClick,
    price,
    onDoneClick,
    creationForm,
    onCreationFormUpdate,
    setWinInfo,
    winInfo,
  } = props;
  // const newForm = Object.assign({}, creationForm);
  const [winInfoToken, setWinInfoToken] = useState(winInfo);
  useEffect(() => {
    if (creationForm.nearContentItems[0]) {
      const winAmount = creationForm.nearContentItems[0].tokenAmount;
      const winAmountParse = winAmount + ` NEAR`;
      setWinInfoToken(winAmountParse);
      setWinInfo(winAmountParse);
    } else if (creationForm.ftContentItems[0]) {
      const winAmountTicker = creationForm.ftContentItems[0].tokenAmount;
      const winAmountTickerParse = winAmountTicker + ` TOKEN`;
      setWinInfoToken(winAmountTickerParse);
      setWinInfo(winAmountTickerParse);
    }
  }, []);

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.wrapperInfo}>
        <div className={styles.title}>
          <SettingTitle title="Fill your box" isActive={true} />
        </div>

        <div className={cn(styles.img)} onClick={() => {}}>
          <img src={imgVal} />
          <span className={styles.spanWin}>
            {winInfoToken}
            {/* {+winAmount !== 0 ? winAmountParse : winAmountTickerParse} */}
          </span>
        </div>
        <div className={cn(styles.distributeDrop)}>
          <LabelSettings
            title="How would you like to distribute drop?"
            support="You can choose between one transaction for one winner or one transaction for all winners. 

            The first option will require an additional amount of gas"
            isActive
          />
          <div className={cn(styles.distributeDropRadio)}>
            <RadioButton
              value="1 transaction per 1 win"
              name="distribute Drop"
              title="1 transaction per 1 win"
              id="1_DISTRIBUTE"
            />
            <span />
            <RadioButton
              name="distribute Drop"
              title="1 transaction for all wins"
              value="1 transaction for all wins"
              id="2_DISTRIBUTE"
            />
          </div>
        </div>
        <div className={cn(styles.payBlock)}>
          <LabelSettings title="You need to pay" />
          <div className={cn(styles.payInfo)}>
            <PayInfo title="Fill Amount" value={`${[price.fillAmount]} NEAR`} size="big" />
            <PayInfo title="Gas Amount" value={`${[price.gasAmount]} NEAR`} size="big" />
            <PayInfo title="Service Fee" value={`${[price.feeAmount]} NEAR`} size="big" />
          </div>
        </div>
        <div className={cn(styles.payBtn)}>
          <Link to="/deploy_your_box">
            <ButtonPay
              onClick={onDoneClick}
              styleBtn="default"
              title={`PAY ${price.feeAmount + price.gasAmount + price.fillAmount} NEAR`}
            />
          </Link>
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
