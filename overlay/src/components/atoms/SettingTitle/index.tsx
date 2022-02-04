import React, { CSSProperties, ReactElement } from 'react';
import styles from './SettingTitle.module.scss';
import cn from 'classnames';

export interface SettingTitleProps {
  title: string;
  isActive?: boolean;
  style?: CSSProperties;
  found?: number | null;
  className?: string;
}

export const SettingTitle = (props: SettingTitleProps): ReactElement => {
  const { title, isActive = false, found = null, style, className } = props;
  const isVisibleFound = found && found > 0;

  return (
    <div className={cn(styles.wrapper, className)}>
      <h4 className={cn(styles.title, { [styles.isActive]: isActive })} style={style}>
        {title}
        {isVisibleFound ? <span className={styles.found}>{found}</span> : null}
      </h4>
    </div>
  );
};
