import React, { FC, ReactNode, useState, useMemo, useEffect } from 'react';
import cn from 'classnames';

// import blueBox from '../../icons/createNewBox/blue_box.png';
// import redBox from '../../icons/createNewBox/red_box.png';
// import safe from '../../icons/createNewBox/safe.png';
// import box from '../../icons/createNewBox/box.png';
// import bag from '../../icons/createNewBox/bag.png';
// import pinata from '../../icons/createNewBox/pinata.png';
// import pig from '../../icons/createNewBox/pig.png';

import styles from './CreateNewBox.module.scss';
import { Button } from '../atoms/Button';
import { CreatedBox } from '../atoms/CreatedBoxCard';
import { Link } from 'react-router-dom';
import { useToggle } from '../../hooks/useToggle';

import { Lootbox } from '../../../../common/interfaces';
export interface CreateNewBoxProps {
  children: ReactNode;
  label: string;
  imgVal: string;
  winInfo: any;
}

export const CreateNewBox: FC<CreateNewBoxProps> = (props: CreateNewBoxProps) => {
  const { label, imgVal, children, winInfo } = props;

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
  onClick: () => void;
  id: number;
  creationForm: Lootbox;
  status: string;
  winInfo: any;
  // setWinInfo: (x: string) => void;
  // getWin: any;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const { number, label, imgVal, onClick, creationForm, winInfo } = props;

  const [winAmount, setWinAmount] = useState('');
  // useEffect(() => {
  //   if (
  //     // winInfo.ftContentItems.tokenAmount !== undefined &&
  //     +winInfo.ftContentItems[0].tokenAmount !== 0
  //   ) {
  //     setWinAmount(winInfo.ftContentItems[0].tokenAmount + `  TOKEN`);
  //   } else if (
  //     // winInfo.nearContentItems.tokenAmount !== undefined &&
  //     +winInfo.nearContentItems[0].tokenAmount !== 0
  //   ) {
  //     setWinAmount(winInfo.nearContentItems[0].tokenAmount + ` NEAR`);
  //   } else {
  //     setWinAmount(`${winInfo.nftContentItems.length}  NFT`);
  //   }
  // }, []);

  // console.log(+winInfo.nearContentItems[0].tokenAmount);
  // console.log(+winInfo.ftContentItems[0].tokenAmount);
  // console.log(winInfo.nftContentItems.length + `  NFT`);

  return (
    <CreatedBox
      id={number}
      label={label}
      imageBox={imgVal}
      status="Created"
      onClick={onClick}
      WinInfo={winInfo}
    />
  );
};
