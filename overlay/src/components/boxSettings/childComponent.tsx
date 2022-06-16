import React, { FC, useState } from 'react';
import styles from './BoxSettings.module.scss';

import { LabelSettings } from '../atoms/LabelSettings';
import { Button } from '../atoms/Button';
import { InputPanel } from '../atoms/Input';
import { RadioButton } from '../atoms/RadioButton';
import { NftContentItem } from '@loot-box/common/interfaces';
import './invalid.scss';
export interface ChildComponentProps {
  onDeleteChild?: () => void;
  nftItem: NftContentItem;
  onNftUpdated: (x: NftContentItem) => void;
  nodeNftContract: any;
  nodeQuanity: any;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const { onDeleteChild, nftItem, onNftUpdated, nodeNftContract, nodeQuanity } = props;
  const [id] = useState('radiogroup-' + Math.floor(Math.random() * 1_000_000));

  const changeHandler = (name: keyof NftContentItem, value: any) => {
    const newNft = Object.assign({}, nftItem);
    (newNft as any)[name] = value;
    onNftUpdated(newNft);
  };

  return (
    <div className={styles.addNftBlock}>
      <LabelSettings
        title="Marketplace"
        isActive
        support="Please select the dropping NFT parameters:
Marketplace - you can choose the Paras.id or custom NFT contract.
Token ID - insert the marketplace NFT ID or NFT contract address."
      />
      <div className={styles.radiobtnMarketplace}>
        <RadioButton
          id={`${id}-1`}
          value="Paras"
          name={id}
          checked={nftItem.contractAddress === 'paras-token-v2.testnet'}
          onChange={(e) => {
            // ToDo: how to make better?
            if (e.target.checked) {
              changeHandler('contractAddress', 'paras-token-v2.testnet');
            }
          }}
        />
        <RadioButton
          id={`${id}-3`}
          value="Custom NFT"
          name={id}
          checked={nftItem.contractAddress !== 'paras-token-v2.testnet'}
          onChange={(e) => {
            if (e.target.checked) {
              changeHandler('contractAddress', '');
            }
          }}
        />
      </div>
      <div className={styles.addNFT}>
        <div className={styles.inputCustomNFT}>
          <div>
            <InputPanel
              type="string"
              appearance="medium_big"
              placeholder="Contract Address"
              value={nftItem.contractAddress ?? ''}
              onChange={(e) => {
                changeHandler('contractAddress', e.target.value);
              }}
            />
          </div>
          <InputPanel
            type="string"
            appearance="small_mini"
            placeholder="Token ID"
            onChange={(e) => {
              changeHandler('tokenId', e.target.value);
            }}
            innerRef={nodeNftContract}
          />
        </div>

        {onDeleteChild && (
          <div className={styles.remove}>
            <Button
              onClick={onDeleteChild}
              isShowDescription={false}
              btnText="Remove NFT"
              appearance="remove"
            />
          </div>
        )}
      </div>
    </div>
  );
};
