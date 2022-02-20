import React, {
  useState,
  FC,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ChangeEventHandler,
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
  value?: string | number;
  placeholder?: string;
  type: string;
  max: string | number;
  min: string | number;
}
export const DropChance: FC<DropChanceProps> = (props) => {
  const {
    prop,
    className,
    max,
    min,
    onSubmit,
    value,
    placeholder,
    type,
    onChange,
    ...otherProps
  } = props;
  const [valueNum, setValueNum] = useState(value as number);
  const stateChangeDek = () => {
    if (valueNum >= 100) return 0;
    setValueNum(valueNum + 10);
  };
  const stateChangeInk = () => {
    if (valueNum <= 0) return 0;
    setValueNum(valueNum - 10);
  };
  const handleSubmit: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const { name, value } = event.currentTarget;
    // console.log(name, value);
  };
  return (
    <div className={cn(styles.inputPanel)}>
      <input
        onSubmit={handleSubmit}
        type={type}
        value={valueNum}
        // defaultValue={prop}
        onChange={onChange}
        max={max}
        min={min}
        className={cn(styles.inputInfo)}
      />
      <div className={cn(styles.buttonPanel)}>
        <button onClick={stateChangeInk} type="button" className={cn(styles.default)}>
          <img src={less} alt="" />
        </button>
        <button type="button">
          <img onClick={stateChangeDek} src={more} alt="" />
        </button>
      </div>
    </div>
  );
};
