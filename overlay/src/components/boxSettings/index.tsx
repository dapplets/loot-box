import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  ChangeEventHandler,
  useMemo,
  useEffect,
} from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';
import { SettingTitle } from '../atoms/SettingTitle';
import { LabelSettings } from '../atoms/LabelSettings';
import { Button } from '../atoms/Button';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import NextStep from '../../icons/selectBox/NextStep.svg';
import PrevStep from '../../icons/selectBox/prevStep.svg';
import { useToggle } from '../../hooks/useToggle';
import { InputPanel } from '../atoms/Input';
import { RadioButton } from '../atoms/RadioButton';
// import { Test } from '../atoms/test';
import { DropChance } from '../atoms/DropChance';
import { Lootbox } from '../../../../common/interfaces';
import { Item } from 'semantic-ui-react';
import { info } from 'console';

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
      <SettingTitle isActive={true} title="Box settings" />
      <div className={styles.div}>
        <div className={cn(styles.loot)}>
          <LabelSettings title="Loot" />
          <div className={cn(styles.buttons)}>
            <Link to="/settings_token" className={styles.btnLink}>
              <Button
                appearance="medium"
                isShowDescription
                btnText="Token"
                // onClick={UpdateFormNft}
              />
            </Link>
            <Link to="/settings_NFT" className={styles.btnLink}>
              <Button
                appearance="medium"
                isShowDescription
                btnText="NFT"
                // onClick={UpdateFormNear}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
