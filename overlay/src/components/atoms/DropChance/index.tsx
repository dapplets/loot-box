import React, { FC, DetailedHTMLProps, InputHTMLAttributes, useMemo } from 'react';
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
  innerRef?: any;
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
    innerRef
  } = props;

  const valueToShow = useMemo(
    () => () => {
      valueDropChance;
    },
    [valueDropChance],
  );

  return (
    <div className={cn(styles.inputPanel)}>
      <input
          ref={innerRef}
        type={type}
        value={valueDropChance}
        onFocus={() => {
          onValueDropChance(valueDropChance);
        }}
        onChange={(e: any) => {
          const { data, inputType } = e.nativeEvent;

          switch (inputType) {
            case 'insertText':
              if (isNaN(+data) === false && data !== ' ') {
                const newValue = valueDropChance === '0' ? data : valueDropChance + data;
                onValueDropChance(newValue);
              }
              break;
            case 'deleteContentBackward':
              const newValue = valueDropChance.slice(0, -1);

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
