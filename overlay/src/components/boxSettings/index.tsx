import React, { ReactNode, FC } from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';
import { ButtonsSetting } from './buttonsSetting';
export interface BoxSettingsProps {
  children?: ReactNode;
  onChange?: () => void;
  onSubmit?: () => void;
  dataType?: string;
}

export const SettingDef: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  return (
    <div className={cn(styles.wrapper)}>
      <ButtonsSetting />
    </div>
  );
};
