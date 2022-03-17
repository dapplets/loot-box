import React, { FC, useState, useMemo } from 'react';
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
import { MessageData } from '../../App';

export interface CodeProps {
  onChange?: () => void;
  onSubmit?: () => void;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: Lootbox) => void;
  NameContentItem?: Lootbox;
  onNameUpdated: (x: Lootbox) => void;
  setCreationMessageData: (x: any) => void;
  MessageData: any;
  onMessageUpdated: (x: any) => void;
  // --
  _value: any;
  _onValueChange: any;
  value: any;
  setValue: any;

  // ==
  _valueName: any;
  _onValueChangeName: any;
  valueName: any;
  setValueName: any;
}
export const Code: FC<CodeProps> = (props: CodeProps) => {
  const {
    creationForm,
    onCreationFormUpdate,
    NameContentItem,
    onNameUpdated,
    setCreationMessageData,
    MessageData,
    onMessageUpdated,
    // --
    _value,
    _onValueChange = () => {},
    value,
    setValue,

    // ==
    _valueName,
    _onValueChangeName,
    valueName,
    setValueName,
  } = props;

  const valueToShow = useMemo(
    () => () => {
      _value;
    },
    [_value],
  );

  const valueToShowName = useMemo(
    () => () => {
      _valueName;
    },
    [_valueName],
  );

  console.log(MessageData);

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.code)}>
        <div className={styles.boxName}>
          <LabelSettings title="Box name" />

          <InputPanel
            value={_valueName}
            onChange={(e: any) => {
              e.stopPropagation();
              const { data, inputType } = e.nativeEvent;
              console.log({ data, inputType, e });
              switch (inputType) {
                case 'insertText':
                  if (data !== null && data !== undefined) {
                    const newValue = _valueName === ' ' ? data : _valueName + data;

                    _onValueChangeName(newValue);
                  }
                  break;
                case 'deleteContentBackward':
                  const newValue = _valueName.slice(0, -1);
                  if (newValue.length === 0) _onValueChangeName('');
                  else _onValueChangeName(newValue);
                  break;

                default:
                  break;
              }
            }}
            type="text"
            appearance="biggest"
          />
        </div>
        <div className={styles.boxMessage}>
          <LabelSettings title="Box Message" />

          <TextArea
            onChange={(e: any) => {
              const { data, inputType } = e.nativeEvent;
              console.log({ data, inputType, e });
              switch (inputType) {
                case 'insertText':
                  if (data !== null && data !== undefined) {
                    const newValue = _value === ' ' ? data : _value + data;

                    _onValueChange(newValue);
                  }
                  break;
                case 'deleteContentBackward':
                  const newValue = _value.slice(0, -1);
                  if (newValue.length === 0) _onValueChange('');
                  else _onValueChange(newValue);
                  break;

                default:
                  break;
              }
            }}
            value={_value}
            placeholder="Write here a message for your followers "
          />
        </div>
        <div className={styles.lootboxCode}>
          <Message
            message={value}
            link={`https://lootbox.org/${creationForm.id}/
Don’t see the Box?  https://lootbox.org/how-to/`}
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
