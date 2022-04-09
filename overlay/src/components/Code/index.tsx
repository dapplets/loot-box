import React, { FC, useState, useMemo } from 'react';
import styles from './Code.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { LabelSettings } from '../atoms/LabelSettings';
import { StatisticsLink } from '../atoms/StatisticsLink';
import { Lootbox } from '../../../../common/interfaces';
import { Message } from '../atoms/Message';

export interface CodeProps {
  onChange?: () => void;
  onSubmit?: () => void;
  id: any;
  winInfo: any;
}

export const Code: FC<CodeProps> = (props: CodeProps) => {
  const { id, winInfo } = props;
  const [infoWin, setInfoWin] = useState<Lootbox[]>([]);

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.code)}>
        <div className={styles.lootboxCode}>
          <Message
            message={`We are holding the ${winInfo} #Giveaway. Click on the lootbox picture and get your prize!`}
            link={`https://ltbx.app/${id}/`}
            instruction="Don’t see the Box? Install this dapp: https://ltbx.app/how-to/"
            project="The gift box is made with the LootBox Dapplet @lootboxdapp by @dappletsproject"
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
