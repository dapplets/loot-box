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
  MessageData?: any;
  value?: string;
  copied?: false;
}

export default function Test(str: string): [boolean, () => void, (value: boolean) => void] {
  const copyableString = useRef(str);
  const [copied, setCopied] = useState(false);

  const copyAction = useCallback(() => {
    const copiedString = copyToClipboard(copyableString.current);
    setCopied(copiedString);
  }, [copyableString]);

  useEffect(() => {
    copyableString.current = str;
  }, [str]);

  return [copied, copyAction, setCopied];
}
