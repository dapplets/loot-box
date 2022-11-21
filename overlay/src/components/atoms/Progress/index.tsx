import cn from 'classnames'
import React, { FC } from 'react'
import prog from '../../../icons/progress/progress.svg'
import { LabelSettings } from '../LabelSettings'
import styles from './Progress.module.scss'
export interface ProgressProps {
  completed: number
  bgcolor: string
}
export const Progress: FC<ProgressProps> = (props: ProgressProps) => {
  const { completed, bgcolor } = props

  return (
    <div className={cn(styles.progress)}>
      <div className={cn(styles.progressLabel)}>
        <LabelSettings title="Total Amount" />
        <span className={cn(styles.progressPercent)}>{`${completed}%`}</span>
      </div>
      <div className={cn(styles.wrapper)}>
        <div
          style={{
            width: `${completed}%`,
            height: '100%',
            backgroundColor: bgcolor,
            borderRadius: 'inherit',
            textAlign: 'right',
            position: 'relative',
          }}
        >
          <span style={{ position: 'relative', top: '-1px' }} className={cn(styles.labelStyles)}>
            <img src={prog} alt="" />
          </span>
        </div>
      </div>
    </div>
  )
}
