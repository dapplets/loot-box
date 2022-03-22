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
} from 'react';
import styles from './BoxSettings.module.scss';
import cn from 'classnames';
import { useToggle } from '../../hooks/useToggle';

import { LabelSettings } from '../atoms/LabelSettings';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import { InputPanel } from '../atoms/Input';
import { RadioButton } from '../atoms/RadioButton';
import { DropChance } from '../atoms/DropChance';
import { Lootbox } from '../../../../common/interfaces';
import { NearContentItem, FtContentItem } from '../../../../common/interfaces';
import { ButtonsSetting } from './buttonsSetting';

export interface BoxSettingsProps {
  children?: ReactNode;
  onChange?: () => void;
  onSubmit?: () => void;
  dataType?: string;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: any) => void;
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
  const { creationForm, onCreationFormUpdate } = props;
  const [isShowDescription_tokenAmount, onShowDescription_tokenAmount] = useToggle(false);
  const [isShowDescription_dropAmount, onShowDescription_dropAmount] = useToggle(false);

  const [valueRadio, setValueRadioLoot] = useState('');

  const [value, setValue] = React.useState(20);
  const [ftItem, setFtItem] = useState(DEFAULT_FT_ITEM);
  const [nearItem, setNearItem] = useState(DEFAULT_NEAR_ITEM);

  useEffect(() => {
    creationForm.dropChance = value;
    onCreationFormUpdate(creationForm);
  });

  const onChangeRadioLoot: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueRadioLoot(e.target.value);
    onShowDescription_tokenAmount();
  };

  const changeHandler = (name: keyof NearContentItem, value: any) => {
    const newForm = Object.assign({}, creationForm);

    // (newForm as any)[name] = value;
    onCreationFormUpdate(
      (creationForm.ftContentItems[0] = {
        contractAddress: '',
        tokenAmount: '',
        dropType: 'fixed',
        dropAmountFrom: '',
        dropAmountTo: '',
      }),
    );

    newForm.nearContentItems[0][name] = value;
    console.log(value);
    onCreationFormUpdate(newForm);
  };

  const changeHandlerFT = (name: keyof FtContentItem, value: any) => {
    const newForm = Object.assign({}, creationForm);

    onCreationFormUpdate(
      (creationForm.nearContentItems[0] = {
        tokenAmount: '',
        dropType: 'fixed',
        dropAmountFrom: '',
        dropAmountTo: '',
      }),
    );

    newForm.ftContentItems[0][name] = value;
    console.log(value);

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
    const newForm = Object.assign({}, creationForm);
    newForm.nearContentItems = [DEFAULT_NEAR_ITEM];
    creationForm.nftContentItems = [];
    newForm.ftContentItems = [DEFAULT_FT_ITEM];
    onCreationFormUpdate(creationForm);
    // onChangeRadioLoot;
    onCreationFormUpdate(newForm);
  }, []);

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.div}>
        <div className={styles.divBtn}>
          <ButtonsSetting classNameToken={styles.btnToken} />
        </div>

        <div className={cn(styles.wrapperTokenAmount)}>
          <div className={cn(styles.tokenAmount)}>
            <LabelSettings title="Token amount" />
            <div className={cn(styles.tokenInput)}>
              <InputPanel
                type="string"
                appearance="default"
                placeholder="Token amount"
                pattern="^[0-9]\d*.{2}$"
              />
              <RadioButton
                value="$NEAR"
                title="$NEAR"
                name="TokenAmount"
                id="1_amount"
                defaultChecked={true}
                onChange={onChangeRadioLoot}
              />
              <RadioButton
                value="Custom token"
                title="Custom token"
                name="TokenAmount"
                id="2_amount"
                onChange={onChangeRadioLoot}
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
                  onChange={(e) => {
                    changeHandlerFT.call(null, 'contractAddress', e.target.value);
                  }}
                  pattern="^[0-9]\d*.{2}$"
                />
                <InputPanel
                  type="text"
                  appearance="small"
                  placeholder="Token ticker "
                  // TOKEN TICKER BY INTERFACE

                  onChange={(e) => e.target.value}
                  // name="Token ticker"
                  pattern="^[0-9]\d*.{2}$"
                />
              </div>
              <div className={cn(styles.LabelSettings)}>
                <LabelSettings title="Drop amount" />
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
                    onChange={(e) => {
                      changeHandlerFT.call(null, 'dropAmountFrom', e.target.value);
                    }}
                    pattern="^[0-9]\d*.{2}$"
                  />
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    onChange={(e) => {
                      changeHandlerFT.call(null, 'dropAmountTo', e.target.value);
                    }}
                    pattern="^[0-9]\d*.{2}$"
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  onChange={(e) => {
                    changeHandlerFT.call(null, 'dropAmountTo', e.target.value);
                    changeHandlerFT.call(null, 'dropAmountFrom', e.target.value);
                  }}
                  pattern="^[0-9]\d*.{2}$"
                />
              )}
            </div>
          )) || (
            <div className={cn(styles.dropAmount)}>
              <div className={cn(styles.LabelSettings)}>
                <LabelSettings title="Drop amount" className={cn(styles.LabelSettings)} />
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
                    onChange={(e) => {
                      changeHandler.call(null, 'dropAmountFrom', e.target.value);
                    }}
                    pattern="^[0-9]\d*.{2}$"
                  />
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    onChange={(e) => changeHandler.call(null, 'dropAmountTo', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  pattern="^[0-9]\d*.{2}$"
                  onChange={(e) => {
                    changeHandler.call(null, 'dropAmountTo', e.target.value);
                    changeHandler.call(null, 'dropAmountFrom', e.target.value);
                  }}
                />
              )}
            </div>
          )}

          <div className={cn(styles.dropChance)}>
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
      <div className={cn(styles.navigation)}>
        <Link to="/select_box">
          <LinksStep step="prev" label="Back" />
        </Link>
        <Link to="/fill_your_box">
          <LinksStep step="next" label="Next step" />
        </Link>
      </div>
    </div>
  );
};
