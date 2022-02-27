import React, { CSSProperties, ReactElement, ReactNode, FC, useState } from 'react';
import { SettingTitle } from '../atoms/SettingTitle';
import styles from './FillBoxNFT.module.scss';
import { LabelSettings } from '../atoms/LabelSettings';
import { RadioButton, RadioButtonProps } from '../atoms/RadioButton';
import { PayInfo } from '../atoms/PayInfo/PayInfo';
import { ButtonPay } from '../atoms/ButtonPay';
import cn from 'classnames';
import imgBox from '../../icons/createNewBox/box1.png';
import { LinksStep } from '../atoms/LinksStep';
import NextStep from '../../icons/selectBox/NextStep.svg';
import PrevStep from '../../icons/selectBox/prevStep.svg';
import { Link } from 'react-router-dom';
import { IMG } from '../selectBox';
// import { GetBox } from '../selectBox';

export interface FillBoxProps_Nft {
  // imageBox: string;
  onSetId?: any;
  imgVal: string;
  // id_img?: any;
  price: any;
  // onDoneClick: () => void;
}
export const FillBox_Nft: FC<FillBoxProps_Nft> = (props: FillBoxProps_Nft) => {
  // const { onSetId, id_img } = props;
  const {
    imgVal,
    price,
    // onDoneClick
  } = props;
  const [id, setId] = useState(0);

  // const {imageBox} = props
  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Fill your box" isActive />
      <div className={cn(styles.img)}>
        <img
          src={imgVal}
          // alt={IMG[id]}
          // id={id}
        />
      </div>
      <div className={styles.textNft}>
        You need to transfer selected NFTs to lootbox.near account and pay gas and service fee.
      </div>
      <div className={cn(styles.payBlock)}>
        <div className={cn(styles.payBtn)}>
          <div className={cn(styles.payBtn_block)}>
            <Link to="/deploy_your_box">
              <ButtonPay
                // onClick={onDoneClick}
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
          <LinksStep
            step="prev"
            label="Back"
            // icon={PrevStep}
          />
        </Link>
      </div>
    </div>
  );
};
