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
          <WinnersInfo title="Twitter" value="@dilman" />
          <WinnersInfo value={item.nearAccount} title="Near" />
          <WinnersInfo title="Amount" value={item.amount} />
        </div>

        <a href={item.txLink} className={styles.label}>
          TX
        </a>
      </div>
    ));
  };

  return (
    <div className={styles.wrapper}>
      <Num />

      <div className={cn(styles.link)}>
        <StatisticsLink label="Copy winners" />
      </div>
    </div>
  );
};
