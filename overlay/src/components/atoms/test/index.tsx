import { type } from 'os';
import React, {
  useState,
  FC,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ChangeEvent,
} from 'react';
import { useToggle } from '../../../hooks/useToggle';
import { InputPanel, InputProps } from '../Input';
import { LabelSettings } from '../LabelSettings';
import { CreatedBox } from '../CreatedBoxCard';
import { CreateNewBox } from '../../createNewBox';
import { DeployBox } from '../../deployBox';
import box1 from '../../../icons/createNewBox/box1.png';
import box2 from '../../../icons/createNewBox/box2.png';
import box3 from '../../../icons/createNewBox/box3.png';
import box4 from '../../../icons/createNewBox/box4.png';
export interface TestProps {
  // prop?: '20';
}
export const IMG = [box1, box2, box3, box4];

export const Test: FC<TestProps> = (props) => {
  const [fullSize, setFullSIze] = useState();

  const getImage = (IMG: any) => {
    console.log(IMG);
  };

  return (
    <div className="container">
      <img
        className="api-image"
        src={IMG[0]}
        onClick={() => {
          getImage(IMG);
        }}
      ></img>
      <div className="full-size-image">
        <img src={fullSize} />
      </div>
    </div>
  );
};
