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

export interface DeployBoxProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  setCreationMessageData: (x: any) => void;
  MessageData: any;
  id: any;
}

export const DeployBox: FC<DeployBoxProps> = (props: DeployBoxProps) => {
  const { onChange, setCreationMessageData, id, MessageData } = props;
  const [value, setValue] = useState('');
  const onChange_Area: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { name, value } = e.currentTarget;
    setValue(e.target.value);

    MessageData.boxMessage = value;
    console.log(MessageData.boxMessage);

    setCreationMessageData(MessageData);
  };

  const onChange_name: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const { name, value } = event.currentTarget;
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Deploy your box" isActive />
      <div className={cn(styles.boxName)}>
        <LabelSettings title="Box name" />
        <InputPanel onChange={onChange_name} type="text" appearance="biggest" />
      </div>

      <div className={cn(styles.textArea)}>
        <LabelSettings title="Box Message" />
        <TextArea onChange={onChange_Area} placeholder="Write here a message for your followers " />
      </div>
      <div className={cn(styles.message)}>
        <Message
          message={value}
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
