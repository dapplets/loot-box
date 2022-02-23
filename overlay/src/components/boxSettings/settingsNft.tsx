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

import { useToggle } from '../../hooks/useToggle';
import { InputPanel } from '../atoms/Input';
import { RadioButton } from '../atoms/RadioButton';
// import { Test } from '../atoms/test';
import { DropChance } from '../atoms/DropChance';
import { Lootbox, NftContentItem } from '../../../../common/interfaces';

import { ChildComponent } from './childComponent';

export interface BoxSettingsProps {
  children?: ReactNode;
  onChange?: () => void;
  onSubmit?: () => void;
  dataType?: string;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: any) => void;
}

const DEFAULT_NFT_ITEM: NftContentItem = {
  contractAddress: 'custom.near',
  quantity: null,
  tokenId: null,
};

export const SettingsNFT: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { creationForm, onCreationFormUpdate } = props;
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    // ToDo: move to App.tsx
    // ToDo: how to get rid of object coping?
    const newForm = Object.assign({}, creationForm);
    newForm.nftContentItems = [DEFAULT_NFT_ITEM];
    newForm.nearContentItems = [];
    newForm.ftContentItems = [];
    onCreationFormUpdate(newForm);
  }, []);

  const addButtonClickHandler = () => {
    const newForm = Object.assign({}, creationForm);
    newForm.nftContentItems.push(DEFAULT_NFT_ITEM);
    onCreationFormUpdate(newForm);
  };

  const onDeleteChild = (id: number) => {
    const newForm = Object.assign({}, creationForm);
    newForm.nftContentItems.splice(id, 1);
    onCreationFormUpdate(newForm);
  };

  const onFormChange = (prop: string, type: string): ChangeEventHandler<HTMLInputElement> => (
    e,
  ) => {
    if (type === 'number') {
      (creationForm as any)[prop] = Number(e.target.value);
    } else {
      (creationForm as any)[prop] = e.target.value;
    }
    onCreationFormUpdate(creationForm);
  };

  const nftUpdatedHandler = (id: number, nft: NftContentItem) => {
    const newForm = Object.assign({}, creationForm);
    newForm.nftContentItems[id] = nft;
    onCreationFormUpdate(newForm);
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle isActive={true} title="Box settings" />

      {/* ToDo: move to separated component */}
      <div className={styles.div}>
        <div className={cn(styles.loot)}>
          <LabelSettings title="Loot" />
          <div className={cn(styles.buttons)}>
            <Link to="/settings_token" className={styles.btnLink}>
              <Button appearance="medium" isShowDescription btnText="Token" />
            </Link>
            <Link to="/settings_NFT" className={styles.btnLink}>
              <Button
                appearance="medium"
                isShowDescription
                btnText="NFT"
                style={{
                  backgroundColor: '#D9304F',
                  color: '#fff',
                }}
              />
            </Link>
          </div>
        </div>

        <div className={styles.wrapper_nft}>
          <div className={styles.Marketplace}>
            {creationForm.nftContentItems.map((x, i) => (
              <ChildComponent
                key={i}
                nftItem={x}
                onDeleteChild={
                  creationForm.nftContentItems.length > 1 ? onDeleteChild.bind(null, i) : undefined
                }
                onNftUpdated={nftUpdatedHandler.bind(null, i)}
              />
            ))}
            <div className={styles.addNFTBtn}>
              <Button onClick={addButtonClickHandler} btnText="Add NFT" appearance="small" />
            </div>

            <div className={styles.dropChance_nft}>
              <LabelSettings title="Drop Chance" />
              <DropChance
                type="string"
                max="100"
                min="0"
                onChange={onFormChange('dropChance', 'number')}
                value={creationForm.dropChance + `%`}
                pattern="^\d{1,2}|100$"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={cn(styles.navigation)}>
        <Link to="/select_box">
          <LinksStep step="prev" label="Back" />
        </Link>
        <Link to="/fill_your_box_nft">
          <LinksStep disabled={true} step="next" label="Next step" />
        </Link>
      </div>
    </div>
  );
};
