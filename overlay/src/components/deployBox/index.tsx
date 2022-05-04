import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  ChangeEvent,
  FormEventHandler,
  ChangeEventHandler,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useMemo,
} from 'react';
import styles from './DeployBox.module.scss';
import cn from 'classnames';

import { SettingTitle } from '../atoms/SettingTitle';
import { LabelSettings } from '../atoms/LabelSettings';
import { InputPanel } from '../atoms/Input';
import { Message } from '../atoms/Message';
import { TextArea } from '../atoms/TextArea';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Lootbox } from '@loot-box/common/interfaces';

export interface DeployBoxProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: any;
  winInfo: string;
}

export const DeployBox: FC<DeployBoxProps> = (props: DeployBoxProps) => {
  const { id, winInfo } = props;
  const [valueMessage, setValueMessage] = useState('');
  const [valueName, setValueName] = useState('');
  const [lootboxes, setLootboxes] = useState<Lootbox[]>([]);
  const [selectedLootboxId, setSelectedLootboxId] = useState<number | null>(null);

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Deploy your box" isActive />
      <div className={cn(styles.message)}>
        <Message
          message={`We are holding the ${winInfo}  #Giveaway. Click on the lootbox picture and get your prize!`}
          link={`https://ltbx.app/${id}/`}
          instruction="Don’t see the Box? Install this dapp: https://ltbx.app/how-to/"
          project="The gift box is made with the LootBox Dapplet @lootboxdapp by @dappletsproject"
        />
      </div>

      <div className={cn(styles.navigation)}>
        <Link to="/" className={cn(styles.link)}>
          Done
        </Link>
      </div>
    </div>
  );
};
