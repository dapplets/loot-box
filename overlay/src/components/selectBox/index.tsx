import React, { ReactNode, FC } from 'react';
import { SettingTitle } from '../atoms/SettingTitle';
import styles from './SelectBox.module.scss';
import cn from 'classnames';

import blueBox from '../../icons/createNewBox/blue_box.png';
import redBox from '../../icons/createNewBox/red_box.png';
import safe from '../../icons/createNewBox/safe.png';
import box from '../../icons/createNewBox/box.png';
import bag from '../../icons/createNewBox/bag.png';
import pinata from '../../icons/createNewBox/pinata.png';
import pig from '../../icons/createNewBox/pig.png';

import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import { Slider } from '../atoms/Slider';


export interface SelectBoxProps {
  children?: ReactNode;
  id?: number;
  setRef?: any;
  onClick?: () => void;
  image?: string;
  onChange_IMG: (x: string) => void;
  valueIMG?: string;
  creationFormId: number;
  onCreationFormUpdate: (id: number) => void;
  imgId: number | null;
  setClicked: any;
}
export const IMG = [blueBox, redBox, safe, box, bag, pinata, pig];

export interface CetBoxProps {
  onClick?: any;
  imgId: number | null;
  setClicked: any;
  onChange_IMG: (x: string) => void;
  id: any;
  onCreationFormUpdate: (id: number) => void;
}

export const GetBox: FC<CetBoxProps> = (props: CetBoxProps) => {
  const {  onChange_IMG, id, onCreationFormUpdate, imgId, setClicked } = props;

  return (
    <div className={cn(styles.wrapperImage)}>
      <div className={cn(styles.firstLine)}>
        <img className={cn(styles.selectedImage)} id={IMG[id]} src={IMG[id]} />
      </div>
      <SettingTitle title="Box skin" />
      <div
        className={cn(styles.secondLine)}
        onClick={(e) => {
          onChange_IMG(IMG[id]);
        }}
      >
        <Slider
          clicked={imgId}
          setClicked={setClicked}
          key={id}
          id={id}
          imgs={IMG}
          onChange_IMG={IMG[id]}
          onCreationFormUpdate={onCreationFormUpdate}
        />
      </div>
    </div>
  );
};

const SelectBox: FC<SelectBoxProps> = (props: SelectBoxProps) => {
  const {
    onChange_IMG,
    creationFormId,
    onCreationFormUpdate,
    imgId,
    setClicked,
  } = props;

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle isActive={true} title="Select box" />
      <GetBox
        imgId={imgId}
        setClicked={setClicked}
        onChange_IMG={onChange_IMG}
        id={creationFormId}
        onCreationFormUpdate={onCreationFormUpdate}
      />
  

      <div className={styles.navigation}>
        <Link to="/" className={cn(styles.prevStep)}>
          <LinksStep step="prev" label="Back" />
        </Link>
        <Link to="/box_settings_value" className={cn(styles.nextStep)}>
          <LinksStep step="next" label="Next step" />
        </Link>
      </div>
    </div>
  );
};

export default SelectBox;
