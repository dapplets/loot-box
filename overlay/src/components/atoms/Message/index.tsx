import React, { CSSProperties, ReactElement, ReactNode, FC, useState, useEffect } from 'react';
import cn from 'classnames';
import styles from './Message.module.scss';
import { LabelSettings } from '../LabelSettings';

import useCopied from '../../../hooks/useCopyed';
export interface MessageProps {
  message: any;
  link: string;
  instruction: string;
}

export const Message: FC<MessageProps> = (props: MessageProps) => {
  const { message, link, instruction } = props;
  const [copied, copy, setCopied] = useCopied(`${message} ${link} ${instruction}`);

  const copyText = () => {
    copy();
  };
  useEffect(() => {}, [copyText]);
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.lootboxCode)}>
        <LabelSettings title="LOOTBOX CODE" />
        <div className={cn(styles.message)}>
          <div className={cn(styles.messageBlock)}>
            <p className={cn(styles.messageInput)}>{message}</p>
            <p className={cn(styles.link)}>{link}</p>
            <p className={cn(styles.instruction)}>{instruction}</p>
          </div>
          {copied ? (
            <button className={cn(styles.buttonGoogCopy)}></button>
          ) : (
            <button className={cn(styles.button)} onClick={copyText}></button>
          )}
        </div>
      </div>
    </div>
  );
};
