import cn from 'classnames'
import React, { ChangeEventHandler, DetailedHTMLProps, FC } from 'react'
import styles from './TextArea.module.scss'

export interface TextAreaProps
  extends DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  onSubmit?: () => void
  value?: any
  placeholder?: string
  isButton?: true

  className?: 'string'
}

export const TextArea: FC<TextAreaProps> = (props) => {
  const { value, onChange, onSubmit, placeholder, className, ...anotherProps } = props
  const handleSubmit: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    event.preventDefault()

    event.preventDefault()
    const { name, value } = event.currentTarget
  }
  return (
    <div className={cn(styles.inputPanel)}>
      <textarea
        value={value}
        className={cn(styles.inputInfo)}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={250}
        onSubmit={handleSubmit}
        {...anotherProps}
      />
    </div>
  )
}
