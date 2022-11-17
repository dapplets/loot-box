import cn from 'classnames'
import React, { FC } from 'react'
import { LinksStep } from '../LinksStep'
import styles from './StatisticsLink.module.scss'

export interface StatisticsLinkProps {
  label?: string
  className?: string
}
export const StatisticsLink: FC<StatisticsLinkProps> = (props: StatisticsLinkProps) => {
  const { label } = props
  return (
    <div className={cn(styles.wrapper)}>
      <LinksStep label="Back" step="prev" />

      <span className={cn(styles.linksNavigation)}>{label}</span>
    </div>
  )
}
