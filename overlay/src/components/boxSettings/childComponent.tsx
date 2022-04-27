import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  ChangeEventHandler,
  useMemo,
  useEffect,
  useRef,
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
import './invalid.scss';
import classNames from 'classnames';

export interface ChildComponentProps {
  onDeleteChild?: () => void;
  nftItem: NftContentItem;
  onNftUpdated: (x: NftContentItem) => void;
  // innerRef?: any;
  // onChange: (x: any) => void;
  nodeNftContract: any;
  nodeQuanity: any;
  // className: string;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const {
    onDeleteChild,
    nftItem,
    onNftUpdated,
    nodeNftContract,
    nodeQuanity,
    //  innerRef
    // onChange,
    // className,
  } = props;

  const [id] = useState('radiogroup-' + Math.floor(Math.random() * 1_000_000));
  const NearReg = new RegExp(/^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/gm);
  // const [nameClassInput, setNameClassInput] = useState('');
  // const validInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  //   if (e.target.value === '.' || isNaN(+e.target.value) === false) {
  //     setNameClassInput('0');
  //   } else {
  //     setNameClassInput('invalid');
  //   }
  // };
  // const invalid = useMemo(() => {
  //   console.log(nameClassInput);
  // }, [nameClassInput]);
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

Marketplace - you can choose the Paras.id, Mintbase or custom NFT contract.

Token ID - insert the marketplace NFT ID or NFT contract address."
      />
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
          value="Mintbase"
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
          <div>
          <InputPanel
            type="string"
            appearance="medium_big"
            placeholder="Contract Address"
            // className={className}
            // value={nftItem.tokenId ?? ''}
            onChange={(e) => {
              changeHandler('contractAddress', e.target.value);
            }}
            // pattern="^[0-9]\d*.{2}$"
            // innerRef={nodeNftContract}
          />
          </div> 
          <InputPanel
            type="string"
            appearance="medium_big"
            placeholder="Token ID"
            // className={className}
            // value={nftItem.tokenId ?? ''}
            onChange={(e) => {
              // if (
              //   (e.target.value === '.' || isNaN(+e.target.value) === false) &&
              //   (e.target.value[0] !== '0' ||
              //     (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
              //   +e.target.value !== 0
              // )
              // if (
              //   NearReg.test(e.target.value) &&
              //   e.target.value.length >= 2 &&
              //   e.target.value.length <= 64 &&
              //   +e.target.value !== 0
              // ) {
              //   // console.log(node.current?.className);
              //   nodeNftContract.current?.classList.remove('invalid');
              //   // onLink(false);
              // } else {
              //   // setNameClassInput('invalid');
              //   nodeNftContract.current?.classList.add('invalid');
              //   // onLink(true);
              // }
              changeHandler('tokenId', e.target.value);
              // validInput(e);
              // onChange(e);
            }}
            // pattern="^[0-9]\d*.{2}$"
            innerRef={nodeNftContract}
          />
          {/* <InputPanel
            type="string"
            appearance="small_mini"
            placeholder="Quantity"
            // className={className}
            onChange={(e) => {
              changeHandler('quantity', e.target.value);
              if (
                (e.target.value === '.' || isNaN(+e.target.value) === false) &&
                (e.target.value[0] !== '0' ||
                  (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
                +e.target.value !== 0
              ) {
                // console.log(node.current?.className);
                nodeQuanity.current?.classList.remove('invalid');
                // onLink(false);
              } else {
                // setNameClassInput('invalid');
                nodeQuanity.current?.classList.add('invalid');
                // onLink(true);
              }
              // validInput(e);
              // onChange(e);
            }}
            // pattern="^[0-9]\d*.{1}$"
            innerRef={nodeQuanity}
          /> */}
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
