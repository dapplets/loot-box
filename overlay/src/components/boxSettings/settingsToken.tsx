import React, { ReactNode, FC, useState, useEffect, useRef } from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';
import { LabelSettings } from '../atoms/LabelSettings';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import { InputPanel } from '../atoms/Input';
import { RadioButton } from '../atoms/RadioButton';
import { DropChance } from '../atoms/DropChance';
import { Lootbox } from '@loot-box/common/interfaces';
import { NearContentItem, FtContentItem } from '@loot-box/common/interfaces';
import { ButtonsSetting } from './buttonsSetting';
import './invalid.scss';
import useClass from '../../hooks/useClass';
import { Check } from '../../utils/check';

import BigNumber from 'bignumber.js';

export interface BoxSettingsProps {
  children?: ReactNode;
  onChange?: () => void;
  onSubmit?: () => void;
  dataType?: string;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: any) => void;
  setFtMetadata: (x: any) => void;
  newMetadata: any;
  setDropType: (x: any) => void;
  setMetadata: (x: any) => void;
}
const DEFAULT_NEAR_ITEM: NearContentItem = {
  tokenAmount: '',
  dropType: 'fixed',
  dropAmountFrom: '',
  dropAmountTo: '',
};

enum DropType {
  Variable = 0,
  Fixed = 1,
}
enum DropTypeFt {
  Variable = 0,
  Fixed = 1,
}
enum TokenType {
  Near = 0,
  Custom = 1,
}

