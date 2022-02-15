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
  value?: string | number | string[];
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
  pattern?: string;
  // creationForm: Lootbox;
  // onCreationFormUpdate: (x: Lootbox) => void;
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
    pattern,
    // creationForm,
    // onCreationFormUpdate,
    ...anotherProps
  } = props;
  const [qty, setQty] = useState(1);
  // The quantity string the user is editing
  const [qtyString, setQtyString] = useState(String(qty));
  const handleSubmit: ChangeEventHandler<HTMLInputElement> = (event) => {
    // const formData = new FormData(event.currentTarget);
    // event.preventDefault();
    // const { name, value } = event.currentTarget;

    // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //   // Always update the string
    setQtyString(event.target.value);
    // Is it a valid positive number?
    event.target.value = event.target.value.trim();
    const value = event.target.value ? +event.target.value : NaN;
    if (isNaN(value) || value <= 0) {
      // No, our quantity is 1 (even though the string may
      // not be)
      setQty(1);
    } else {
      // Yes, use it
      setQty(value);
    }

    // creationForm.name = value;

    // onCreationFormUpdate(creationForm);
  };

  return (
    <div className={cn(styles.inputPanel)}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        // pattern="^[1-9]\d*$"
        pattern={pattern}
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
