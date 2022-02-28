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
  value?: string | number | string[];
  placeholder?: string;
  type: string;
  max: string | number;
  min: string | number;
  stateChangeDek: any;
  stateChangeInk: any;
  // qty: any;
}

export const DropChance: FC<DropChanceProps> = (props) => {
  const {
    // prop,
    // className,
    max,
    min,
    // onSubmit,
    value,
    // placeholder,
    type,
    onChange,
    onClick,
    // ...otherProps
    stateChangeDek,
    stateChangeInk,
    // qty,
  } = props;

  // ToDo: remove state and use the state from App.tsx
  // const [qty, setQty] = useState(20);
  // const stateChangeDek = () => {
  //   if (qty >= 100) return 0;
  //   setQty(qty + 10);
  // };
  // const stateChangeInk = () => {
  //   if (qty <= 0) return 10;
  //   setQty(qty - 10);
  // };
  const handleSubmit: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const { name, value } = event.currentTarget;
  };
  // console.log(qty);

  return (
    <div className={cn(styles.inputPanel)}>
      <input
        // onSubmit={handleSubmit}
        type={type}
        value={value + '%'} // ToDo: + '%'
        // defaultValue={prop}
        onChange={onChange} // ToDo: remove '%'
        // onClick={onClick}
        max={max}
        min={min}
        className={cn(styles.inputInfo)}
      />
      <div className={cn(styles.buttonPanel)}>
        <button onClick={stateChangeInk} type="button" className={cn(styles.default)}>
          <img src={less} alt="" />
        </button>
        <button onClick={stateChangeDek} type="button">
          <img src={more} alt="" />
        </button>
      </div>
    </div>
  );
};
