import cn from 'classnames'
import React, { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'
import styles from './RadioButton.module.scss'

export interface RadioButtonProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: string
  value: string
  name: string
  radioHandler?: () => void
  isShow?: boolean
}
export const RadioButton: FC<RadioButtonProps> = (props: RadioButtonProps) => {
  const { id, value, name, radioHandler, isShow, ...otherProps } = props

  return (
    <div className={cn(styles.form_radio)}>
      <input type="radio" name={name} id={id} value={value} {...otherProps} />
      <label htmlFor={id} className={cn(styles.inputRadioTitle)}>
        {value}
      </label>
    </div>
  )
}
