import React, {  CSSProperties, ReactElement } from 'react';
import styles from './StatisticsTitle.module.scss';
import cn from 'classnames';

export interface StatisticsTitleProps {
  title: string;
  isActive?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: any;
}

export const StatisticsTitle = (props: StatisticsTitleProps): ReactElement => {
  const { title, isActive = false, style, className, onClick } = props;

  return (
    <div className={cn(styles.wrapper, className)}>
      <h4
        onClick={onClick}
        className={cn(styles.title, { [styles.isActive]: isActive })}
        style={style}
      >
        {title}
      </h4>
    </div>
  );
};
