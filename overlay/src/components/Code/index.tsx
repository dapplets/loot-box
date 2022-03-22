import React, { FC, useState, useMemo } from 'react';
import styles from './Code.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { LabelSettings } from '../atoms/LabelSettings';
import { StatisticsLink } from '../atoms/StatisticsLink';

import { Message } from '../atoms/Message';

export interface CodeProps {
  onChange?: () => void;
  onSubmit?: () => void;
  id: any;
}

export const Code: FC<CodeProps> = (props: CodeProps) => {
  const { id } = props;

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.code)}>
        <div className={styles.lootboxCode}>
          <Message
            message={'message'}
            link={`https://lootbox.org/${id}/ Don’t see the Box?  https://lootbox.org/how-to/`}
            instruction="Gift box is made with LootBox Dapplet @lootbox by @dappletsproject. "
          />
        </div>
      </div>
      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink label="Done" />
        </Link>
      </div>
    </div>
  );
};
