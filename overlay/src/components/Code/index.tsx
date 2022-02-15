import React, { FC, useState } from 'react';
import styles from './Code.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { LabelSettings } from '../atoms/LabelSettings';
import { StatisticsLink } from '../atoms/StatisticsLink';
import { useToggle } from '../../hooks/useToggle';
import { InputPanel } from '../atoms/Input';
import { TextArea } from '../atoms/TextArea';
import { Message } from '../atoms/Message';
import { Lootbox } from '../../../../common/interfaces';

export interface CodeProps {
  onChange?: () => void;
  onSubmit?: () => void;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: Lootbox) => void;
}
export const Code: FC<CodeProps> = (props: CodeProps) => {
  const { creationForm, onCreationFormUpdate } = props;
  const [value, setValue] = useState('');
  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.code)}>
        <div className={styles.boxName}>
          <LabelSettings title="Box name" />
          <InputPanel
            // creationForm={creationForm}
            // onCreationFormUpdate={onCreationFormUpdate}
            type="text"
            appearance="biggest"
          />
        </div>
        <div className={styles.boxMessage}>
          <LabelSettings title="Box Message" />
          <TextArea onChange={onChange} placeholder="Write here a message for your followers " />
        </div>
        <div className={styles.lootboxCode}>
          <Message
            message={value}
            link="https://lootbox.org/AfB8ad/
Don’t see the Box?  https://lootbox.org/how-to/"
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
