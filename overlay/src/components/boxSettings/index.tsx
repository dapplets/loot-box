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

export interface ChildComponentProps {
  number?: number;
  onDeleteChild?: () => void;
  creationForm: Lootbox;
  // onCreationFormUpdate: (x: Lootbox) => void;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const [isShowDescription_CustomNFT, onShowDescription_CustomNFT] = useToggle(false);
  const {
    number,
    onDeleteChild,
    creationForm,
    // onCreationFormUpdate
  } = props;

  const [valueInp, setValueInp] = useState(0);
  const [valueInpT, setValueInpT] = useState(0);
  const [valueRadio, setValueRadio] = useState('');

  const onChangeQ: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueInp(Number(e.target.value));
    // setValue(e.target.value);
  };
  const onChangeT: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueInpT(Number(e.target.value));
    // setValue(e.target.value);
  };
  const onChangeRadio: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueRadio(e.target.value);
    onShowDescription_CustomNFT();
    // setValue(e.target.value);
  };
  creationForm.nftContentItems.push({
    contractAddress: valueRadio,
    quantity: valueInp,
    tokenId: valueInpT,
  });

  return (
    <div className={styles.addNftBlock}>
      <LabelSettings title="Marketplace" />
      <div className={styles.radiobtnMarketplace}>
        <RadioButton
          id={`1_marketplace${number}`}
          value="Paras"
          name={`Marketplace${number}`}
          onChange={onChangeRadio}
        />
        <RadioButton
          id={`2_marketplace${number}`}
          value="Minbase"
          name={`Marketplace${number}`}
          onChange={onChangeRadio}
        />
        <RadioButton
          id={`3_marketplace${number}`}
          value="Custom NFT"
          name={`Marketplace${number}`}
          onChange={onChangeRadio}
          // onChange={onShowDescription_CustomNFT}
          // key={item}
        />
      </div>
      <div className={styles.addNFT}>
        {(isShowDescription_CustomNFT && (
          <div className={styles.inputCustomNFT}>
            <InputPanel
              type="string"
              appearance="medium_big"
              placeholder="Token ID"
              onChange={onChangeT}
            />
            <InputPanel
              type="string"
              appearance="small_mini"
              placeholder="Quantity"
              onChange={onChangeQ}
            />
          </div>
        )) || (
          <div className={styles.inputCustomNFT}>
            <InputPanel
              type="string"
              appearance="medium_big"
              placeholder="Token ID"
              onChange={onChangeT}
            />
            <InputPanel
              type="string"
              appearance="small_mini"
              placeholder="Quantity"
              onChange={onChangeQ}
            />
          </div>
        )}

        <Button
          onClick={onDeleteChild}
          isShowDescription={false}
          btnText="Remove NFT"
          appearance="remove"
        />
      </div>
    </div>
  );
};

