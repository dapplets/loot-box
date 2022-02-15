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
  const [loader, setLoader] = useState('');

  //create message setter
  const messageSetter = (message) => {
    setLoader(message);
  };

  //render pre loader on whether loader message exists
  //pass messege setter to other components
  return (
    <div>
      {loader && <Preloader message={loader} />}
      <OtherComponent messageSetter={messageSetter} />
    </div>
  );
};
export interface MessageProps {
  message: any;
}
export const Preloader: FC<MessageProps> = (props: MessageProps) => {
  const { message } = props;
  return <div>{message}</div>;
};

export interface OtherComponentProps {
  messageSetter: any;
}
export const OtherComponent: FC<OtherComponentProps> = (props: OtherComponentProps) => {
  const { messageSetter } = props;
  const [data, setData] = useState('');

  //mock api call
  const yourFunction = async () => {
    let mockApi = new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve('Your data.');
      }, 2000);
    });
    //await data
    let result = await mockApi;
    //set data to state
    setData(result);
    //close loader
    messageSetter('');
  };

  //call loader with custom message and api call on click
  return (
    <div>
      <button
        onClick={() => {
          messageSetter('custom loading message');
          yourFunction();
        }}
      >
        Click
      </button>
      <div>{data ? data : 'No data called.'}</div>
    </div>
  );
};
