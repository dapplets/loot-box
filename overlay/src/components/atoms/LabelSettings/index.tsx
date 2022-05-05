import React, { CSSProperties } from 'react';
import styles from './LabelSettings.module.scss';
import cn from 'classnames';

export interface LabelSettingsProps {
  title: string;
  isActive?: boolean;
  style?: CSSProperties;
  found?: number | null;
  className?: string;
  support?: string;
}

export const LabelSettings = (props: LabelSettingsProps) => {
  const { title, isActive = false, support } = props;

  return (
    <div style={{ display: 'flex' }}>
      <h2 className={cn(styles.label)}>{title}</h2>
      {isActive && <span data-title={support} className={styles.supportHover}></span>}
    </div>
  );
};
