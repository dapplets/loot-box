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

import { WinnersInfo } from '../atoms/WinnersInfo';

export interface WinnerProps {
  winners: any;
}
export const Winner: FC<WinnerProps> = (props: WinnerProps) => {
  const { winners } = props;

  const Num = () => {
    return winners.map((item: any, index: number) => (
      <div className={cn(styles.winnersList)} key={index}>
        <div className={styles.winnersLink}>
          <div className={styles.itemLink}>{'@dilman'}</div>

          <div className={styles.itemLink}>{item.nearAccount}</div>
          <div className={styles.itemLink}>{item.amount}</div>
        </div>

        <a href={item.txLink} className={styles.label}>
          TX
        </a>
      </div>
    ));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.blockInfo}>
        <ul className={styles.listTitle}>
          <span className={styles.itemTitle}>Twitter:</span>
          <li className={styles.itemTitle}>Near:</li>
          <li className={styles.itemTitle}>Amount:</li>
          <li className={styles.itemTitle}>TX</li>
        </ul>
        <Num />
      </div>
      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink label="Copy winners" />
        </Link>
      </div>
    </div>
  );
};
