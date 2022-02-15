import React, {
  useState,
  FC,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ChangeEvent,
  ReactNode,
  ReactChild,
  Component,
  MutableRefObject,
  ChangeEventHandler,
  useMemo,
  useEffect,
} from 'react';
import { useToggle } from '../../../hooks/useToggle';
import { InputPanel, InputProps } from '../Input';
import { LabelSettings } from '../LabelSettings';
import { CreatedBox } from '../CreatedBoxCard';
import { CreateNewBox } from '../../createNewBox';
import { DeployBox } from '../../deployBox';
import { Button } from '../Button';
import box1 from '../../../icons/createNewBox/box1.png';
import box2 from '../../../icons/createNewBox/box2.png';
import box3 from '../../../icons/createNewBox/box3.png';
import box4 from '../../../icons/createNewBox/box4.png';
import left from '../../../icons/selectBox/sliderLeft.svg';
import right from '../../../icons/selectBox/sliderRight.svg';
import { RadioButton } from '../RadioButton';

import cn from 'classnames';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider, KeenSliderPlugin, KeenSliderInstance } from 'keen-slider/react';
import './Test.module.scss';

import classNames from 'classnames';
import { Lootbox } from '../../../../../common/interfaces';
import styles from './Test.module.scss';
export interface TestProps {
  // prop?: '20';
  // numChildren: number;
}

export const Test: FC<TestProps> = (props: TestProps) => {
  // The actual quantity
  const [qty, setQty] = useState(1);
  // The quantity string the user is editing
  const [qtyString, setQtyString] = useState(String(qty));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Always update the string
    setQtyString(e.target.value);
    // Is it a valid positive number?
    e.target.value = e.target.value.trim();
    const value = e.target.value ? +e.target.value : NaN;
    if (isNaN(value) || value <= 0) {
      // No, our quantity is 1 (even though the string may
      // not be)
      setQty(1);
    } else {
      // Yes, use it
      setQty(value);
    }
  };

  // Just for demo purposes:
  // console.log(`qty = ${qty}, qtyString = ${JSON.stringify(qtyString)}`);

  return (
    <input
      placeholder="Please provide a number > 0"
      pattern="^[0-9]\d*$"
      type="text"
      value={qtyString}
      onChange={handleChange}
    />
  );
};
