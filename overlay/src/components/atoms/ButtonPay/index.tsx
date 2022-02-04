import React, { FC } from 'react';
import cn from 'classnames';
import styles from './ButtonPay.module.scss';

export interface ButtonPayProps {
  title: string;
  styleBtn: 'default' | 'disable';
}
export const ButtonPay: FC<ButtonPayProps> = (props) => {
  const { title, styleBtn } = props;
  return (
    <button
      className={cn(styles.ButtonPay, {
        [styles.default]: styleBtn === 'default',
        [styles.disable]: styleBtn === 'disable',
      })}
      type="submit"
    >
      {title}
    </button>
  );
};
