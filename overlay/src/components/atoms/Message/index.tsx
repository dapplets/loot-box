import React, { CSSProperties, ReactElement, ReactNode, FC, useState } from 'react';
import cn from 'classnames';
import styles from './Message.module.scss';
import { LabelSettings } from '../LabelSettings';

export interface MessageProps {
  message: any;
  link: string;
  instruction: string;
}

export const Message: FC<MessageProps> = (props: MessageProps) => {
  const { message, link, instruction } = props;
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
          <button className={cn(styles.button)}></button>
        </div>
      </div>
    </div>
  );
};
