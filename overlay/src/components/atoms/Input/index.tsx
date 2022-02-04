import React, { ChangeEvent, FC } from 'react';
import {
  InputHTMLAttributes,
  DetailedHTMLProps,
  useState,
  FormEventHandler,
  ChangeEventHandler,
} from 'react';
import cn from 'classnames';
import styles from './Input.module.scss';
import { useToggle } from '../../../hooks/useToggle';
import less from '../../../icons/Input/less.svg';
import more from '../../../icons/Input/more.svg';
export interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onSubmit?: () => void;
  value?: string | number;
  placeholder?: string;
  isButton?: true;
  appearance: 'small' | 'medium' | 'big' | 'default' | 'small_medium';
  className?: 'string';
  type: string;
}

export const InputPanel: FC<InputProps> = (props) => {
  const {
    value,
    onChange,
    onSubmit,
    placeholder,
    appearance,
    className,
    type,
    ...anotherProps
  } = props;
  const handleSubmit: ChangeEventHandler<HTMLInputElement> = (event) => {
    // const formData = new FormData(event.currentTarget);
    event.preventDefault();
    const { name, value } = event.currentTarget;
    console.log(name, value);
    console.log(event);
  };

  return (
    <div className={cn(styles.inputPanel)}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className={cn(
          styles.inputInfo,
          {
            [styles.default]: appearance === 'default',
            [styles.small]: appearance === 'small',
            [styles.big]: appearance === 'big',
            [styles.medium]: appearance === 'medium',
            [styles.small_medium]: appearance === 'small_medium',
          },
          className,
        )}
        onSubmit={handleSubmit}
        onChange={onChange}
      />
    </div>
  );
};
