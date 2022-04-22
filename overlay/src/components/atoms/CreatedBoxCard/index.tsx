import React, { FC, ReactNode, useState, useEffect } from 'react';
import cn from 'classnames';
import styles from './CreatedBoxCard.module.scss';
import { Link } from 'react-router-dom';
import copy from '../../../icons/createNewBox/copy.svg';

import useCopied from '../../../hooks/useCopyed';

export interface CreatedBoxProps {
  label: string;
  // iconCopy: string;
  imageBox: string;
  status: string;
  id: number;
  onClick: () => void;
  WinInfo?: any;
}

export const CreatedBox: FC<CreatedBoxProps> = (props: CreatedBoxProps) => {
  const { label, imageBox, status, id, onClick, WinInfo } = props;
  const [copied, copy, setCopied] = useCopied(`${label}`);
  const visible = (hash: string): string => {
    const firstFourCharacters = hash.substring(0, 6);
    const lastFourCharacters = hash.substring(hash.length - 1, hash.length - 5);

    return `${firstFourCharacters}...${lastFourCharacters}`;
  };

  const copyText = () => {
    copy();

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={cn(styles.wrapper)} onClick={onClick}>
      <Link to="/statistics">
        <div className={cn(styles.img)}>
          <img src={imageBox} />
          {(WinInfo && WinInfo !== '') ? <span className={styles.winInfo}> {WinInfo}</span> : null}
        </div>
      </Link>
      <div className={cn(styles.description)}>
        <span className={cn(styles.Blocklink)}>
          <span className={cn(styles.label)}>{label}</span>
          {copied ? (
            <button className={cn(styles.linkGood)}>
              <span></span>
            </button>
          ) : (
            <button className={cn(styles.link)} onClick={copyText}>
              <span></span>
            </button>
          )}
          {/* <a href="#" className={cn(styles.link)}>
            <span></span>
          </a> */}
        </span>
        <span className={cn(styles.created)}>{status}</span>
      </div>
    </div>
  );
};
