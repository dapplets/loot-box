import React, { ReactNode, FC, useEffect, useMemo } from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';

import { SettingTitle } from '../atoms/SettingTitle';
import { LabelSettings } from '../atoms/LabelSettings';
import { Button } from '../atoms/Button';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import { DropChance } from '../atoms/DropChance';
import { Lootbox, NftContentItem } from '../../../../common/interfaces';
import { ChildComponent } from './childComponent';

import { ButtonsSetting } from './buttonsSetting';
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

  const [value, setValue] = React.useState(20);
  useEffect(() => {
    // ToDo: move to App.tsx
    // ToDo: how to get rid of object coping?
    const newForm = Object.assign({}, creationForm);
    newForm.nftContentItems = [DEFAULT_NFT_ITEM];
    creationForm.nearContentItems = [];
    creationForm.ftContentItems = [];
    newForm.dropChance = value;
    onCreationFormUpdate(creationForm);
    onCreationFormUpdate(newForm);

    console.log(creationForm);
  }, []);
  // const memoizedValue = useMemo(() => {
  //   onCreationFormUpdate(creationForm);
  // }, []);
  useEffect(() => {
    creationForm.dropChance = value;
    onCreationFormUpdate(creationForm);
    console.log({ value });
  });

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

  const nftUpdatedHandler = (id: number, nft: NftContentItem) => {
    const newForm = Object.assign({}, creationForm);
    newForm.nftContentItems[id] = nft;
    onCreationFormUpdate(newForm);
  };

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.div}>
        <div className={styles.divBtn}>
          <ButtonsSetting classNameNft={styles.BtnNft} />
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
                maxValueDropChance="100"
                minValueDropChance="0"
                valueDropChance={`${value}`}
                onValueDropChance={(newValue: any) => setValue(+newValue)}
                valueButtonDropChance={value}
                setValueButtonDropChance={setValue}
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
