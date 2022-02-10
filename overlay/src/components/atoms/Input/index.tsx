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
import { Lootbox } from '../../../../../common/interfaces';
export interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onSubmit?: () => void;
  value?: string | number;
  placeholder?: string;
  isButton?: true;
  appearance:
    | 'small_mini'
    | 'small'
    | 'small_medium'
    | 'default'
    | 'medium'
    | 'medium_big'
    | 'big'
    | 'biggest';
  className?: 'string';
  type: string;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: Lootbox) => void;
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
    creationForm,
    onCreationFormUpdate,
    ...anotherProps
  } = props;
  const handleSubmit: ChangeEventHandler<HTMLInputElement> = (event) => {
    // const formData = new FormData(event.currentTarget);
    event.preventDefault();
    const { name, value } = event.currentTarget;

    // creationForm.name = value;

    // onCreationFormUpdate(creationForm);
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
            [styles.small_mini]: appearance === 'small_mini',
            [styles.small]: appearance === 'small',
            [styles.small_medium]: appearance === 'small_medium',
            [styles.default]: appearance === 'default',
            [styles.medium]: appearance === 'medium',
            [styles.medium_big]: appearance === 'medium_big',
            [styles.big]: appearance === 'big',
            [styles.biggest]: appearance === 'biggest',
          },
          className,
        )}
        onSubmit={handleSubmit}
        onChange={onChange}
      />
    </div>
  );
};
