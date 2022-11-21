import cn from 'classnames'
import React, { FC } from 'react'
import styles from './StatisticsInfo.module.scss'

export interface StatisticsInfoProps {
  title: string
  value: string
  appearance?: 'text' | 'hash' | 'link'
  className?: string
}
export const StatisticsInfo: FC<StatisticsInfoProps> = (props: StatisticsInfoProps) => {
  const { title, value, appearance, className } = props
  const visible = ({
    value,
    appearance,
  }: Pick<StatisticsInfoProps, 'value' | 'appearance'>): string => {
    if (appearance === 'text' || appearance === 'link') return value
    return value
  }

  const isLink = appearance === 'link'
  return (
    <div className={cn(styles.wrapper, className)}>
      <h6 className={styles.title}>{title}:</h6>
      {isLink ? (
        <a href={value} className={styles.value} target="_blank" rel="noreferrer">
          {visible({ appearance, value })}
        </a>
      ) : (
        <span className={styles.value}>{visible({ appearance, value })}</span>
      )}
    </div>
  )
}
