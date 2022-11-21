import cn from 'classnames'
import React, { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../atoms/Button'
import { LabelSettings } from '../atoms/LabelSettings'
import { SettingTitle } from '../atoms/SettingTitle'
import styles from './BoxSettings.module.scss'

export interface BoxSettingsProps {
  children?: ReactNode
  onChange?: () => void
  onSubmit?: () => void
  dataType?: string
  classNameNft?: string
  classNameToken?: string
  onClick?: any
}
export const ButtonsSetting: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { classNameNft, classNameToken, onClick } = props

  return (
    <div className={cn(styles.wrapperBtn)}>
      <SettingTitle isActive={true} title="Box settings" />
      <div className={styles.div}>
        <div className={cn(styles.loot)}>
          <LabelSettings title="Loot" />
          <div className={cn(styles.buttons)}>
            <Link to="/settings_token" className={styles.btnLink}>
              <Button
                appearance="medium"
                className={classNameToken}
                isShowDescription
                btnText="Token"
                onClick={onClick}
              />
            </Link>
            <Link to="/settings_NFT" className={styles.btnLink}>
              <Button
                appearance="medium"
                className={classNameNft}
                isShowDescription
                btnText="NFT"
                onClick={onClick}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
