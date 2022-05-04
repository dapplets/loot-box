import React, { FC, ReactNode, useState, useMemo, useEffect } from 'react';
import cn from 'classnames';

import styles from './CreateNewBox.module.scss';
import { Button } from '../atoms/Button';
import { CreatedBox } from '../atoms/CreatedBoxCard';
import { Link } from 'react-router-dom';
import { useToggle } from '../../hooks/useToggle';
import { Preloader } from '../atoms/Preloader';

import { Lootbox } from '@loot-box/common/interfaces';
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
  id: string;
  creationForm: Lootbox;
  status: string;
  winInfo: any;
  loader: boolean;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const { number, label, imgVal, onClick, creationForm, winInfo, status, loader } = props;

  const [winAmount, setWinAmount] = useState('');
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    if (winInfo.ftContentItems.length !== 0) {
      winInfo.ftContentItems.map((x: any) => setWinAmount(`${x.tokenAmount} TOKEN`));
    } else if (winInfo.nearContentItems.length !== 0) {
      winInfo.nearContentItems.map((x: any) => setWinAmount(`${x.tokenAmount} NEAR`));
    } else if (winInfo.nftContentItems.length !== 0) {
      const winNft = String(winInfo.nftContentItems.length) + ` NFT`;
      setWinAmount(winNft);
    }
    setLoad(false);
  });

  return (
    <>
      {load ? (
        <Preloader />
      ) : (
        <CreatedBox
          id={number}
          label={label}
          imageBox={imgVal}
          status={status}
          onClick={onClick}
          WinInfo={winAmount}
          loader={loader}
        />
      )}
    </>
  );
};
