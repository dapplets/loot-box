import { Lootbox } from '@loot-box/common/interfaces'
import cn from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonPay } from '../atoms/ButtonPay'
import { LabelSettings } from '../atoms/LabelSettings'
import { LinksStep } from '../atoms/LinksStep'
import { Modal } from '../atoms/Modal'
import { PayInfo } from '../atoms/PayInfo/PayInfo'
import { SettingTitle } from '../atoms/SettingTitle'
import styles from './FillBox.module.scss'

export interface FillBoxProps {
  imgValue: string
  onDoneClick: () => void
  creationForm: Lootbox
  onCreationFormUpdate: (x: any) => void
  winnersLabelInfo: string
  setWinInfo: (x: string) => void
  setMessageError: (x: any) => void
  messageError: boolean
  newMetadata: any
  nearAccount: string | undefined
  dropType: any
  setClearForm: (x: any) => void
  setMetadata: (x: any) => void
}
export const FillBox: FC<FillBoxProps> = (props: FillBoxProps) => {
  const {
    imgValue,
    onDoneClick,
    creationForm,
    setWinInfo,
    winnersLabelInfo,
    messageError,
    setMessageError,
    newMetadata,
    nearAccount,
    dropType,
    setClearForm,
    setMetadata,
  } = props

  const [winInfoToken, setWinInfoToken] = useState(winnersLabelInfo)
  const [isNotAccount, setNotAccount] = useState(false)
  const [isWarningTransaction, setWarningTransaction] = useState(false)
  useEffect(() => {
    if (dropType === 0) {
      const winAmount = creationForm.nearContentItems[0].tokenAmount
      const winAmountParse = winAmount + ` NEAR`
      setWinInfoToken(winAmountParse)
      setWinInfo(winAmountParse)
    } else if (dropType === 1) {
      const winAmountTicker = creationForm.ftContentItems[0].tokenAmount
      const winAmountTickerParse = newMetadata
        ? `${winAmountTicker} ${newMetadata.symbol}`
        : `${winAmountTicker} TOKEN`
      setWinInfoToken(winAmountTickerParse)
      setWinInfo(winAmountTickerParse)
    }
  }, [nearAccount, isNotAccount])

  const getTransactionAndWarning = () => {
    if (dropType === 1) {
      setWarningTransaction(true)
    } else if (dropType === 0) {
      creationForm.ftContentItems = []
      setClearForm(true)
      onDoneClick()
    }
  }
  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.wrapperInfo}>
        <div className={styles.title}>
          <SettingTitle title="Fill your box" isActive={true} />
        </div>

        <div className={cn(styles.img)} onClick={() => {}}>
          <img src={imgValue} />
          <span className={styles.spanWin}>{winInfoToken}</span>
        </div>

        <div className={cn(styles.payBlock)}>
          <LabelSettings title="You need to pay" />
          <div className={cn(styles.payInfo)}>
            <PayInfo title="Fill Amount" value={`${winInfoToken}`} size="big" />
            {/* <PayInfo title="Gas Amount" value={`${[price.gasAmount]} NEAR`} size="big" /> */}
            <PayInfo title="Service Fee" value={`${0} NEAR`} size="big" />
          </div>
        </div>
        <div className={cn(styles.payBtn)}>
          <ButtonPay
            onClick={() => {
              nearAccount ? getTransactionAndWarning() : setNotAccount(true)
            }}
            styleBtn="default"
            title={`PAY & CREATE`}
          />
        </div>
      </div>
      <div className={cn(styles.navigation)}>
        <Link to="/settings_token" onClick={() => setMetadata(null)}>
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
        title={
          'You will now need to sign several transactions: one to create your Lootbox and another to fill it with the tokens you selected. '
        }
        subtitle={'Transactions will open automatically, one after the other.'}
        className={styles.modalTitle}
        classNameSubtitle={styles.modalSubtitle}
        content={
          <ButtonPay
            onClick={() => {
              creationForm.nearContentItems = []
              setClearForm(true)
              nearAccount ? onDoneClick() : setNotAccount(true)
            }}
            styleBtn="default"
            title={`Proceed`}
          />
        }
        footer={''}
        onClose={() => setWarningTransaction(false)}
      />
    </div>
  )
}
