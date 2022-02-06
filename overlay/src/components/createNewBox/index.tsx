import React, { FC, ReactNode, useState } from 'react';
import cn from 'classnames';
import copy from '../../icons/createNewBox/copy.svg';
import Box1 from '../../icons/createNewBox/box1.png';
import Box2 from '../../icons/createNewBox/box2.png';
import Box3 from '../../icons/createNewBox/box3.png';
import Box4 from '../../icons/createNewBox/box4.png';
import styles from './CreateNewBox.module.scss';
import { Button } from '../atoms/Button';
import { CreatedBox } from '../atoms/CreatedBoxCard';
import { Link } from 'react-router-dom';
import { useToggle } from '../../hooks/useToggle';
import SelectBox from '../selectBox';
import { labels } from '../Statistics';
export interface CreateNewBoxProps {
  children: ReactNode;
  label: string;
  imgVal: string;
}

export const CreateNewBox: FC<CreateNewBoxProps> = (props: CreateNewBoxProps) => {
  const { label, imgVal, children } = props;

  const [isShowDescription, onShowDescription] = useToggle(false);
  return (
    <div className={cn(styles.wrapper)}>
      <Link to="/select_box" className={cn(styles.firstLine)}>
        <Button
          isShowDescription={isShowDescription}
          appearance="big"
          color="active"
          btnText="Create new box"
        />
      </Link>
      <div className={cn(styles.secondLine)}>{children}</div>
    </div>
  );
};
export default CreateNewBox;

export interface ChildComponentProps {
  number: number;
  label: string;
  imgVal: string;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const { number, label, imgVal } = props;
  return <CreatedBox id={number} label={label} imageBox={imgVal} status="Created" />;
};
