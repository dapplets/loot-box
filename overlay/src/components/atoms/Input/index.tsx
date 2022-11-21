import cn from 'classnames'
import React, { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'
import styles from './Input.module.scss'

export interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onSubmit?: () => void
  value?: string | number | string[]
  placeholder?: string
  isButton?: true
  appearance:
    | 'small_mini'
    | 'small'
    | 'small_medium'
    | 'default'
    | 'medium'
    | 'medium_big'
    | 'big'
    | 'biggest'
  className?: string
  type: string
  pattern?: string
  innerRef?: any
}

export const InputPanel: FC<InputProps> = (props) => {
  const {
    value,
    onChange,
    onSubmit,
    placeholder,
    appearance,
    className,
    type,
    pattern,
    innerRef,
    ...anotherProps
  } = props

  return (
    <div className={cn(styles.inputPanel)}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        pattern={pattern}
        ref={innerRef}
        className={cn(
          styles.inputInfo,
          {
            [styles.small_mini]: appearance === 'small_mini',
            [styles.small]: appearance === 'small',
            [styles.small_medium]: appearance === 'small_medium',
            [styles.default]: appearance === 'default',
            [styles.medium]: appearance === 'medium',
            [styles.medium_big]: appearance === 'medium_big',
            [styles.big]: appearance === 'big',
            [styles.biggest]: appearance === 'biggest',
          },
          className
        )}
        onChange={onChange}
        {...anotherProps}
      />
    </div>
  )
}
