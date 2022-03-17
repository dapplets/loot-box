import React, { ReactNode, FC } from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';
import { SettingTitle } from '../atoms/SettingTitle';
import { LabelSettings } from '../atoms/LabelSettings';
import { Button } from '../atoms/Button';
import { Link } from 'react-router-dom';

export interface BoxSettingsProps {
  children?: ReactNode;
  onChange?: () => void;
  onSubmit?: () => void;
  dataType?: string;
  classNameNft?: string;
  classNameToken?: string;
  // creationForm: Lootbox;
  // onCreationFormUpdate: (x: any) => void;
}
export const ButtonsSetting: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { classNameNft, classNameToken } = props;

  return (
    <div className={cn(styles.wrapperBtn)}>
      <SettingTitle isActive={true} title="Box settings" />
      <div className={styles.div}>
        <div className={cn(styles.loot)}>
          <LabelSettings title="Loot" />
          <div className={cn(styles.buttons)}>
            <Link to="/settings_token" className={styles.btnLink}>
              <Button
                appearance="medium"
                className={classNameToken}
                isShowDescription
                btnText="Token"
              />
            </Link>
            <Link to="/settings_NFT" className={styles.btnLink}>
              <Button
                appearance="medium"
                className={classNameNft}
                isShowDescription
                btnText="NFT"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