export const SettingDef: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { creationForm, onCreationFormUpdate } = props;

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle isActive={true} title="Box settings" />
      <div className={styles.div}>
        <div className={cn(styles.loot)}>
          <LabelSettings title="Loot" />
          <div className={cn(styles.buttons)}>
            <Link to="/settings_token" className={styles.btnLink}>
              <Button
                appearance="medium"
                isShowDescription
                btnText="Token"
                // onClick={UpdateFormNft}
              />
            </Link>
            <Link to="/settings_NFT" className={styles.btnLink}>
              <Button
                appearance="medium"
                isShowDescription
                btnText="NFT"
                // onClick={UpdateFormNear}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsNFT: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const { creationForm, onCreationFormUpdate } = props;
  const [valueDrop, setValue] = useState(20);
  const [valueInp, setValueInp] = useState(0);
  const [valueInpT, setValueInpT] = useState(0);
  const [valueRadio, setValueRadio] = useState('');
  const [isShowDescription_CustomNFT, onShowDescription_CustomNFT] = useToggle(false);
  const [objArr, setValueArr] = useState(creationForm.nftContentItems);
  const [numChildren, onCount] = useState(0);
  const onAddChild = () => {
    onCount(numChildren + 1);

    onCreationFormUpdate(creationForm);
    console.log(creationForm);
  };
  const onDeleteChild = () => {
    onCount(numChildren - 1);
    // сделать filter

    onCreationFormUpdate(creationForm);
  };
  const children = [];
  const children_btn = [];
  for (let i = 0; i < numChildren; i += 1) {
    children.push(
      <ChildComponent
        creationForm={creationForm}
        // onCreationFormUpdate={onCreationFormUpdate}
        // onCreationFormUpdate={() => {}}
        onDeleteChild={onDeleteChild}
        key={i}
        number={i}
      />,
    );
  }
  for (let i = 0; i < numChildren && i < 1; i += 1) {
    children_btn.push(
      <Button
        onClick={onDeleteChild}
        isShowDescription={false}
        btnText="Remove NFT"
        appearance="remove"
        key={i}
        style={{
          marginBottom: '39px ',
        }}
      />,
    );
  }

  creationForm.nftContentItems = [
    {
      contractAddress: valueRadio,
      quantity: valueInp,
      tokenId: valueInpT,
    },
  ];
  creationForm.nearContentItems = [];
  creationForm.ftContentItems = [];
  creationForm.dropChance = valueDrop;
  // onCreationFormUpdate(creationForm);
  console.log(creationForm);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setValue(Number(e.target.value));
    // setValue(e.target.value);
  };
  const onChangeQ: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueInp(Number(e.target.value));
  };
  const onChangeT: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueInpT(Number(e.target.value));
  };
  const onChangeRadio: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueRadio(e.target.value);
    onShowDescription_CustomNFT();

    // setValue(e.target.value);
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle isActive={true} title="Box settings" />

      <div className={styles.div}>
        <div className={cn(styles.loot)}>
          <LabelSettings title="Loot" />
          <div className={cn(styles.buttons)}>
            <Link to="/settings_token" className={styles.btnLink}>
              <Button appearance="medium" isShowDescription btnText="Token" />
            </Link>
            <Link to="/settings_NFT" className={styles.btnLink}>
              <Button
                appearance="medium"
                isShowDescription
                btnText="NFT"
                style={{
                  backgroundColor: '#D9304F',
                  color: '#fff',
                }}
              />
            </Link>
          </div>
        </div>
        <div className={styles.wrapper_nft}>
          <div className={styles.Marketplace}>
            {children}

            <LabelSettings title="Marketplace" />
            <div className={styles.radiobtnMarketplace}>
              <RadioButton
                id="1_marketplace"
                title="Paras"
                value="Paras"
                name="Marketplace"
                onChange={onChangeRadio}
              />
              <RadioButton
                id="2_marketplace"
                title="Minbase"
                value="Minbase"
                name="Marketplace"
                onChange={onChangeRadio}
              />
              <RadioButton
                id="3_marketplace"
                title="Custom NFT"
                value="Custom NFT"
                name="Marketplace"
                // defaultChecked={true}
                onChange={onChangeRadio}
                // defaultChecked={true}
              />
            </div>
            {(isShowDescription_CustomNFT && (
              <div className={styles.customNFT}>
                <div className={styles.addNFT}>
                  <div className={styles.inputCustomNFT}>
                    <InputPanel
                      // creationForm={creationForm}
                      // onCreationFormUpdate={onCreationFormUpdate}
                      type="string"
                      appearance="medium_big"
                      placeholder="Token ID"
                      onChange={onChangeT}
                    />
                    <InputPanel
                      // onChange={onChange}
                      // creationForm={creationForm}
                      // onCreationFormUpdate={onCreationFormUpdate}
                      type="string"
                      appearance="small_mini"
                      placeholder="Quantity"
                      onChange={onChangeQ}
                    />
                  </div>
                  {children_btn}
                  <Button
                    // onClick={clickCount}
                    onClick={onAddChild}
                    isShowDescription={false}
                    btnText="Add NFT"
                    appearance="small"
                  />
                </div>

                <div className={styles.dropChance_nft}>
                  <LabelSettings title="Drop Chance" />
                  <DropChance
                    type="number"
                    max="100"
                    min="0"
                    onChange={onChange}
                    value={valueDrop}
                  />
                </div>
              </div>
            )) || (
              <div className={styles.customNFT}>
                <div className={styles.addNFT}>
                  <div className={styles.inputCustomNFT}>
                    <InputPanel
                      // creationForm={creationForm}
                      // onCreationFormUpdate={onCreationFormUpdate}
                      type="string"
                      appearance="medium_big"
                      placeholder="Token ID"
                      onChange={onChangeT}
                    />
                    <InputPanel
                      // onChange={onChange}
                      // creationForm={creationForm}
                      // onCreationFormUpdate={onCreationFormUpdate}
                      type="string"
                      appearance="small_mini"
                      placeholder="Quantity"
                      onChange={onChangeQ}
                    />
                  </div>
                  {children_btn}
                  <Button
                    // onClick={clickCount}
                    onClick={onAddChild}
                    isShowDescription={false}
                    btnText="Add NFT"
                    appearance="small"
                  />
                </div>

                <div className={styles.dropChance_nft}>
                  <LabelSettings title="Drop Chance" />
                  <DropChance
                    type="number"
                    max="100"
                    min="0"
                    onChange={onChange}
                    value={valueDrop}
                  />
                </div>
              </div>
            )}
            {/* <div className={styles.customNFT}>
              <div className={styles.addNFT}>
                <div className={styles.inputCustomNFT}>
                  <InputPanel
                    creationForm={creationForm}
                    onCreationFormUpdate={onCreationFormUpdate}
                    type="string"
                    appearance="medium_big"
                    placeholder="Token ID"
                    onChange={onChangeT}
                  />
                  <InputPanel
                    // onChange={onChange}
                    creationForm={creationForm}
                    onCreationFormUpdate={onCreationFormUpdate}
                    type="string"
                    appearance="small_mini"
                    placeholder="Quantity"
                    onChange={onChangeQ}
                  />
                </div>
                {children_btn}
                <Button
                  // onClick={clickCount}
                  onClick={onAddChild}
                  isShowDescription={false}
                  btnText="Add NFT"
                  appearance="small"
                />
              </div>

              <div className={styles.dropChance_nft}>
                <LabelSettings title="Drop Chance" />
                <DropChance type="number" max="100" min="0" onChange={onChange} value={valueDrop} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className={cn(styles.navigation)}>
        <Link to="/select_box">
          <LinksStep step="prev" label="Back" icon={PrevStep} />
        </Link>
        <Link to="/fill_your_box_nft">
          <LinksStep step="next" label="Next step" icon={NextStep} />
        </Link>
      </div>
    </div>
  );
};

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
    console.log(valueRadioDropType);
  };

  // creationForm.nearContentItems = [
  //   {
  //     tokenAmount: valueInputTokenAmount,
  //     dropType: valueRadioDropType,
  //     dropAmountFrom: valueInputTokenFrom,
  //     dropAmountTo: valueInputTokenTo,
  //   },
  // ];

  // creationForm.ftContentItems = [
  //   {
  //     contractAddress: valueInputTokenContract,
  //     tokenAmount: valueInputTokenAmount,
  //     dropType: valueRadioDropType,
  //     dropAmountFrom: valueInputTokenFrom,
  //     dropAmountTo: valueInputTokenFrom,
  //   },
  // ];

  creationForm.nftContentItems = [];

  creationForm.dropChance = value;

  if (isShowDescription_tokenAmount) {
    creationForm.ftContentItems = [
      {
        contractAddress: valueInputTokenContract,
        tokenAmount: valueInputTokenAmount,
        dropType: valueRadioDropType,
        dropAmountFrom: valueInputTokenFrom,
        dropAmountTo: valueInputTokenFrom,
      },
    ];
    creationForm.nearContentItems = [];
  } else {
    creationForm.nearContentItems = [
      {
        tokenAmount: valueInputTokenAmount,
        dropType: valueRadioDropType,
        dropAmountFrom: valueInputTokenFrom,
        dropAmountTo: valueInputTokenTo,
      },
    ];
    creationForm.ftContentItems = [];
  }

  console.log(isShowDescription_tokenAmount);
  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle isActive={true} title="Box settings" />
      <div className={styles.div}>
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
                // creationForm={creationForm}
                // onCreationFormUpdate={onCreationFormUpdate}
                type="text"
                appearance="default"
                placeholder="Token amount"
                onChange={onChangeTokenAmount}
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
                // onChange={onShowDescription_custom}
              />
            </div>
          </div>
          {(isShowDescription_tokenAmount && (
            <div className={cn(styles.dropAmount)}>
              <div className={cn(styles.inputDropAmount)}>
                <InputPanel
                  // creationForm={creationForm}
                  // onCreationFormUpdate={onCreationFormUpdate}
                  type="text"
                  appearance="medium"
                  placeholder="Token contract"
                  onChange={onChangeTokenContract}
                />
                <InputPanel
                  // creationForm={creationForm}
                  // onCreationFormUpdate={onCreationFormUpdate}
                  type="text"
                  appearance="small"
                  placeholder="Token ticker "
                  onChange={onChangeTokenTicker}
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
                    // creationForm={creationForm}
                    // onCreationFormUpdate={onCreationFormUpdate}
                    type="text"
                    appearance="small_medium"
                    placeholder="From"
                    onChange={onChangeTokenFrom}
                  />
                  <InputPanel
                    // creationForm={creationForm}
                    // onCreationFormUpdate={onCreationFormUpdate}
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    onChange={onChangeTokenTo}
                  />
                </div>
              )) || (
                <InputPanel
                  // creationForm={creationForm}
                  // onCreationFormUpdate={onCreationFormUpdate}
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  onChange={onChangeDropAmount}
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
                    // creationForm={creationForm}
                    // onCreationFormUpdate={onCreationFormUpdate}
                    type="text"
                    appearance="small_medium"
                    placeholder="From"
                    onChange={onChangeTokenFrom}
                  />
                  <InputPanel
                    // creationForm={creationForm}
                    // onCreationFormUpdate={onCreationFormUpdate}
                    type="text"
                    appearance="small_medium"
                    placeholder="To"
                    onChange={onChangeTokenTo}
                  />
                </div>
              )) || (
                <InputPanel
                  // creationForm={creationForm}
                  // onCreationFormUpdate={onCreationFormUpdate}
                  type="text"
                  appearance="biggest"
                  placeholder="Drop amount"
                  onChange={onChangeDropAmount}
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
          <LinksStep step="prev" label="Back" icon={PrevStep} />
        </Link>
        <Link to="/fill_your_box">
          <LinksStep step="next" label="Next step" icon={NextStep} />
        </Link>
      </div>
    </div>
  );
};
