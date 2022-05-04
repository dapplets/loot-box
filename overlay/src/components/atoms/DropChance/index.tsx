import React, {
  useState,
  FC,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ChangeEventHandler,
  useMemo,
} from 'react';
import styles from './DropChance.module.scss';
import cn from 'classnames';
import less from '../../../icons/Input/less.svg';
import more from '../../../icons/Input/more.svg';

export interface DropChanceProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  prop?: string;
  className?: string;
  onSubmit?: () => void;
  placeholder?: string;
  type: string;
  maxValueDropChance: string | number;
  minValueDropChance: string | number;
  valueDropChance: any;
  onValueDropChance: any;
  valueButtonDropChance: any;
  setValueButtonDropChance: any;
}

export const DropChance: FC<DropChanceProps> = (props) => {
  const {
    maxValueDropChance,
    minValueDropChance,
    valueDropChance = '20',
    onValueDropChance = () => {},
    valueButtonDropChance,
    setValueButtonDropChance,
    type,
  } = props;

  const valueToShow = useMemo(
    () => () => {
      `${valueDropChance}%`;
    },
    [valueDropChance],
  );

  return (
    <div className={cn(styles.inputPanel)}>
      <input
        type={type}
        value={`${valueDropChance}%`}
        onFocus={() => {
          onValueDropChance('');
        }}
        onChange={(e: any) => {
          const { data, inputType } = e.nativeEvent;

          console.log({ data, inputType, e });
          switch (inputType) {
            case 'insertText':
              if (isNaN(+data) === false && data !== ' ') {
                const newValue = valueDropChance === '0' ? data : valueDropChance + data;
                if (+newValue > 100) onValueDropChance('100');
                else onValueDropChance(newValue);
              }
              break;
            case 'deleteContentBackward':
              const newValue = valueDropChance.slice(0, -2);
              // if (newValue.length === 0) onValueDropChance('1');
              // else
              onValueDropChance(newValue);
              break;

            default:
              break;
          }
        }}
        onBlur={() => {
          valueDropChance === '0' ? onValueDropChance('20') : onValueDropChance(valueDropChance);
        }}
        max={maxValueDropChance}
        min={minValueDropChance}
        className={cn(styles.inputInfo)}
      />
      <div className={cn(styles.buttonPanel)}>
        <button
          onClick={() =>
            setValueButtonDropChance(valueButtonDropChance - 1 < 1 ? 1 : valueButtonDropChance - 1)
          }
          type="button"
          className={cn(styles.default)}
        >
          <img src={less} alt="" />
        </button>
        <button
          onClick={() =>
            setValueButtonDropChance(
              valueButtonDropChance + 1 > 100 ? 100 : valueButtonDropChance + 1,
            )
          }
          type="button"
        >
          <img src={more} alt="" />
        </button>
      </div>
    </div>
  );
};
