import React, { CSSProperties, ReactElement, ReactNode, FC, useState, useEffect } from 'react';
import cn from 'classnames';
import styles from './Message.module.scss';
import { LabelSettings } from '../LabelSettings';

import useCopied from '../../../hooks/useCopyed';
export interface MessageProps {
  message?: any;
  link: string;
  instruction?: string;
  project?: string;
}

export const Message: FC<MessageProps> = (props: MessageProps) => {
  const { message, link, instruction, project } = props;
  const [copied, copy, setCopied] = useCopied(
    `${message}
${link}
${instruction}
${project}`,
  );

  const copyText = () => {
    copy();

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  // useEffect(() => {}, [copyText]);
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.lootboxCode)}>
        <LabelSettings
          title="LOOTBOX CODE"
          support="Copy this Lootbox code and paste it to any Twitter post. 

All users with the dapplet installed will see the lootbox picture with the drop amount.

Users without the dapplet installed will see the teaser message and the links to the lootbox web page and intallation manual"
          isActive
        />
        <div className={cn(styles.message)}>
          <div className={cn(styles.messageBlock)}>
            <p className={cn(styles.messageInput)}>{message}</p>
            <p className={cn(styles.link)}>{link}</p>
            <p className={cn(styles.instruction)}>{instruction}</p>
            <p className={cn(styles.progect)}>{project}</p>
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
