import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import React, { FC, FunctionComponent, ReactNode } from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';
export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  disabled?: boolean;
  appearance: 'small' | 'big' | 'medium' | 'remove';
  btnText: string;
  isShowDescription?: boolean;
}
export const Button: FC<ButtonProps> = (props: ButtonProps) => {
  const {
    disabled = false,
    appearance,
    btnText,
    className,
    isShowDescription = false,
    ...anotherProps
  } = props;
  return (
    <button
      className={cn(
        styles.button,
        {
          [styles.small]: appearance === 'small',
          [styles.big]: appearance === 'big',
          [styles.medium]: appearance === 'medium',
          [styles.remove]: appearance === 'remove',
        },
        className,
      )}
      {...anotherProps}
      disabled={disabled}
    >
      {btnText}
    </button>
  );
};
