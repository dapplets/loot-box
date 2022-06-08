import React, { ReactNode, FC, useEffect, useMemo, useState, useRef } from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';

import { LabelSettings } from '../atoms/LabelSettings';
import { Button } from '../atoms/Button';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import { DropChance } from '../atoms/DropChance';
import { Lootbox, NftContentItem } from '@loot-box/common/interfaces';
import { ChildComponent } from './childComponent';
import './invalid.scss';

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
  tokenId: '',
};

export const SettingsNFT: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { creationForm, onCreationFormUpdate } = props;
  const [link, onLink] = useState(true);
  // const node = useRef<HTMLInputElement>();
  const [value, setValue] = useState(creationForm.dropChance);
  // const [nameClassInput, setNameClassInput] = useState('');

  const nodeNftContract = useRef<HTMLInputElement>();
  const nodeQuanity = useRef<HTMLInputElement>();
  const nodeDropChance = useRef<HTMLInputElement>();

  const newForm = Object.assign({}, creationForm);

  const booleanNodeNftContract = nodeNftContract.current?.classList.contains('invalid');
  const booleanNodeQuanity = nodeQuanity.current?.classList.contains('invalid');
  const LinkBlock = useMemo(() => {
    if (
      creationForm.nftContentItems.length !== 0 &&
      booleanNodeNftContract != true &&
      booleanNodeQuanity != true
    ) {
      if (
        creationForm.nftContentItems[0] &&
        creationForm.nftContentItems[0].tokenId.length >= 1 &&
        creationForm.nftContentItems[0].tokenId !== null &&
        creationForm.nftContentItems[0].contractAddress.length >= 1 &&
        creationForm.nftContentItems[0].contractAddress !== null
      ) {
        onLink(false);
      } else {
        onLink(true);
      }
    } else {
      onLink(true);
    }
    if (
      value <100
    ) {
      nodeDropChance.current?.classList.remove('invalid');
    
    } else {
      nodeDropChance.current?.classList.add('invalid');
      
    }
  }, [creationForm, link, nodeNftContract, nodeQuanity, DEFAULT_NFT_ITEM,value,nodeDropChance]);

  useEffect(() => {
    creationForm.dropChance = value;
    onCreationFormUpdate(creationForm);
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

  const handleClick = () => {
    if (nodeNftContract && nodeNftContract.current && nodeQuanity && nodeQuanity.current) {
    }
  };

  useEffect(() => {
    // ToDo: move to App.tsx
    // ToDo: how to get rid of object coping?
    DEFAULT_NFT_ITEM.contractAddress = '';
    DEFAULT_NFT_ITEM.tokenId = '';

    const newForm = Object.assign({}, creationForm);
    creationForm.nftContentItems = [];
    newForm.nftContentItems = [DEFAULT_NFT_ITEM];

    creationForm.nearContentItems = [];
    creationForm.ftContentItems = [];
    newForm.dropChance = value;
    onCreationFormUpdate(creationForm);
    onCreationFormUpdate(newForm);
  }, []);
  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.div}>
        <div className={styles.divBtn}>
          <ButtonsSetting
            classNameNft={styles.BtnNft}
            onClick={() => {
              creationForm.nftContentItems[0].tokenId = '';
            }}
          />
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
                nodeNftContract={nodeNftContract}
                nodeQuanity={nodeQuanity}
              />
            ))}
            <div className={styles.addNFTBtn}>
              <Button onClick={addButtonClickHandler} btnText="Add NFT" appearance="small" />
            </div>

            <div className={styles.dropChance_nft}>
              <LabelSettings
                title="Drop Chance"
                isActive
                support="The chance a person has to get the drop. 

                Please enter the amount in percentage"
              />

              <DropChance
                type="string"
                maxValueDropChance="100"
                innerRef={nodeDropChance}
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
        {(link && <div></div>) || value <100 && nodeNftContract.current?.value
        !=''&& nodeQuanity.current?.value
        !=''&&(
          <Link
            to="/fill_your_box_nft"
            onClick={() => {
              handleClick();

              creationForm.ftContentItems = [];
              creationForm.nearContentItems = [];
            }}
          >
            <LinksStep disabled={true} step="next" label="Next step" />
          </Link>
        )}
      </div>
    </div>
  );
};
