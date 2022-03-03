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
  BaseSyntheticEvent,
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
import { MessageData } from '../../../App';
export interface TestProps {
  MessageData?: any;
  // prop?: '20';
  // numChildren: number;
  // creationForm?: Lootbox;
  // onCreationFormUpdate?: (x: any) => void;
}

export const Test: FC<TestProps> = (props: TestProps) => {
  const { MessageData } = props;

  const [value, setValue] = React.useState(0);
  useEffect(() => {
    // onCreationFormUpdate((creationForm.dropChance = value));
    console.log({ value });
  });

  // Just for demo purposes:
  // console.log(`qty = ${qty}, qtyString = ${JSON.stringify(qtyString)}`);

  return (
    <div className="App">
      <SomeInput
        _value={`${MessageData.boxMessage}`}
        _onValueChange={(newValue: any) => setValue(+newValue)}
        value={value}
        setValue={setValue}
      />
    </div>
  );
};
interface SomeInputProps {
  _value: any;
  _onValueChange: any;
  value: any;
  setValue: any;
}
export const SomeInput: FC<SomeInputProps> = (props: SomeInputProps) => {
  const { _value = '0', _onValueChange = () => {}, value, setValue } = props;
  const valueToShow = useMemo(
    () => () => {
      `${_value}%`;
    },
    [_value],
  );
  //    useMemo(() => (${_value}%), [_value])
  //  ({ _value = '0', _onValueChange = () => {} }:props)
  return (
    <>
      <input
        type={'string'}
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
        value={`${_value}%`}
      />
      <button onClick={() => setValue(value - 1 < 0 ? 0 : value - 1)}>-</button>
      <button onClick={() => setValue(value + 1 > 100 ? 100 : value + 1)}>+</button>
    </>
  );
};

// interface FormProps {
//   value: any;
//   setValue: any;
// }
// const Form: FC<FormProps> = (props: FormProps) => {
//   const { value, setValue } = props;
//   return (
//     <>
//       <SomeInput
//         _value={`${value as string}`}
//         _onValueChange={(newValue: any) => setValue(+newValue)}
//       />

//     </>
//   );
// };
