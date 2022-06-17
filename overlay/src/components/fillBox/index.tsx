import React, { FC, useState } from 'react';
import cn from 'classnames';
import styles from './FillBox.module.scss';

import { LabelSettings } from '../atoms/LabelSettings';

import { PayInfo } from '../atoms/PayInfo/PayInfo';
import { ButtonPay } from '../atoms/ButtonPay';

import { SettingTitle } from '../atoms/SettingTitle';
import { LinksStep } from '../atoms/LinksStep';

import { Link } from 'react-router-dom';
import { Lootbox } from '@loot-box/common/interfaces';
import { useEffect } from 'react';
import { Modal } from '../atoms/Modal';

export interface FillBoxProps {
  imgVal: string;

  price: any;
  onDoneClick: () => void;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: any) => void;
  winInfo: string;
  setWinInfo: (x: string) => void;
  setMessageError: (x: any) => void;
  messageError: boolean;
  newMetadata: any;
  nearAccount: string | undefined;
  dropType: any;
  setClearForm: (x: any) => void;
  setMetadata:(x:any)=>void
}
export const FillBox: FC<FillBoxProps> = (props: FillBoxProps) => {
  const {
    imgVal,

    price,
    onDoneClick,
    creationForm,
    onCreationFormUpdate,
    setWinInfo,
    winInfo,
    messageError,
    setMessageError,
    newMetadata,
    nearAccount,
    dropType,
    setClearForm,
    setMetadata,
  } = props;

  const [winInfoToken, setWinInfoToken] = useState(winInfo);
  const [isNotAccount, setNotAccount] = useState(false);
  const [isWarningTransaction, setWarningTransaction] = useState(false);
  useEffect(() => {
    if (dropType === 0) {
      const winAmount = creationForm.nearContentItems[0].tokenAmount;
      const winAmountParse = winAmount + ` NEAR`;
      setWinInfoToken(winAmountParse);
      setWinInfo(winAmountParse);
    } else if (dropType === 1) {
      const winAmountTicker = creationForm.ftContentItems[0].tokenAmount;
      const winAmountTickerParse = newMetadata
        ? `${winAmountTicker} ${newMetadata.symbol}`
        : `${winAmountTicker} TOKEN`;
      setWinInfoToken(winAmountTickerParse);
      setWinInfo(winAmountTickerParse);
    }
  }, [nearAccount, isNotAccount]);

  const getTransactionAndWarning = () => {
    if (dropType === 1) {
      setWarningTransaction(true);
    } else if (dropType === 0) {
      creationForm.ftContentItems = [];
      setClearForm(true);
      onDoneClick();
    }
  };

  console.log(price);
  

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.wrapperInfo}>
        <div className={styles.title}>
          <SettingTitle title="Fill your box" isActive={true} />
        </div>

        <div className={cn(styles.img)} onClick={() => {}}>
          <img src={imgVal} />
          <span className={styles.spanWin}>{winInfoToken}</span>
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
          <ButtonPay
            onClick={() => {
              nearAccount ? getTransactionAndWarning() : setNotAccount(true);
            }}
            styleBtn="default"
            title={`PAY`}
          />
        </div>
      </div>
      <div className={cn(styles.navigation)}>
        <Link to="/settings_token" onClick={()=>setMetadata(null)}>
          <LinksStep step="prev" label="Back"  />
        </Link>
      </div>
      <Modal
        visible={messageError}
        title={'Transaction error'}
        content={''}
        footer={''}
        onClose={() => setMessageError(false)}
      />
      <Modal
        visible={isNotAccount}
        title={'Please log in'}
        content={''}
        footer={''}
        onClose={() => setNotAccount(false)}
      />
      <Modal
        visible={isWarningTransaction}
        title={'Several transactions are required'}
        content={
          <ButtonPay
            onClick={() => {
              creationForm.nearContentItems = [];
              setClearForm(true);
              nearAccount ? onDoneClick() : setNotAccount(true);
            }}
            styleBtn="default"
            title={`Ok`}
          />
        }
        footer={''}
        onClose={() => setWarningTransaction(false)}
      />
    </div>
  );
};
