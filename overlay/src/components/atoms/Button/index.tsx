import cn from 'classnames'
import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react'
import styles from './Button.module.scss'

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  disabled?: boolean
  appearance: 'small' | 'big' | 'medium' | 'remove'
  btnText: string
  isShowDescription?: boolean
}
export const Button: FC<ButtonProps> = (props: ButtonProps) => {
  const {
    disabled = false,
    appearance,
    btnText,
    className,
    isShowDescription = false,
    ...anotherProps
  } = props
  return (
    <button
      className={cn(
        styles.button,
        {
          [styles.small]: appearance === 'small',
          [styles.big]: appearance === 'big',
          [styles.medium]: appearance === 'medium',
          [styles.remove]: appearance === 'remove',
        },
        className
      )}
      {...anotherProps}
      disabled={disabled}
    >
      {btnText}
    </button>
  )
}
