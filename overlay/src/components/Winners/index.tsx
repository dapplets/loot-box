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

export interface WinnerProps {}
export const Winner: FC<WinnerProps> = (props: WinnerProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.winners)}>
        <div className={cn(styles.winnersList)}>
          <WinnersInfo title="Twitter" value="@dilman" />
          <WinnersInfo title="Near" value="vasya.near" />
          <WinnersInfo title="Amount" value="@9 999 999" />
        </div>

        <span className={styles.label}>Transition</span>
      </div>
      <div className={cn(styles.link)}>
        <StatisticsLink label="Copy winners" />
      </div>
    </div>
  );
};
