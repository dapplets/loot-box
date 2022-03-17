import React, { FC } from 'react';
import cn from 'classnames';
import styles from './PayInfo.module.scss';

export interface PayInfoProps {
  title: string;
  value: string;
  appearance?: 'text' | 'hash' | 'link';
  className?: string;
  size?: 'big' | 'default';
}

export const PayInfo: FC<PayInfoProps> = ({
  title,
  value,
  appearance = 'hash',
  className,
  size = 'default',
}: PayInfoProps) => {
  const visible = ({ value, appearance }: Pick<PayInfoProps, 'value' | 'appearance'>): string => {
    if (appearance === 'text' || appearance === 'link') return value;

    return value;
  };

  const isLink = appearance === 'link';

  return (
    <div
      className={cn(
        styles.wrapper,
        {
          [styles.small]: size === 'default',
          [styles.big]: size === 'big',
        },
        className,
      )}
    >
      <h6 className={cn(styles.title)}>{title}:</h6>
      {isLink ? (
        <a href={value} className={styles.value} target="_blank" rel="noreferrer">
          {visible({ appearance, value })}
        </a>
      ) : (
        <span className={styles.value}>{visible({ appearance, value })}</span>
      )}
    </div>
  );
};
