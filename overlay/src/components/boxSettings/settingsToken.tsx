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

import { SettingTitle } from '../atoms/SettingTitle';
import { LabelSettings } from '../atoms/LabelSettings';
import { Button } from '../atoms/Button';
import { LinksStep } from '../atoms/LinksStep';
import { Link } from 'react-router-dom';
import NextStep from '../../icons/selectBox/NextStep.svg';
import PrevStep from '../../icons/selectBox/prevStep.svg';

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
  const [valueRadioDropType, setValueRadioDropType] = useState('');
  const [value, setValue] = React.useState(20);
  const [ftItem, setFtItem] = useState(DEFAULT_FT_ITEM);
  const [nearItem, setNearItem] = useState(DEFAULT_NEAR_ITEM);

  useEffect(() => {
    // onCreationFormUpdate((creationForm.dropChance = value));
    creationForm.dropChance = value;
    onCreationFormUpdate(creationForm);
    // console.log({ value });
  });

  const onChangeRadioLoot: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueRadioLoot(e.target.value);
    onShowDescription_tokenAmount();
  };

  const onChangeRadioDropType: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueRadioDropType(String(e.target.value));
    onShowDescription_dropAmount();
  };

  const changeHandler = (name: keyof NearContentItem, value: any) => {
    const newForm = Object.assign({}, creationForm);
    (newForm as any)[name] = value;

    newForm.nearContentItems[0][name] = value;

    console.log(value);
    onCreationFormUpdate(newForm);

    // console.log(newForm);
  };

  const changeHandlerFT = (name: keyof FtContentItem, value: any) => {
    const newForm = Object.assign({}, creationForm);
    // (newForm as any)[name] = value;

    newForm.ftContentItems[0][name] = value;
    console.log(value);

    onCreationFormUpdate(newForm);

    // console.log(newForm);
  };

  // const changeHandlerFT = (e: ChangeEvent<HTMLInputElement>) => {
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
    newForm.nftContentItems = [];
    newForm.ftContentItems = [DEFAULT_FT_ITEM];

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
                // onChange={(e) => changeHandler.call(null, 'tokenAmount', e.target.value)}
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
                  // name="contractAddress"
                  // onChange={changeHandlerFT}

                  value={creationForm.ftContentItems[0].contractAddress ?? ''}
                  onChange={(e) => changeHandlerFT.call(null, 'contractAddress', e.target.value)}
                  pattern="^[0-9]\d*.{2}$"
                />
                <InputPanel
                  type="text"
                  appearance="small"
                  placeholder="Token ticker "
                  // onChange={changeHandlerFT}
                  // value={creationForm.ftContentItems[0].dropAmountFrom ?? ''}

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
                  onChange={onShowDescription_dropAmount}
                  // checked={ftItem.dropType === 'fixed'}
                  // onChange={() =>
                  //   setFtItem((prevState: any) => ({
                  //     ...prevState,
                  //     dropType: 'fixed',
                  //   }))
                  // }
                />
                <RadioButton
                  value="Variable"
                  title="Variable"
                  name="dropAmount"
                  id="4_Drop"
                  onChange={onShowDescription_dropAmount}
                  // checked={ftItem.dropType === 'variable'}
                  // onChange={() =>
                  //   setFtItem((prevState: any) => ({
                  //     ...prevState,
                  //     dropType: 'variable',
                  //   }))
                  // }
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     changeHandlerFT.bind('variable', 'dropType');
                  //   }
                  //   onChangeRadioDropType(e);
                  // }}
                />
              </div>
              {(isShowDescription_dropAmount && (
                <div className={cn(styles.dropAmountInput)}>
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="From"
                    // onChange={changeHandlerFT}
                    // name="dropAmountFrom"

                    value={creationForm.ftContentItems[0].dropAmountFrom ?? ''}
                    onChange={(e) => changeHandlerFT.call(null, 'dropAmountFrom', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    // onChange={changeHandlerFT}
                    // name="dropAmountTo"

                    value={creationForm.ftContentItems[0].dropAmountTo ?? ''}
                    onChange={(e) => changeHandlerFT.call(null, 'dropAmountTo', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  value={creationForm.ftContentItems[0].dropAmountFrom ?? ''}
                  onChange={
                    (e) => changeHandlerFT.call(null, 'dropAmountFrom', e.target.value)
                    // changeHandlerFT.call(null, 'dropAmountTo', e.target.value);
                  }
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
                  // checked={creationForm.nearContentItems[0].dropType === 'fixed'}
                  // checked={DEFAULT_NEAR_ITEM.dropType === 'fixed'}
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     changeHandler.bind('fixed', 'dropType');
                  //   }
                  //   onChangeRadioDropType(e);
                  // }}
                  onChange={onShowDescription_dropAmount}
                />
                <RadioButton
                  value="Variable"
                  title="Variable"
                  name="dropAmount"
                  id="4_Drop"
                  // checked={creationForm.nearContentItems[0].dropType === 'variable'}
                  // onChange={onChangeRadioDropType}
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     changeHandler.bind('variable', 'dropType');
                  //   }
                  //   onChangeRadioDropType(e);
                  // }}
                  onChange={onShowDescription_dropAmount}
                />
              </div>
              {(isShowDescription_dropAmount && (
                <div className={cn(styles.dropAmountInput)}>
                  <InputPanel
                    type="string"
                    appearance="small_medium"
                    placeholder="From"
                    // onChange={changeHandlerFT}
                    // name="dropAmountFrom"

                    value={creationForm.nearContentItems[0].dropAmountFrom ?? ''}
                    onChange={(e) => changeHandler.call(null, 'dropAmountFrom', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                  <InputPanel
                    type="string"
                    appearance="small_medium"
                    placeholder="To"
                    // onChange={changeHandlerFT}
                    // name="dropAmountTo"

                    value={creationForm.nearContentItems[0].dropAmountTo ?? ''}
                    onChange={(e) => changeHandler.call(null, 'dropAmountTo', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  // onChange={onChangeDropAmount}

                  // value={creationForm.nearContentItems[0].dropAmountFrom ?? ''}
                  // onChange={
                  //   (e) => changeHandler.call(null, 'dropAmountFrom', e.target.value)
                  //   // changeHandler.call(null, 'dropAmountTo', e.target.value);
                  // }
                  pattern="^[0-9]\d*.{2}$"
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
