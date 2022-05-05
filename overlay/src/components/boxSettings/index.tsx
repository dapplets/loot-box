import React, { ReactNode, FC } from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';
import { ButtonsSetting } from './buttonsSetting';
import { Lootbox } from '@loot-box/common/interfaces';
export interface BoxSettingsProps {
  children?: ReactNode;
  onChange?: () => void;
  onSubmit?: () => void;
  dataType?: string;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: any) => void;
}

export const SettingDef: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { creationForm, onCreationFormUpdate } = props;

  return (
    <div className={cn(styles.wrapper)}>
      <ButtonsSetting />
    </div>
  );
};
