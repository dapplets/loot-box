import React, { CSSProperties, ReactElement } from 'react';
import styles from './LabelSettings.module.scss';
import cn from 'classnames';

export interface LabelSettingsProps {
  title: string;
  isActive?: boolean;
  style?: CSSProperties;
  found?: number | null;
  className?: string;
}

export const LabelSettings = (props: LabelSettingsProps) => {
  const { title } = props;
  return <h2 className={cn(styles.label)}>{title}</h2>;
};
