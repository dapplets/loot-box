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
  useRef,
  useCallback,
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
import copy from 'copy-to-clipboard';
import classNames from 'classnames';
import { Lootbox } from '../../../../../common/interfaces';
import styles from './Test.module.scss';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyToClipboard from 'copy-to-clipboard';
export interface TestProps {
  prop?: string;
  className?: string;
  onSubmit?: () => void;
  placeholder?: string;
  type: string;

  valueDropChance: any;
  onValueDropChance: any;
}

export const Test: FC<TestProps> = (props) => {
  const {
    valueDropChance = '',
    onValueDropChance = () => {},

    type,
  } = props;
  const valueToShow = useMemo(
    () => () => {
      `${valueDropChance}`;
    },
    [valueDropChance],
  );
  const regExpIndex = new RegExp(/\d+(\.?\d+)?/gm);
  // /\d+(\.?\d+)?/gm
  return (
    <div>
      <input
        value={`${valueDropChance}`}
        onChange={(e: any) => {
          const { data, inputType } = e.nativeEvent;
          const test = regExpIndex.test(data);
          // console.log({ data, inputType, e });
          switch (inputType) {
            case 'insertText':
              if (test) {
                const newValue = valueDropChance + data;
                onValueDropChance(newValue);
              } else {
                const newValue = '';
                onValueDropChance(newValue);
              }
              break;

            default:
              break;
          }
        }}
      />
    </div>
  );
};
