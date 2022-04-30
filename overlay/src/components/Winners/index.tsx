import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  ChangeEvent,
  ChangeEventHandler,
} from 'react';
import styles from './Winner.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import { StatisticsLink } from '../atoms/StatisticsLink';

export interface WinnerProps {
  winners: any;
  // getWin: any;
}
export const Winner: FC<WinnerProps> = (props: WinnerProps) => {
  const { winners } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.blockInfo}>
        <table
        //  className={styles.blockInfo}
        >
          <thead>
            <tr
            // className={styles.listTitle}
            >
              {/* <span className={styles.itemTitle}>Twitter:</span> */}
              <th className={styles.itemTitle}>Near</th>
              <th className={styles.itemTitle}>Amount</th>
              <th className={styles.itemTitle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((item: any, index: number) => (
              <tr key={index}>
                <td className={styles.itemLink}>
                  <span>{item.nearAccount}</span>
                </td>
                <td className={styles.itemLink}>{item.amount}</td>
                <td>
                  <a href={item.txLink} target="_blank" className={styles.label}>
                    OPEN TX
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink label="Copy winners" />
        </Link>
      </div>
    </div>
  );
};
