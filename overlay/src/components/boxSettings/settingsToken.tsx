import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  ChangeEventHandler,
  ChangeEvent,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';
import { useToggle } from '../../hooks/useToggle';
import useDebounce from '../../hooks/useDebounce';

import { LabelSettings } from '../atoms/LabelSettings';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import { InputPanel } from '../atoms/Input';
import { RadioButton } from '../atoms/RadioButton';
import { DropChance } from '../atoms/DropChance';
import { Lootbox } from '@loot-box/common/interfaces';
import { NearContentItem, FtContentItem } from '@loot-box/common/interfaces';
import { ButtonsSetting } from './buttonsSetting';
import { Test } from '../atoms/test';
import classNames from 'classnames';
import './invalid.scss';

import { truncate } from 'fs/promises';
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
}
const DEFAULT_NEAR_ITEM: NearContentItem = {
  tokenAmount: '',
  dropType: 'fixed',
  dropAmountFrom: '',
  dropAmountTo: '',
};

const DEFAULT_FT_ITEM: FtContentItem = {
  contractAddress: '',
  tokenAmount: '',
  dropType: 'fixed',
  dropAmountFrom: '',
  dropAmountTo: '',
};
export const SettingsToken: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { creationForm, onCreationFormUpdate, setFtMetadata, newMetadata } = props;
  const [isShowDescription_tokenAmount, onShowDescription_tokenAmount] = useToggle(false);
  const [isShowDescription_dropAmount, onShowDescription_dropAmount] = useToggle(false);

  const [valueRadio, setValueRadioLoot] = useState('');

  const [value, setValue] = React.useState(20);

  const [link, onLink] = useState(true);
  // console.log(creationForm);
  const nodeTokenAmount = useRef<HTMLInputElement>();
  const nodeTokenContract = useRef<HTMLInputElement>();
  const nodeTokenTicer = useRef<HTMLInputElement>();
  const nodeFrom = useRef<HTMLInputElement>();
  const nodeTo = useRef<HTMLInputElement>();
  const nodeDropAmount = useRef<HTMLInputElement>();
  const regExpIndex = new RegExp(/\d+(\.?\d+)?/gm);
  const reg2 = new RegExp(/^[0-9]*[.,][0-9]+$/gm);
  const newForm = Object.assign({}, creationForm);

  const NearReg = new RegExp(/^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/gm);
  // const [isSearching, setIsSearching] = useState(false)
  // const debouncedSearchTerm = useDebounce(creationForm, 300);

  useEffect(() => {
    creationForm.dropChance = value;
    onCreationFormUpdate(creationForm);
  });

  const onChangeRadioLoot: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueRadioLoot(e.target.value);
    onShowDescription_tokenAmount();
  };

  // const validInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  //   if (e.target.value === '.' || isNaN(+e.target.value) === false) {
  //     setNameClassInput('0');
  //   } else {
  //     setNameClassInput('invalid');
  //   }
  // };

  const booleanNodeTokenAmount = nodeTokenAmount.current?.classList.contains('invalid');
  nodeTokenContract;
  const booleanNodeTokenContract = nodeTokenContract.current?.classList.contains('invalid');
  const booleanNodeTokenTicer = nodeTokenTicer.current?.classList.contains('invalid');
  const booleanNodeFrom = nodeFrom.current?.classList.contains('invalid');
  const booleanNodeTo = nodeTo.current?.classList.contains('invalid');
  const booleanNodeDropAmount = nodeDropAmount.current?.classList.contains('invalid');

  const changeHandler = (name: keyof NearContentItem, value: any) => {
    const newForm = Object.assign({}, creationForm);

    onCreationFormUpdate(
      (creationForm.ftContentItems[0] = {
        contractAddress: '',
        tokenAmount: '',
        dropType: 'fixed',
        dropAmountFrom: '',
        dropAmountTo: '',
      }),
    );

    creationForm.ftContentItems = [];

    newForm.nearContentItems[0][name] = value;

    onCreationFormUpdate(newForm);
  };

  const changeHandlerFT = (name: keyof FtContentItem, value: any) => {
    onCreationFormUpdate(
      (creationForm.nearContentItems[0] = {
        tokenAmount: '',
        dropType: 'fixed',
        dropAmountFrom: '',
        dropAmountTo: '',
      }),
    );

    newForm.ftContentItems[0][name] = value;
    // console.log(value);

    onCreationFormUpdate(newForm);
  };

  // const changeHandlerFTRadio = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.currentTarget;

  //   // console.log(name, value);
  //   onCreationFormUpdate((prevState: any) => ({
  //     ...prevState,
  //     ftContentItems: { ...prevState.ftContentItems, [name]: value },
  //   }));
  //   // console.log(e);
  // };
  useEffect(() => {
    // ToDo: move to App.tsx
    // ToDo: how to get rid of object coping?
    // DEFAULT_NEAR_ITEM.dropAmountFrom = '';
    // DEFAULT_NEAR_ITEM.dropAmountTo = '';
    DEFAULT_NEAR_ITEM.tokenAmount = '';

    // DEFAULT_FT_ITEM.contractAddress = '';
    // DEFAULT_FT_ITEM.dropAmountFrom = '';
    // DEFAULT_FT_ITEM.dropAmountTo = '';
    DEFAULT_FT_ITEM.tokenAmount = '';

    newForm.nearContentItems = [DEFAULT_NEAR_ITEM];
    creationForm.nftContentItems = [];
    newForm.ftContentItems = [DEFAULT_FT_ITEM];
    onCreationFormUpdate(creationForm);
    console.log(DEFAULT_NEAR_ITEM);

    onCreationFormUpdate(newForm);
    // console.log(creationForm);
    // console.log(newForm);
    // console.log(DEFAULT_NEAR_ITEM);
    // console.log(DEFAULT_FT_ITEM);
  }, []);
  const handleClick = () => {
    if (nodeTokenAmount && nodeTokenAmount.current) {
      nodeTokenAmount.current.value = '';
    }
  };
  const check = () => {
    if (creationForm.nearContentItems[0] || creationForm.ftContentItems[0]) {
      if (
        (creationForm.nearContentItems[0] &&
          creationForm.nearContentItems[0].tokenAmount &&
          Number(creationForm.nearContentItems[0].tokenAmount) >=
            Number(creationForm.nearContentItems[0].dropAmountFrom)) ||
        (creationForm.ftContentItems[0] &&
          creationForm.ftContentItems[0].tokenAmount &&
          Number(creationForm.ftContentItems[0].tokenAmount) >=
            Number(creationForm.ftContentItems[0].dropAmountFrom))
      ) {
        const bigNumTokenAmount = new BigNumber(
          creationForm.nearContentItems[0] && creationForm.nearContentItems[0].tokenAmount,
        );
        const result = bigNumTokenAmount.mod(
          Number(
            creationForm.nearContentItems[0] && creationForm.nearContentItems[0].dropAmountFrom,
          ),
        );
        const bigNumTokenAmountFt = new BigNumber(
          creationForm.ftContentItems[0] && creationForm.ftContentItems[0].tokenAmount,
        );
        const resultFt = bigNumTokenAmountFt.mod(
          creationForm.ftContentItems[0] && Number(creationForm.ftContentItems[0].dropAmountFrom),
        );
        if (
          (result && result.c && result.c[0] === 0) ||
          (resultFt && resultFt.c && resultFt.c[0] === 0)
        ) {
          return true;
        } else {
          false;
        }
      } else if (
        (creationForm.nearContentItems[0] &&
          creationForm.nearContentItems[0].dropType === 'variable') ||
        //  &&

        (creationForm.ftContentItems[0] && creationForm.ftContentItems[0].dropType === 'variable')
      ) {
        if (
          Number(creationForm.nearContentItems[0].tokenAmount) >=
            Number(creationForm.nearContentItems[0].dropAmountTo) ||
          Number(creationForm.ftContentItems[0].tokenAmount) >=
            Number(creationForm.ftContentItems[0].dropAmountTo)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        false;
      }
    } else {
      return false;
    }
    // console.log(result.c![0]);
    // console.log(bigNum);
  };

  // const checkValueMath = () => {
  //   if (
  //     (creationForm.nearContentItems[0] &&
  //       Number(creationForm.nearContentItems[0].tokenAmount) >=
  //         Number(creationForm.nearContentItems[0].dropAmountFrom) &&
  //       Number(creationForm.nearContentItems[0].tokenAmount) %
  //         Number(creationForm.nearContentItems[0].dropAmountFrom) ===
  //         0 &&
  //       creationForm.nearContentItems[0].dropType === 'fixed') ||
  //     (creationForm.ftContentItems[0] &&
  //       Number(creationForm.ftContentItems[0].tokenAmount) >=
  //         Number(creationForm.ftContentItems[0].dropAmountFrom) &&
  //       Number(creationForm.ftContentItems[0].tokenAmount) %
  //         Number(creationForm.ftContentItems[0].dropAmountFrom) ===
  //         0 &&
  //       creationForm.ftContentItems[0].dropType === 'fixed')
  //   ) {
  //     return true;
  //   } else if (
  //     (creationForm.nearContentItems[0] &&
  //       creationForm.nearContentItems[0].dropType === 'variable') ||
  //     (creationForm.ftContentItems[0] && creationForm.ftContentItems[0].dropType === 'variable')
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  const LinkBlock = useMemo(() => {
    if (
      (creationForm.nearContentItems.length !== 0 || creationForm.ftContentItems.length !== 0) &&
      booleanNodeTokenAmount != true &&
      booleanNodeTokenContract != true &&
      booleanNodeTokenTicer != true &&
      booleanNodeFrom != true &&
      booleanNodeTo != true &&
      booleanNodeDropAmount != true
    ) {
      if (
        (creationForm.nearContentItems[0] &&
          creationForm.nearContentItems[0].tokenAmount &&
          creationForm.nearContentItems[0].tokenAmount.length >= 1 &&
          creationForm.nearContentItems[0].dropAmountFrom.length >= 1 &&
          creationForm.nearContentItems[0].dropAmountTo.length >= 1) ||
        (creationForm.ftContentItems[0] &&
          creationForm.ftContentItems[0].tokenAmount.length >= 1 &&
          creationForm.ftContentItems[0].dropAmountFrom.length >= 1 &&
          creationForm.ftContentItems[0].dropAmountTo.length >= 1 &&
          creationForm.ftContentItems[0].contractAddress.length >= 1)
      ) {
        onLink(false);
      } else {
        // console.log(nameClassInput);
        onLink(true);
      }
    } else {
      onLink(true);
      // console.log(checkValueMath());
    }
  }, [
    creationForm,
    link,
    nodeTokenAmount,
    isShowDescription_tokenAmount,
    isShowDescription_dropAmount,
  ]);

  const func = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.indexOf('.') !== -1) {
      e.currentTarget.value = e.currentTarget.value.substring(
        0,
        e.currentTarget.value.indexOf('.') + 7,
      );
    }
  };

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.div}>
        <div className={styles.divBtn}>
          <ButtonsSetting classNameToken={styles.btnToken} />
        </div>

        <div className={cn(styles.wrapperTokenAmount)}>
          <div className={cn(styles.tokenAmount)}>
            <LabelSettings
              title="Token amount"
              isActive
              support={`Please enter the number of tokens you want to distribute.
              You can select a NEAR token or any custom token in the NEAR blockchain.
              Minimum quantity: 1 token`}
            />
            <div className={cn(styles.tokenInput)}>
              <InputPanel
                type="string"
                appearance="default"
                placeholder="Token amount"
                innerRef={nodeTokenAmount}
                // defaultValue={
                //   DEFAULT_NEAR_ITEM.tokenAmount.length > 0
                //     ? DEFAULT_NEAR_ITEM.tokenAmount
                //     : DEFAULT_FT_ITEM.tokenAmount
                // }
                onInput={(e) => func(e)}
                onChange={(e) => {
                  if (
                    (e.target.value === '.' || isNaN(+e.target.value) === false) &&
                    (e.target.value[0] !== '0' ||
                      (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
                    +e.target.value !== 0
                  ) {
                    nodeTokenAmount.current?.classList.remove('invalid');
                  } else {
                    nodeTokenAmount.current?.classList.add('invalid');
                  }
                  if (isShowDescription_tokenAmount) {
                    changeHandlerFT.call(null, 'tokenAmount', e.target.value);
                  } else {
                    changeHandler.call(null, 'tokenAmount', e.target.value);
                  }
                }}
              />
              <RadioButton
                value="$NEAR"
                title="$NEAR"
                name="TokenAmount"
                id="1_amount"
                defaultChecked={true}
                onChange={(e) => {
                  if (e.target.checked !== undefined) {
                    creationForm.ftContentItems[0].tokenAmount = '';
                    onChangeRadioLoot(e);
                    handleClick();
                  }
                }}

                // onChange={onChangeRadioLoot}
              />
              <RadioButton
                value="Custom token"
                title="Custom token"
                name="TokenAmount"
                id="2_amount"
                // onChange={onChangeRadioLoot}
                onChange={(e) => {
                  if (e.target.checked !== undefined) {
                    creationForm.nearContentItems[0].tokenAmount = '';
                    onChangeRadioLoot(e);
                    handleClick();
                  }
                }}
              />
            </div>
          </div>
          {(isShowDescription_tokenAmount && (
            <div className={cn(styles.dropAmount)}>
              <div className={cn(styles.inputDropAmount)}>
                <InputPanel
                  type="text"
                  appearance="medium"
                  placeholder="Token contract"
                  defaultValue={DEFAULT_FT_ITEM.contractAddress}
                  innerRef={nodeTokenContract}
                  // value={creationForm.ftContentItems[0].contractAddress}
                  onChange={(e) => {
                    if (
                      NearReg.test(e.target.value) &&
                      e.target.value.length >= 2 &&
                      e.target.value.length <= 64 &&
                      +e.target.value !== 0
                    ) {
                      nodeTokenContract.current?.classList.remove('invalid');
                    } else {
                      nodeTokenContract.current?.classList.add('invalid');
                    }
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
                  defaultChecked={true}
                  onChange={(e) => {
                    if (e.target.checked !== undefined) {
                      creationForm.ftContentItems[0].dropAmountFrom = '';
                      creationForm.ftContentItems[0].dropAmountTo = '';
                      changeHandlerFT.call(null, 'dropType', 'fixed');
                      onShowDescription_dropAmount();
                    }
                  }}
                />
                <RadioButton
                  value="Variable"
                  title="Variable"
                  name="dropAmount"
                  id="4_Drop"
                  onChange={(e) => {
                    if (e.target.checked !== undefined) {
                      creationForm.ftContentItems[0].dropAmountFrom = '';
                      creationForm.ftContentItems[0].dropAmountTo = '';
                      changeHandlerFT.call(null, 'dropType', 'variable');
                      onShowDescription_dropAmount();
                    }
                  }}
                />
              </div>
              {(isShowDescription_dropAmount && (
                <div className={cn(styles.dropAmountInput)}>
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="From"
                    defaultValue={DEFAULT_FT_ITEM.dropAmountFrom}
                    innerRef={nodeFrom}
                    onInput={(e) => func(e)}
                    onChange={(e) => {
                      if (
                        (e.target.value === '.' || isNaN(+e.target.value) === false) &&
                        (e.target.value[0] !== '0' ||
                          (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
                        +e.target.value !== 0
                      ) {
                        nodeFrom.current?.classList.remove('invalid');
                      } else {
                        nodeFrom.current?.classList.add('invalid');
                      }
                      changeHandlerFT.call(null, 'dropAmountFrom', e.target.value);
                    }}
                  />
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    defaultValue={DEFAULT_FT_ITEM.dropAmountTo}
                    innerRef={nodeTo}
                    onInput={(e) => func(e)}
                    onChange={(e) => {
                      if (
                        (e.target.value === '.' || isNaN(+e.target.value) === false) &&
                        (e.target.value[0] !== '0' ||
                          (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
                        +e.target.value !== 0
                      ) {
                        if (
                          nodeFrom &&
                          nodeFrom.current &&
                          nodeTo &&
                          nodeTo.current &&
                          +nodeFrom.current.value <= +nodeTo.current.value
                        ) {
                          nodeFrom.current?.classList.remove('invalid');
                        } else {
                          nodeFrom.current?.classList.add('invalid');
                        }
                        nodeTo.current?.classList.remove('invalid');
                      } else {
                        nodeTo.current?.classList.add('invalid');
                      }
                      changeHandlerFT.call(null, 'dropAmountTo', e.target.value);
                      if (!check()) {
                        onLink(true);
                        nodeTo.current?.classList.add('invalid');
                      } else {
                        onLink(false);
                        nodeTo.current?.classList.remove('invalid');
                      }
                    }}
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  innerRef={nodeDropAmount}
                  defaultValue={DEFAULT_FT_ITEM.dropAmountFrom}
                  onInput={(e) => func(e)}
                  onChange={(e) => {
                    if (
                      (e.target.value === '.' || isNaN(+e.target.value) === false) &&
                      (e.target.value[0] !== '0' ||
                        (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
                      +e.target.value !== 0
                    ) {
                      nodeDropAmount.current?.classList.remove('invalid');
                    } else {
                      nodeDropAmount.current?.classList.add('invalid');
                    }
                    changeHandlerFT.call(null, 'dropAmountTo', e.target.value);
                    changeHandlerFT.call(null, 'dropAmountFrom', e.target.value);
                    if (!check()) {
                      onLink(true);
                      nodeDropAmount.current?.classList.add('invalid');
                    } else {
                      onLink(false);
                      nodeDropAmount.current?.classList.remove('invalid');
                    }
                  }}
                />
              )}
            </div>
          )) || (
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
                  defaultChecked
                  onChange={(e) => {
                    if (e.target.checked !== undefined) {
                      creationForm.nearContentItems[0].dropAmountFrom = '';
                      creationForm.nearContentItems[0].dropAmountTo = '';
                      changeHandler.call(null, 'dropType', 'fixed');
                      onShowDescription_dropAmount();
                    }
                  }}
                />
                <RadioButton
                  value="Variable"
                  title="Variable"
                  name="dropAmount"
                  id="4_Drop"
                  onChange={(e) => {
                    if (e.target.checked !== undefined) {
                      creationForm.nearContentItems[0].dropAmountFrom = '';
                      creationForm.nearContentItems[0].dropAmountTo = '';
                      changeHandler.call(null, 'dropType', 'variable');
                      onShowDescription_dropAmount();
                    }
                  }}
                />
              </div>
              {(isShowDescription_dropAmount && (
                <div className={cn(styles.dropAmountInput)}>
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="From"
                    innerRef={nodeFrom}
                    defaultValue={DEFAULT_NEAR_ITEM.dropAmountFrom}
                    onInput={(e) => func(e)}
                    onChange={(e) => {
                      if (
                        (e.target.value === '.' || isNaN(+e.target.value) === false) &&
                        (e.target.value[0] !== '0' ||
                          (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
                        +e.target.value !== 0
                      ) {
                        nodeFrom.current?.classList.remove('invalid');
                      } else {
                        nodeFrom.current?.classList.add('invalid');
                      }
                      changeHandler.call(null, 'dropAmountFrom', e.target.value);
                    }}
                  />
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    innerRef={nodeTo}
                    defaultValue={DEFAULT_NEAR_ITEM.dropAmountTo}
                    onInput={(e) => func(e)}
                    onChange={(e) => {
                      if (
                        (e.target.value === '.' || isNaN(+e.target.value) === false) &&
                        (e.target.value[0] !== '0' ||
                          (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
                        +e.target.value !== 0
                      ) {
                        if (
                          nodeFrom &&
                          nodeFrom.current &&
                          nodeTo &&
                          nodeTo.current &&
                          +nodeFrom.current.value <= +nodeTo.current.value
                        ) {
                          nodeFrom.current?.classList.remove('invalid');
                        } else {
                          nodeFrom.current?.classList.add('invalid');
                        }
                        nodeTo.current?.classList.remove('invalid');
                      } else {
                        nodeTo.current?.classList.add('invalid');
                      }
                      changeHandler.call(null, 'dropAmountTo', e.target.value);
                      if (!check()) {
                        onLink(true);
                        nodeTo.current?.classList.add('invalid');
                      } else {
                        onLink(false);
                        nodeTo.current?.classList.remove('invalid');
                      }
                    }}
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  innerRef={nodeDropAmount}
                  defaultValue={DEFAULT_NEAR_ITEM.dropAmountFrom}
                  onInput={(e) => func(e)}
                  onChange={(e) => {
                    if (
                      (e.target.value === '.' || isNaN(+e.target.value) === false) &&
                      (e.target.value[0] !== '0' ||
                        (e.target.value[1] === '.' && e.target.value.length >= 3)) &&
                      +e.target.value !== 0
                      // &&
                      // checkValueMath()
                    ) {
                      // console.log(checkValueMath());

                      nodeDropAmount.current?.classList.remove('invalid');
                    } else {
                      nodeDropAmount.current?.classList.add('invalid');
                    }
                    changeHandler.call(null, 'dropAmountTo', e.target.value);
                    changeHandler.call(null, 'dropAmountFrom', e.target.value);
                    if (!check()) {
                      onLink(true);
                      nodeDropAmount.current?.classList.add('invalid');
                    } else {
                      onLink(false);
                      nodeDropAmount.current?.classList.remove('invalid');
                    }
                  }}
                />
              )}
            </div>
          )}
          {/* <Test
            type="string"
            valueDropChance={valTest}
            onValueDropChance={(newValue: any) => onValTest(newValue)}
          /> */}
          <div className={cn(styles.dropChance)}>
            <LabelSettings
              title="Drop Chance"
              isActive
              support="The chance a person has to get the drop. 
Please enter the amount in percentage."
            />

            <DropChance
              type="string"
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
        <Link to="/select_box" onClick={handleClick}>
          <LinksStep step="prev" label="Back" />
        </Link>
        {(link && <div></div>) ||
          (check() && (
            <Link
              to="/fill_your_box"
              onClick={() => {
                handleClick();
                console.log(DEFAULT_NEAR_ITEM);
                console.log(creationForm);

                if (isShowDescription_tokenAmount) {
                  creationForm.nearContentItems = [];
                  creationForm.nftContentItems = [];
                } else {
                  creationForm.ftContentItems = [];
                  creationForm.nftContentItems = [];
                }
                onLink(false);
                // } else {
                //   onLink(true);
                //   nodeDropAmount.current?.classList.add('invalid');
                // }
              }}
            >
              <LinksStep step="next" label="Next step" />
            </Link>
          ))}
      </div>
    </div>
  );
};
