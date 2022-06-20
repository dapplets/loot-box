import React, { FC, useEffect, useState } from 'react';

import styles from './FillBoxNFT.module.scss';
import cn from 'classnames';

import { LabelSettings } from '../atoms/LabelSettings';
import { SettingTitle } from '../atoms/SettingTitle';
import { PayInfo } from '../atoms/PayInfo/PayInfo';
import { ButtonPay } from '../atoms/ButtonPay';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import { Lootbox } from '@loot-box/common/interfaces';
import { Modal } from '../atoms/Modal';

export interface FillBoxProps_Nft {
  onSetId?: any;
  imgValue: string;
  creationForm: Lootbox;
  onDoneClick: () => void;
  setWinInfo: (x: string) => void;
  setMessageError: (x: any) => void;
  messageError: boolean;
  nearAccount: string | undefined;
}
export const FillBox_Nft: FC<FillBoxProps_Nft> = (props: FillBoxProps_Nft) => {
  const {
    imgValue,
    onDoneClick,
    creationForm,
    setWinInfo,
    messageError,
    setMessageError,
    nearAccount,
  } = props;
  
  const [isNotAccount, setNotAccount] = useState(false);
  const [isWarningTransaction, setWarningTransaction] = useState(false);
  useEffect(() => {
    if (creationForm.nftContentItems[0]) {
      const winAmount = creationForm.nftContentItems.length;
      const winAmountParse = winAmount + ` NFT`;
      setWinInfo(winAmountParse);
    }
  }, [messageError, isNotAccount, nearAccount]);
  const getTransactionAndWarning = () => {
    setWarningTransaction(true);
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Fill your box" isActive />
      <div className={cn(styles.img)}>
        <img src={imgValue} />
        <span className={styles.spanWin}>{creationForm.nftContentItems.length} NFT</span>
      </div>

      <div className={cn(styles.payBlock)}>
        <div className={cn(styles.payBtn)}>
          <LabelSettings title="You need to pay" />
        </div>
        <div className={cn(styles.payInfo)}>
          {/* <PayInfo title="Gas Amount" value={`${price.gasAmount} NEAR`} size="big" /> */}
          <PayInfo title="Service Fee" value={`0 NEAR`} size="big" />
        </div>
        <div className={cn(styles.payBtn_block)}>
       
          <ButtonPay
            onClick={() => {
              nearAccount ? getTransactionAndWarning() : setNotAccount(true);
            }}
            styleBtn="default"
          
            title={`PAY & CREATE`}
          />
        </div>
      </div>

      <div className={cn(styles.navigation)}>
        <Link to="/settings_NFT">
          <LinksStep step="prev" label="Back" />
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
       title={'You will now need to sign several transactions: one to create your Lootbox and another to fill it with the tokens you selected. '}
       subtitle={'Transactions will open automatically, one after the other.'}
       className={styles.modalTitle}
       classNameSubtitle={styles.modalSubtitle}
        content={
          <ButtonPay
            onClick={() => {
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
