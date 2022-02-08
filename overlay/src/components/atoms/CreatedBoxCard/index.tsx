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
}

export const CreatedBox: FC<CreatedBoxProps> = (props: CreatedBoxProps) => {
  const { label, imageBox, status, id } = props;
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.img)}>
        <img src={imageBox} />
      </div>
      <div className={cn(styles.description)}>
        <span className={cn(styles.label)}>
          {label}
          <a href="#" className={cn(styles.link)}>
            <span></span>
          </a>
        </span>

        <Link to="/statistics" className={cn(styles.created)}>
          {status}
        </Link>
      </div>
    </div>
  );
};
