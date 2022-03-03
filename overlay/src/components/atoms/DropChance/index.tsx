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
  max: string | number;
  min: string | number;
  _value: any;
  _onValueChange: any;
  value: any;
  setValue: any;
}

export const DropChance: FC<DropChanceProps> = (props) => {
  const { max, min, _value = '20', _onValueChange = () => {}, value, setValue, type } = props;

  const valueToShow = useMemo(
    () => () => {
      `${_value}%`;
    },
    [_value],
  );

  return (
    <div className={cn(styles.inputPanel)}>
      <input
        // onSubmit={handleSubmit}
        type={type}
        value={`${_value}%`}
        onChange={(e: any) => {
          const { data, inputType } = e.nativeEvent;
          console.log({ data, inputType, e });
          switch (inputType) {
            case 'insertText':
              if (isNaN(+data) === false && data !== ' ') {
                const newValue = _value === '0' ? data : _value + data;
                if (+newValue > 100) _onValueChange('100');
                else _onValueChange(newValue);
              }
              break;
            case 'deleteContentBackward':
              const newValue = _value.slice(0, -1);
              if (newValue.length === 0) _onValueChange('0');
              else _onValueChange(newValue);
              break;

            default:
              break;
          }
        }}
        max={max}
        min={min}
        className={cn(styles.inputInfo)}
      />
      <div className={cn(styles.buttonPanel)}>
        <button
          onClick={() => setValue(value - 1 < 0 ? 0 : value - 1)}
          type="button"
          className={cn(styles.default)}
        >
          <img src={less} alt="" />
        </button>
        <button onClick={() => setValue(value + 1 > 100 ? 100 : value + 1)} type="button">
          <img src={more} alt="" />
        </button>
      </div>
    </div>
  );
};
