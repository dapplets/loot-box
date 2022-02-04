import React, { ChangeEvent, CSSProperties, ReactElement } from 'react';
import styles from './StatisticsTitle.module.scss';
import cn from 'classnames';

export interface StatisticsTitleProps {
  title: string;
  isActive?: boolean;
  style?: CSSProperties;
  found?: number | null;
  className?: string;
  // checked?: boolean;
  onClick?: any;
}

export const StatisticsTitle = (props: StatisticsTitleProps): ReactElement => {
  const { title, isActive = false, found = null, style, className, onClick } = props;
  // const isVisibleFound = found && found > 0;

  return (
    <div className={cn(styles.wrapper, className)}>
      <h4
        onClick={onClick}
        className={cn(styles.title, { [styles.isActive]: isActive })}
        style={style}
      >
        {title}
        {/* {isVisibleFound ? <span className={styles.found}>{found}</span> : null} */}
      </h4>
    </div>
  );
};
