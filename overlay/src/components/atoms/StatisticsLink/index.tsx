import React, { FC } from 'react';
import styles from './StatisticsLink.module.scss';
import cn from 'classnames';
import { LinksStep } from '../LinksStep';

export interface StatisticsLinkProps {
  label: string;
  className?: string;
}
export const StatisticsLink: FC<StatisticsLinkProps> = (props: StatisticsLinkProps) => {
  const { label } = props;
  return (
    <div className={cn(styles.wrapper)}>
      <LinksStep label="Back" step="prev" />

      <span className={cn(styles.linksNavigation)}>{label}</span>
    </div>
  );
};
