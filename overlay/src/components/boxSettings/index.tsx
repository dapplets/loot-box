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
  // const changeHandler = () => {
  //   onCreationFormUpdate((creationForm.ftContentItems = []));
  //   onCreationFormUpdate((creationForm.nearContentItems = []));
  //   onCreationFormUpdate((creationForm.nftContentItems = []));
  //   // creationForm.ftContentItems = [];
  //   // creationForm.nearContentItems = [];
  //   // creationForm.nftContentItems = [];
  // };
  return (
    <div className={cn(styles.wrapper)}>
      <ButtonsSetting />
    </div>
  );
};
