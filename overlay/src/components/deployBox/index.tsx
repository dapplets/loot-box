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
} from 'react';

import { SettingTitle } from '../atoms/SettingTitle';
import styles from './DeployBox.module.scss';
import { LabelSettings } from '../atoms/LabelSettings';
import { InputPanel, InputProps } from '../atoms/Input';
import { Message } from '../atoms/Message';
import { TextArea } from '../atoms/TextArea';
import cn from 'classnames';
import { Link } from 'react-router-dom';

export interface DeployBoxProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  // onChange_input: () => void;
  onAddChild: () => void;
}

export const DeployBox: FC<DeployBoxProps> = (props: DeployBoxProps) => {
  const { onChange, onAddChild } = props;
  const [value, setValue] = useState('');
  const onChange_Area: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Deploy your box" isActive />
      <div className={cn(styles.boxName)}>
        <LabelSettings title="Box name" />
        <InputPanel onChange={onChange} type="text" appearance="big" />
      </div>

      <div className={cn(styles.textArea)}>
        <LabelSettings title="Box Message" />
        <TextArea onChange={onChange_Area} placeholder="Write here a message for your followers " />
      </div>
      <div className={cn(styles.message)}>
        <Message
          message={value}
          link="https://lootbox.org/AfB8ad/
        Don’t see the Box? https://lootbox.org/how-to/"
          instruction="Gift box is made with LootBox Dapplet @lootbox by @dappletsproject."
        />
      </div>

      <div className={cn(styles.navigation)}>
        <Link to="/" className={cn(styles.link)} onClick={onAddChild}>
          Done
        </Link>
      </div>
    </div>
  );
};
