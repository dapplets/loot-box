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
import { DropChance } from '../atoms/DropChance';
import { NftContentItem } from '../../../../common/interfaces';

export interface ChildComponentProps {
  onDeleteChild?: () => void;
  nftItem: NftContentItem;
  onNftUpdated: (x: NftContentItem) => void;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const { onDeleteChild, nftItem, onNftUpdated } = props;

  const [id] = useState('radiogroup-' + Math.floor(Math.random() * 1_000_000));

  const changeHandler = (name: keyof NftContentItem, value: any) => {
    const newNft = Object.assign({}, nftItem);
    (newNft as any)[name] = value;
    onNftUpdated(newNft);
  };

  return (
    <div className={styles.addNftBlock}>
      <LabelSettings title="Marketplace" isActive support="Choice of marketplace" />
      <div className={styles.radiobtnMarketplace}>
        <RadioButton
          id={`${id}-1`}
          value="Paras"
          name={id}
          checked={nftItem.contractAddress === 'paras.near'}
          onChange={(e) => {
            // ToDo: how to make better?
            if (e.target.checked) {
              changeHandler('contractAddress', 'paras.near');
            }
          }}
        />
        <RadioButton
          id={`${id}-2`}
          value="Minbase"
          name={id}
          checked={nftItem.contractAddress === 'mintbase.near'}
          onChange={(e) => {
            if (e.target.checked) {
              changeHandler('contractAddress', 'mintbase.near');
            }
          }}
        />
        <RadioButton
          id={`${id}-3`}
          value="Custom NFT"
          name={id}
          checked={
            nftItem.contractAddress !== 'paras.near' && nftItem.contractAddress !== 'mintbase.near'
          }
          onChange={(e) => {
            if (e.target.checked) {
              changeHandler('contractAddress', '');
            }
          }}
        />
      </div>
      <div className={styles.addNFT}>
        <div className={styles.inputCustomNFT}>
          <InputPanel
            type="string"
            appearance="medium_big"
            placeholder="Token ID"
            value={nftItem.tokenId ?? ''}
            onChange={(e) => changeHandler('tokenId', e.target.value)}
            pattern="^[0-9]\d*.{2}$"
          />
          <InputPanel
            type="string"
            appearance="small_mini"
            placeholder="Quantity"
            value={nftItem.quantity ?? ''}
            onChange={(e) => changeHandler('quantity', e.target.value)}
            pattern="^[0-9]\d*.{1}$"
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
