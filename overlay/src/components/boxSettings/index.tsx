import cn from 'classnames'
import React, { FC, ReactNode } from 'react'
import styles from './BoxSettings.module.scss'
import { ButtonsSetting } from './buttonsSetting'

export interface BoxSettingsProps {
  children?: ReactNode
  onChange?: () => void
  onSubmit?: () => void
  dataType?: string
}

export const SettingDef: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  return (
    <div className={cn(styles.wrapper)}>
      <ButtonsSetting />
    </div>
  )
}
