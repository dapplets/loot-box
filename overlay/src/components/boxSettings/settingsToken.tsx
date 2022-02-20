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
import { Item } from 'semantic-ui-react';
import { info } from 'console';

export interface BoxSettingsProps {
  children?: ReactNode;
  onChange?: () => void;
  onSubmit?: () => void;
  dataType?: string;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: any) => void;
}

export const SettingsToken: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { creationForm, onCreationFormUpdate } = props;
  const [isShowDescription_tokenAmount, onShowDescription_tokenAmount] = useToggle(false);
  const [isShowDescription_dropAmount, onShowDescription_dropAmount] = useToggle(false);
  const [value, setValue] = useState(20);

  const [valueInputTokenAmount, setValueInputTokenAmount] = useState('');
  const [valueInputTokenContract, setValueInputTokenContract] = useState('');
  const [valueInputTokenTicker, setValueInputTokenTicker] = useState('');
  const [valueInputTokenFrom, setValueInputTokenFrom] = useState('');
  const [valueInputTokenTo, setValueInputTokenTo] = useState('');
  const [valueInputDropAmount, setValueInputDropAmount] = useState('');

  const [valueRadio, setValueRadioLoot] = useState('');
  const [valueRadioDropType, setValueRadioDropType] = useState('');

  // useEffect(() => {

  //   }
  //   console.log(creationForm, 'ещлут');
  // }, []);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(Number(e.target.value));
    // setValue(e.target.value);
  };
  const onChangeTokenAmount: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValueInputTokenAmount(e.target.value);
    // setValue(e.target.value);
  };
  const onChangeTokenContract: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValueInputTokenContract(e.target.value);
    // setValue(e.target.value);
  };
  const onChangeTokenTicker: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValueInputTokenTicker(e.target.value);
    // setValue(e.target.value);
  };
  const onChangeTokenFrom: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValueInputTokenFrom(e.target.value);
    // setValue(e.target.value);
  };
  const onChangeTokenTo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValueInputTokenTo(e.target.value);
    // setValue(e.target.value);
  };
  const onChangeDropAmount: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValueInputDropAmount(e.target.value);
    // setValue(e.target.value);
  };

  const onChangeRadioLoot: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    setValueRadioLoot(e.target.value);
    onShowDescription_tokenAmount();

    // setValue(e.target.value);
    onCreationFormUpdate(creationForm);
  };

  const onChangeRadioDropType: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // e.preventDefault();
    // e.stopPropagation();

    setValueRadioDropType(String(e.target.value));
    onShowDescription_dropAmount();
    // console.log(valueRadioDropType);
  };

  creationForm.nftContentItems = [];
  creationForm.dropChance = value;

  if (isShowDescription_tokenAmount) {
    creationForm.ftContentItems = [
      {
        contractAddress: valueInputTokenContract,
        tokenAmount: valueInputTokenAmount,
        dropType: valueRadioDropType as any, // ToDo: fix it
        dropAmountFrom: valueInputTokenFrom,
        dropAmountTo: valueInputTokenFrom,
      },
    ];
    creationForm.nearContentItems = [];
  } else {
    creationForm.nearContentItems = [
      {
        tokenAmount: valueInputTokenAmount,
        dropType: valueRadioDropType as any, // ToDo: fix it
        dropAmountFrom: valueInputTokenFrom,
        dropAmountTo: valueInputTokenTo,
      },
    ];
    creationForm.ftContentItems = [];
  }

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
                type="text"
                appearance="default"
                placeholder="Token amount"
                onChange={onChangeTokenAmount}
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
                  onChange={onChangeTokenContract}
                  pattern="^[0-9]\d*.{2}$"
                />
                <InputPanel
                  type="text"
                  appearance="small"
                  placeholder="Token ticker "
                  onChange={onChangeTokenTicker}
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
                  onChange={onChangeRadioDropType}
                />
                <RadioButton
                  value="Variable"
                  title="Variable"
                  name="dropAmount"
                  id="4_Drop"
                  onChange={onChangeRadioDropType}
                />
              </div>
              {(isShowDescription_dropAmount && (
                <div className={cn(styles.dropAmountInput)}>
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="From"
                    onChange={onChangeTokenFrom}
                    pattern="^[0-9]\d*.{2}$"
                  />
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    onChange={onChangeTokenTo}
                    pattern="^[0-9]\d*.{2}$"
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  onChange={onChangeDropAmount}
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
                  defaultChecked={true}
                  onChange={onChangeRadioDropType}
                />
                <RadioButton
                  value="Variable"
                  title="Variable"
                  name="dropAmount"
                  id="4_Drop"
                  onChange={onChangeRadioDropType}
                />
              </div>
              {(isShowDescription_dropAmount && (
                <div className={cn(styles.dropAmountInput)}>
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="From"
                    onChange={onChangeTokenFrom}
                    pattern="^[0-9]\d*.{2}$"
                  />
                  <InputPanel
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    onChange={onChangeTokenTo}
                    pattern="^[0-9]\d*.{2}$"
                  />
                </div>
              )) || (
                <InputPanel
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  onChange={onChangeDropAmount}
                  pattern="^[0-9]\d*.{2}$"
                />
              )}
            </div>
          )}

          <div className={cn(styles.dropChance)}>
            <LabelSettings title="Drop Chance" />

            <DropChance
              onChange={onChange}
              type="number"
              value={value}
              placeholder="Drop chance"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>
      <div className={cn(styles.navigation)}>
        <Link to="/select_box">
          <LinksStep
            step="prev"
            label="Back"
            // icon={PrevStep}
          />
        </Link>
        <Link to="/fill_your_box">
          <LinksStep
            step="next"
            label="Next step"
            //  icon={NextStep}
          />
        </Link>
      </div>
    </div>
  );
};
