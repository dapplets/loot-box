import cn from 'classnames'
import React, { FC } from 'react'
import styles from './ButtonPay.module.scss'

export interface ButtonPayProps {
  title: string
  styleBtn: 'default' | 'disable'
  onClick?: () => void
}
export const ButtonPay: FC<ButtonPayProps> = (props) => {
  const { title, styleBtn, onClick } = props
  return (
    <button
      onClick={onClick}
      className={cn(styles.ButtonPay, {
        [styles.default]: styleBtn === 'default',
        [styles.disable]: styleBtn === 'disable',
      })}
      type="submit"
    >
      {title}
    </button>
  )
}