const DEFAULT_FT_ITEM: FtContentItem = {
  contractAddress: '',
  tokenAmount: '',
  dropType: 'fixed',
  dropAmountFrom: '',
  dropAmountTo: '',
};
export const SettingsToken: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const {
    creationForm,
    onCreationFormUpdate,
    setFtMetadata,
    newMetadata,
    setDropType,
    setMetadata
  } = props;
  const [value, setValue] = useState(20);
  const [link, onLink] = useState(true);

  const nodeTokenAmount = useRef<HTMLInputElement>();
  const nodeTokenContract = useRef<HTMLInputElement>();
  const nodeTokenTicer = useRef<HTMLInputElement>();
  const nodeFrom = useRef<HTMLInputElement>();
  const nodeTo = useRef<HTMLInputElement>();
  const nodeDropAmount = useRef<HTMLInputElement>();
  const nodeDropChance = useRef<HTMLInputElement>();

  const newForm = Object.assign({}, creationForm);
  const [activeDropType, setActiveDropType] = useState(DropType.Fixed);
  const [activeDropTypeFt, setActiveDropTypeFt] = useState(DropTypeFt.Fixed);
  const [activeTokenType, setActiveTokenType] = useState(TokenType.Near);
  const [isLoader, setLoader] = useState(false);

  const booleanNodeTokenAmount = nodeTokenAmount.current?.classList.contains('invalid');
  nodeTokenContract;
  const booleanNodeTokenContract = nodeTokenContract.current?.classList.contains('invalid');
  const booleanNodeTokenTicer = nodeTokenTicer.current?.classList.contains('invalid');
  const booleanNodeFrom = nodeFrom.current?.classList.contains('invalid');
  const booleanNodeTo = nodeTo.current?.classList.contains('invalid');
  const booleanNodeDropAmount = nodeDropAmount.current?.classList.contains('invalid');
 const check = Check(creationForm.nearContentItems[0],BigNumber)
 const checkFT = Check(creationForm.ftContentItems[0],BigNumber)

  useEffect(() => {
    creationForm.dropChance = value;
    onCreationFormUpdate(creationForm);
  });

  const changeHandler = (name: keyof NearContentItem, value: any) => {
    const newForm = Object.assign({}, creationForm);
    newForm.nearContentItems[0][name] = value;
    onCreationFormUpdate(newForm);
  };

  const changeHandlerFT = (name: keyof FtContentItem, value: any) => {
    newForm.ftContentItems[0][name] = value;
    onCreationFormUpdate(newForm);
  };

  const handleClick = () => {
    if (nodeTokenAmount && nodeTokenAmount.current) {
      nodeTokenAmount.current.value = '';
    }
  };

  const func = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.indexOf('.') !== -1) {
      e.currentTarget.value = e.currentTarget.value.substring(
        0,
        e.currentTarget.value.indexOf('.') + 7,
      );
    }
  };
  const ClassRef = useClass(activeTokenType,creationForm,activeDropType,DropType,nodeFrom,nodeTo,nodeTokenAmount,onLink,activeDropTypeFt,DropTypeFt,check, link,nodeDropAmount,checkFT,nodeTokenContract,value,nodeDropChance,setDropType,booleanNodeTokenAmount, booleanNodeTokenContract, booleanNodeTokenTicer,
    booleanNodeFrom,
    booleanNodeTo,
    booleanNodeDropAmount)
   

  useEffect(() => {
    DEFAULT_NEAR_ITEM.dropAmountFrom = '';
    DEFAULT_NEAR_ITEM.dropAmountTo = '';
    DEFAULT_NEAR_ITEM.tokenAmount = '';

    DEFAULT_FT_ITEM.contractAddress = '';
    DEFAULT_FT_ITEM.dropAmountFrom = '';
    DEFAULT_FT_ITEM.dropAmountTo = '';
    DEFAULT_FT_ITEM.tokenAmount = '';

    newForm.nearContentItems = [DEFAULT_NEAR_ITEM];
    creationForm.nftContentItems = [];
    newForm.ftContentItems = [DEFAULT_FT_ITEM];
    onCreationFormUpdate(creationForm);

    onCreationFormUpdate(newForm);
  
    
  }, []);

  return (
    <>
      {isLoader ? (
        <div></div>
      ) : (
        <div className={cn(styles.wrapper)}>
          <div className={styles.div}>
            <div className={styles.divBtn}>
              <ButtonsSetting onClick={() => setMetadata(null)} classNameToken={styles.btnToken} />
            </div>
            <div className={cn(styles.wrapperTokenAmount)}>
              <div className={cn(styles.tokenAmount)}>
                <LabelSettings
                  title="Token amount"
                  isActive
                  support={`Please enter the number of tokens you want to distribute.
              You can select a NEAR token or any custom token in the NEAR blockchain.`}
                />
                <div className={cn(styles.tokenInput)}>
                  <InputPanel
                    type="string"
                    appearance="default"
                    placeholder="Token amount"
                    innerRef={nodeTokenAmount}
                    onInput={(e) => func(e)}
                    onChange={(e) => {
                      if (activeTokenType === TokenType.Near) {
                        changeHandler.call(null, 'tokenAmount', e.target.value);
                      } else {
                        changeHandlerFT.call(null, 'tokenAmount', e.target.value);
                      }
                    }}
                  />
                  <RadioButton
                    value="$NEAR"
                    title="$NEAR"
                    name="TokenAmount"
                    id="1_amount"
                    checked={activeTokenType === TokenType.Near}
                    onChange={(e) => {
                      setMetadata(null);
                      if (e.target.checked !== undefined) {
                        setActiveTokenType(TokenType.Near);
                        handleClick();
                      }
                    }}
                  />
                  <RadioButton
                    value="Custom token"
                    title="Custom token"
                    name="TokenAmount"
                    id="2_amount"
                    checked={activeTokenType === TokenType.Custom}
                    onChange={(e) => {
                      if (e.target.checked !== undefined) {
                        setActiveTokenType(TokenType.Custom);
                        handleClick();
                      }
                    }}
                  />
                </div>
              </div>
              {activeTokenType === TokenType.Near && (
                <div className={cn(styles.dropAmount)}>
                  <div className={cn(styles.LabelSettings)}>
                    <LabelSettings
                      title="Drop amount"
                      className={cn(styles.LabelSettings)}
                      isActive
                      support="Please enter the number of tokens the winner will receive.
                  You can select a fixed amount or a variable amount. In case of a variable amount please choose the MIN and MAX sums."
                    />
                  </div>
                  <div className={cn(styles.dropAmountButtons)}>
                    <RadioButton
                      value="Fixed"
                      title="Fixed"
                      name="dropAmount"
                      id="3_Drop"
                      checked={activeDropType === DropType.Fixed}
                      onChange={(e) => {
                        if (e.target.checked !== undefined) {
                          creationForm.nearContentItems[0].dropAmountFrom = '';
                          creationForm.nearContentItems[0].dropAmountTo = '';
                          changeHandler.call(null, 'dropType', 'fixed');
                          setActiveDropType(DropType.Fixed);
                        }
                      }}
                    />
                    <RadioButton
                      value="Variable"
                      title="Variable"
                      name="dropAmount"
                      id="4_Drop"
                      checked={activeDropType === DropType.Variable}
                      onChange={(e) => {
                        if (e.target.checked !== undefined) {
                          creationForm.nearContentItems[0].dropAmountFrom = '';
                          creationForm.nearContentItems[0].dropAmountTo = '';
                          changeHandler.call(null, 'dropType', 'variable');
                          setActiveDropType(DropType.Variable);
                        }
                      }}
                    />
                  </div>
                  {activeDropType === DropType.Fixed && (
                    <InputPanel
                      type="text"
                      appearance="biggest"
                      placeholder="Drop amount"
                      innerRef={nodeDropAmount}
                      onInput={(e) => func(e)}
                      onChange={(e) => {
                        changeHandler.call(null, 'dropAmountTo', e.target.value);
                        changeHandler.call(null, 'dropAmountFrom', e.target.value);
                      }}
                    />
                  )}
                  {activeDropType === DropType.Variable && (
                    <div className={cn(styles.dropAmountInput)}>
                      <InputPanel
                        type="text"
                        appearance="small_medium"
                        placeholder="From"
                        innerRef={nodeFrom}
                        onInput={(e) => func(e)}
                        onChange={(e) => {
                          changeHandler.call(null, 'dropAmountFrom', e.target.value);
                        }}
                      />
                      <InputPanel
                        type="text"
                        appearance="small_medium"
                        placeholder="To"
                        innerRef={nodeTo}
                        onInput={(e) => func(e)}
                        onChange={(e) => {
                          changeHandler.call(null, 'dropAmountTo', e.target.value);
                         
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              {activeTokenType === TokenType.Custom && (
                <div className={cn(styles.dropAmount)}>
                  <div className={cn(styles.inputDropAmount)}>
                    <InputPanel
                      type="text"
                      appearance="medium"
                      placeholder="Token contract"
                      innerRef={nodeTokenContract}
                      onChange={(e) => {
                        changeHandlerFT.call(null, 'contractAddress', e.target.value);
                        setFtMetadata(e.target.value);
                      }}
                    />
                    <InputPanel
                      type="text"
                      appearance="small"
                      placeholder="Token ticker "
                      innerRef={nodeTokenTicer}
                      readOnly
                      value={newMetadata ? newMetadata.symbol : ''}
                    />
                  </div>
                  <div className={cn(styles.LabelSettings)}>
                    <LabelSettings
                      title="Drop amount"
                      isActive
                      support="Please enter the number of tokens the winner will receive.
                  You can select a fixed amount or a variable amount. In case of a variable amount please choose the MIN and MAX sums."
                    />
                  </div>

                  <div className={cn(styles.dropAmountButtons)}>
                    <RadioButton
                      value="Fixed"
                      title="Fixed"
                      name="dropAmount"
                      id="3_Drop"
                      checked={activeDropTypeFt === DropTypeFt.Fixed}
                      onChange={(e) => {
                        if (e.target.checked !== undefined) {
                          creationForm.ftContentItems[0].dropAmountFrom = '';
                          creationForm.ftContentItems[0].dropAmountTo = '';
                          changeHandlerFT.call(null, 'dropType', 'fixed');
                          setActiveDropTypeFt(DropTypeFt.Fixed);
                        }
                      }}
                    />
                    <RadioButton
                      value="Variable"
                      title="Variable"
                      name="dropAmount"
                      id="4_Drop"
                      checked={activeDropTypeFt === DropTypeFt.Variable}
                      onChange={(e) => {
                        if (e.target.checked !== undefined) {
                          creationForm.ftContentItems[0].dropAmountFrom = '';
                          creationForm.ftContentItems[0].dropAmountTo = '';
                          changeHandlerFT.call(null, 'dropType', 'variable');
                          setActiveDropTypeFt(DropTypeFt.Variable);
                        }
                      }}
                    />
                  </div>
                  {activeDropTypeFt === DropTypeFt.Fixed && (
                    <InputPanel
                      type="text"
                      appearance="biggest"
                      placeholder="Drop amount"
                      innerRef={nodeDropAmount}
                      onInput={(e) => func(e)}
                      onChange={(e) => {
                        changeHandlerFT.call(null, 'dropAmountTo', e.target.value);
                        changeHandlerFT.call(null, 'dropAmountFrom', e.target.value);
                      }}
                    />
                  )}
                  {activeDropTypeFt === DropTypeFt.Variable && (
                    <div className={cn(styles.dropAmountInput)}>
                      <InputPanel
                        type="text"
                        appearance="small_medium"
                        placeholder="From"
                        innerRef={nodeFrom}
                        onInput={(e) => func(e)}
                        onChange={(e) => {
                          changeHandlerFT.call(null, 'dropAmountFrom', e.target.value);
                        }}
                      />
                      <InputPanel
                        type="text"
                        appearance="small_medium"
                        placeholder="To"
                        innerRef={nodeTo}
                        onInput={(e) => func(e)}
                        onChange={(e) => {
                          changeHandlerFT.call(null, 'dropAmountTo', e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className={cn(styles.dropChance)}>
                <LabelSettings
                  title="Drop Chance, %"
                  isActive
                  support="The chance a person has to get the drop. 
                  Please enter the amount from 1 to 100."
                />
                <DropChance
                  type="string"
                  innerRef={nodeDropChance}
                  maxValueDropChance="100"
                  minValueDropChance="1"
                  valueDropChance={`${value}`}
                  onValueDropChance={(newValue: any) => setValue(+newValue)}
                  valueButtonDropChance={value}
                  setValueButtonDropChance={setValue}
                />
              </div>
            </div>
          </div>
          <div className={cn(styles.navigation)}>
            <Link to="/select_box" onClick={()=>{
              handleClick();
              creationForm.nearContentItems = [];
              creationForm.nftContentItems = [];
              creationForm.ftContentItems = [];
              }}>
              <LinksStep step="prev" label="Back" />
            </Link>
            {(link && <div></div>) ||
              (value < 101 && (
                <Link
                  to="/fill_your_box"
                  onClick={() => {
                    handleClick();
                    if (activeTokenType === TokenType.Custom) {
                      creationForm.nearContentItems = [];
                      creationForm.nftContentItems = [];
                    } else {
                      creationForm.ftContentItems = [];
                      creationForm.nftContentItems = [];
                    }
                    onLink(false);
                  }}
                >
                  <LinksStep step="next" label="Next step" />
                </Link>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
