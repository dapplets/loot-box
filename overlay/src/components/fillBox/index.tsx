import React, { CSSProperties, ReactElement, ReactNode, FC, useState } from 'react';
import { SettingTitle } from '../atoms/SettingTitle';
import styles from './FillBox.module.scss';
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

export interface FillBoxProps {
  // imageBox: string;
  onSetId?: () => void;
  // id_img?: any;
  imgVal: string;
  onClick?: () => void;
  price: any;
}
export const FillBox: FC<FillBoxProps> = (props: FillBoxProps) => {
  const { onSetId, imgVal, onClick, price } = props;
  const [id, setId] = useState(0);

  // const {imageBox} = props
  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.wrapperInfo}>
        <div className={styles.title}>
          <SettingTitle title="Fill your box" isActive={true} />
        </div>

        <div
          className={cn(styles.img)}
          onClick={() => {
            // console.log(imgVal);
          }}
        >
          <img
            // src={IMG[1]}
            src={imgVal}
            // alt={IMG[id]}
            // id={id}
          />
        </div>
        <div className={cn(styles.distributeDrop)}>
          <LabelSettings title="How would you like to distribute drop?" />
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
              styleBtn="default"
              title={`PAY ${price.feeAmount + price.gasAmount + price.fillAmount} NEAR`}
            />
          </Link>
        </div>
      </div>
      <div className={cn(styles.navigation)}>
        <Link to="/box_settings_value">
          <LinksStep
            step="prev"
            label="Back"
            //  icon={PrevStep}
          />
        </Link>
      </div>
    </div>
  );
};
