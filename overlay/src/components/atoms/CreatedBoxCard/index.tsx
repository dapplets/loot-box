import React, { FC, ReactNode, useState } from 'react';
import cn from 'classnames';
import styles from './CreatedBoxCard.module.scss';
import { Link } from 'react-router-dom';
import copy from '../../../icons/createNewBox/copy.svg';
export interface CreatedBoxProps {
  label: string;
  // iconCopy: string;
  imageBox: string;
  status: string;
  id: number;
  onClick: () => void;
}

export const CreatedBox: FC<CreatedBoxProps> = (props: CreatedBoxProps) => {
  const { label, imageBox, status, id, onClick } = props;
  return (
    <div className={cn(styles.wrapper)} onClick={onClick}>
      <Link to="/statistics">
        {' '}
        <div className={cn(styles.img)}>
          <img src={imageBox} />
        </div>{' '}
      </Link>
      <div className={cn(styles.description)}>
        <span className={cn(styles.label)}>
          {label}
          <a href="#" className={cn(styles.link)}>
            <span></span>
          </a>
        </span>
        <span className={cn(styles.created)}>{status}</span>
      </div>
    </div>
  );
};
