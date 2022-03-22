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
import { Lootbox } from '../../../../common/interfaces';

export interface DeployBoxProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: any;
}

export const DeployBox: FC<DeployBoxProps> = (props: DeployBoxProps) => {
  const { id } = props;
  const [valueMessage, setValueMessage] = useState('');
  const [valueName, setValueName] = useState('');
  const [lootboxes, setLootboxes] = useState<Lootbox[]>([]);

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Deploy your box" isActive />
      <div className={cn(styles.message)}>
        <Message
          message={`message`}
          link={`https://lootbox.org/${id}/
          Don’t see the Box? https://lootbox.org/how-to/`}
          instruction="Gift box is made with LootBox Dapplet @lootbox by @dappletsproject."
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
