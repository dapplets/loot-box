import cn from 'classnames'
import React, { FC } from 'react'
import styles from './LinksStep.module.scss'

interface LinksStepProps {
  step: 'next' | 'prev'
  label: string
  className?: string
  disabled?: boolean
}

export const LinksStep: FC<LinksStepProps> = (props: LinksStepProps) => {
  const { step, label, className, disabled } = props
  return (
    <button
      className={cn(
        styles.linksNavigation,
        {
          [styles.next]: step === 'next',
          [styles.prev]: step === 'prev',
        },
        className
      )}
    >
      {label}

      <span>
        <svg
          width="11"
          height="14"
          viewBox="0 0 11 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 0L-6.11959e-07 7L11 14L11 0Z" fill="#E3E3E3" />
        </svg>
      </span>
    </button>
  )
}
