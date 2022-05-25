import React, { FC, useState, useMemo, useEffect } from 'react';
import styles from './Code.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import { StatisticsLink } from '../atoms/StatisticsLink';
import { Lootbox } from '@loot-box/common/interfaces';
import { Message } from '../atoms/Message';

export interface CodeProps {
  onChange?: () => void;
  onSubmit?: () => void;
  id: any;
  winInfo: any;
  landingUrl: string;
}

export const Code: FC<CodeProps> = (props: CodeProps) => {
  const { id, winInfo, landingUrl } = props;
  // console.log(winInfo);
  // useEffect(() => {}, [winInfo]);
  // console.log(winInfo, 'Code');

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.code)}>
        <div className={styles.lootboxCode}>
          <Message
            message={`We are holding a ${winInfo} #Giveaway. Click on the lootbox picture and get your prize!`}
            link={`${landingUrl}/${id}/`}
            instruction={`Don’t see the Box? Install this dapp: ${landingUrl}/how-to/`}
            project="The gift box is made with the LootBox Dapplet @lootboxdapp by @dappletsproject"
          />
        </div>
      </div>
      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink
          // label="Done"
          />
        </Link>
      </div>
    </div>
  );
};
