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
// import { Test } from '../atoms/test';
import { DropChance } from '../atoms/DropChance';
import { Lootbox } from '../../../../common/interfaces';
import { NearContentItem, FtContentItem } from '../../../../common/interfaces';

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

  useEffect(() => {
    // ToDo: move to App.tsx
    // ToDo: how to get rid of object coping?
    const newForm = Object.assign({}, creationForm);
    newForm.nearContentItems = [DEFAULT_NEAR_ITEM];
    newForm.nftContentItems = [];
    newForm.ftContentItems = [DEFAULT_FT_ITEM];
    onCreationFormUpdate(newForm);
    console.log(creationForm);
  }, []);

  useEffect(() => {
    // onCreationFormUpdate((creationForm.dropChance = value));
    creationForm.dropChance = value;
    onCreationFormUpdate(creationForm);
    console.log({ value });
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
  };

  const changeHandlerFT = (name: keyof FtContentItem, value: any) => {
    const newForm = Object.assign({}, creationForm);
    (newForm as any)[name] = value;

    newForm.ftContentItems[0][name] = value;
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle isActive={true} title="Box settings" />
      <div className={styles.div}>
        {/* ToDo: move to separated component */}
        <div className={cn(styles.loot)}>
          <LabelSettings title="Loot" />
          <div className={cn(styles.buttons)}>
            <Link to="/settings_token" className={styles.btnLink}>
              <Button
                appearance="medium"
                isShowDescription
                btnText="Token"
                style={{
                  backgroundColor: '#D9304F',
                  color: '#fff',
                }}
              />
            </Link>
            <Link to="/settings_NFT" className={styles.btnLink}>
              <Button appearance="medium" isShowDescription color="disable" btnText="NFT" />
            </Link>
          </div>
        </div>

        <div className={cn(styles.wrapperTokenAmount)}>
          <div className={cn(styles.tokenAmount)}>
            <LabelSettings title="Token amount" />
            <div className={cn(styles.tokenInput)}>
              <InputPanel
                type="string"
                appearance="default"
                placeholder="Token amount"
                onChange={(e) => changeHandler('tokenAmount', e.target.value)}
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
                  onChange={(e) => changeHandlerFT('contractAddress', e.target.value)}
                  pattern="^[0-9]\d*.{2}$"
                />
                <InputPanel
                  type="text"
                  appearance="small"
                  placeholder="Token ticker "
                  onChange={(e) => changeHandlerFT('contractAddress', e.target.value)}
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
                  // defaultChecked={true}
                  // onChange={onChangeRadioDropType}
                  checked={DEFAULT_FT_ITEM.dropType === 'fixed'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeHandlerFT('dropType', 'fixed');
                      // onChangeRadioDropType;
                    }
                    onChangeRadioDropType(e);
                  }}
                />
                <RadioButton
                  value="Variable"
                  title="Variable"
                  name="dropAmount"
                  id="4_Drop"
                  // onChange={onChangeRadioDropType}
                  checked={DEFAULT_FT_ITEM.dropType === 'variable'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeHandlerFT('dropType', 'variable');
                      // onChangeRadioDropType;
                    }
                    onChangeRadioDropType(e);
                  }}
                />
              </div>
              {(isShowDescription_dropAmount && (
                <div className={cn(styles.dropAmountInput)}>
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="From"
                    onChange={(e) => changeHandlerFT('dropAmountFrom', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    onChange={(e) => changeHandlerFT('dropAmountTo', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  onChange={(e) => {
                    changeHandlerFT('dropAmountFrom', e.target.value);
                    changeHandlerFT('dropAmountTo', e.target.value);
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
                  // defaultChecked={true}
                  checked={DEFAULT_NEAR_ITEM.dropType === 'fixed'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeHandler('dropType', 'fixed');
                      // onChangeRadioDropType;
                    }
                    onChangeRadioDropType(e);
                  }}
                />
                <RadioButton
                  value="Variable"
                  title="Variable"
                  name="dropAmount"
                  id="4_Drop"
                  checked={DEFAULT_NEAR_ITEM.dropType === 'variable'}
                  // onChange={onChangeRadioDropType}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeHandler('dropType', 'variable');
                    }
                    onChangeRadioDropType(e);
                  }}
                />
              </div>
              {(isShowDescription_dropAmount && (
                <div className={cn(styles.dropAmountInput)}>
                  <InputPanel
                    type="string"
                    appearance="small_medium"
                    placeholder="From"
                    onChange={(e) => changeHandler('dropAmountFrom', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                  <InputPanel
                    type="string"
                    appearance="small_medium"
                    placeholder="To"
                    onChange={(e) => changeHandler('dropAmountTo', e.target.value)}
                    pattern="^[0-9]\d*.{2}$"
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  // onChange={onChangeDropAmount}
                  onChange={(e) => {
                    changeHandler('dropAmountFrom', e.target.value);
                    changeHandler('dropAmountTo', e.target.value);
                  }}
                  pattern="^[0-9]\d*.{2}$"
                />
              )}
            </div>
          )}

          <div className={cn(styles.dropChance)}>
            <LabelSettings title="Drop Chance" />

            <DropChance
              type="string"
              max="100"
              min="0"
              _value={`${value}`}
              _onValueChange={(newValue: any) => setValue(+newValue)}
              value={value}
              setValue={setValue}
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
