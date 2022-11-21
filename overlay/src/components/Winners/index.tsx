import cn from 'classnames'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { StatisticsLink } from '../atoms/StatisticsLink'
import styles from './Winner.module.scss'

export interface WinnerProps {
  winners: any
  winnersLabelInfo: any
}
export const Winner: FC<WinnerProps> = (props: WinnerProps) => {
  const { winners, winnersLabelInfo } = props
  const newStr = winnersLabelInfo.replace(/[-]{0,1}[\d]*[\.]{0,1}[\d]+/g, '')
  return (
    <div className={styles.wrapper}>
      <div className={styles.blockInfo}>
        <table>
          <thead>
            <tr>
              <th className={styles.itemTitle}>Near</th>
              <th className={styles.itemTitle}>Amount</th>
              {/* <th className={styles.itemTitle}>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {winners.map((item: any, index: number) => (
              <tr key={index}>
                <td className={styles.itemLink}>
                  <span>{item.nearAccount}</span>
                </td>
                <td className={styles.itemLink}>
                  {item.amount % 1 === 0
                    ? item.amount + newStr
                    : item.amount.replace(/[,.]?0+$/, '') + newStr}
                </td>
                {/* <td>
                  <a href={item.txLink} target="_blank" className={styles.label}>
                    OPEN TX
                  </a>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink />
        </Link>
      </div>
    </div>
  )
}
