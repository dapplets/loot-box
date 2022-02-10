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
import { Lootbox } from '../../../../common/interfaces';

export interface DeployBoxProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  // onChange_input: () => void;
  // onAddChild: () => void;
  onDoneClick: () => void;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: Lootbox) => void;
}

export const DeployBox: FC<DeployBoxProps> = (props: DeployBoxProps) => {
  const { onChange, onDoneClick, creationForm, onCreationFormUpdate } = props;
  const [value, setValue] = useState('');
  const onChange_Area: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };
  const name = creationForm.name;
  //   const onSetId: ChangeEventHandler<HTMLInputElement> = (event) => {
  //  creationForm.name = event.target;
  //     onCreationFormUpdate(creationForm);
  //   };
  // console.log(name);
  const onSetName = (x: string) => {
    creationForm.name = x;
    onCreationFormUpdate(creationForm);
  };

  const onChange_name: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const { name, value } = event.currentTarget;

    creationForm.name = value;

    console.log(value);

    onCreationFormUpdate(creationForm);
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Deploy your box" isActive />
      <div className={cn(styles.boxName)}>
        <LabelSettings title="Box name" />
        <InputPanel
          creationForm={creationForm}
          onCreationFormUpdate={onCreationFormUpdate}
          onChange={onChange_name}
          type="text"
          appearance="biggest"
        />
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
        <Link to="/" className={cn(styles.link)} onClick={onDoneClick}>
          Done
        </Link>
      </div>
    </div>
  );
};
