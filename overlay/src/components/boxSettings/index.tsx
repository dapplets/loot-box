import React, { CSSProperties, ReactElement, ReactNode, FC, useState } from 'react';
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
export interface BoxSettingsProps {
  children?: ReactNode;
  onChange?: () => void;
  onSubmit?: () => void;
  dataType?: string;
}

export const BoxSettings: FC<BoxSettingsProps> = (props: BoxSettingsProps) => {
  const [numChildren, onCount] = useState(0);
  const onAddChild = () => {
    onCount(numChildren + 1);
  };
  const onDeleteChild = () => {
    onCount(numChildren - 1);
  };
  const children = [];

  for (let i = 0; i < numChildren; i += 1) {
    children.push(<ChildComponent onDeleteChild={onDeleteChild} key={i} number={i} />);
  }
  // const { defVal } = props;
  const [isShowDescription_token, onShowDescription__token] = useToggle(false);
  const [isShowDescription_nft, onShowDescription_nft] = useToggle(false);
  const [isShowDescription_tokenAmount, onShowDescription_tokenAmount] = useToggle(false);
  const [isShowDescription_dropAmount, onShowDescription_dropAmount] = useToggle(false);
  // Custom NFT
  const [isShowDescription_CustomNFT, onShowDescription_CustomNFT] = useToggle(false);
  const [value, setValue] = useState(20);
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(Number(e.target.value));
    // setValue(e.target.value);
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle isActive={true} title="Box settings" />
      <div className={styles.div}>
        <div className={cn(styles.loot)}>
          <LabelSettings title="Loot" />
          <div className={cn(styles.buttons)}>
            <Button
              appearance="medium"
              isShowDescription={isShowDescription_token}
              btnText="Token"
              onClick={onShowDescription__token}
              style={{
                backgroundColor: isShowDescription_token ? '#D9304F' : 'transparent',
                color: isShowDescription_token ? '#fff' : '#D9304F',
              }}
              disabled={isShowDescription_nft}
            />
            <Button
              appearance="medium"
              isShowDescription={isShowDescription_nft}
              onClick={onShowDescription_nft}
              color="disable"
              btnText="NFT"
              disabled={isShowDescription_token}
              style={{
                backgroundColor: isShowDescription_nft ? '#D9304F' : 'transparent',
                color: isShowDescription_nft ? '#fff' : '#D9304F',
              }}
            />
          </div>
        </div>
        {isShowDescription_token && (
          <div className={cn(styles.wrapperTokenAmount)}>
            <div className={cn(styles.tokenAmount)}>
              <LabelSettings title="Token amount" />
              <div className={cn(styles.tokenInput)}>
                <InputPanel type="text" appearance="default" placeholder="Token amount" />
                <RadioButton
                  value="$NEAR"
                  title="$NEAR"
                  name="TokenAmount"
                  id="1_amount"
                  defaultChecked={true}
                  onChange={onShowDescription_tokenAmount}
                />
                <RadioButton
                  value="Custom token"
                  title="Custom token"
                  name="TokenAmount"
                  id="2_amount"
                  onChange={onShowDescription_tokenAmount}
                  // onChange={onShowDescription_custom}
                />
              </div>
            </div>
            {(isShowDescription_tokenAmount && (
              <div className={cn(styles.dropAmount)}>
                <div className={cn(styles.inputDropAmount)}>
                  <InputPanel type="text" appearance="medium" placeholder="Token contract" />
                  <InputPanel type="text" appearance="small" placeholder="Token ticker " />
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
                  />
                  <RadioButton
                    value="Variable"
                    title="Variable"
                    name="dropAmount"
                    id="4_Drop"
                    onChange={onShowDescription_dropAmount}
                  />
                </div>
                {(isShowDescription_dropAmount && (
                  <div className={cn(styles.dropAmountInput)}>
                    <InputPanel type="text" appearance="small_medium" placeholder="From" />
                    <InputPanel type="text" appearance="small_medium" placeholder="To" />
                  </div>
                )) || <InputPanel type="text" appearance="biggest" placeholder="Drop amount" />}
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
                    onChange={onShowDescription_dropAmount}
                  />
                  <RadioButton
                    value="Variable"
                    title="Variable"
                    name="dropAmount"
                    id="4_Drop"
                    onChange={onShowDescription_dropAmount}
                  />
                </div>
                {(isShowDescription_dropAmount && (
                  <div className={cn(styles.dropAmountInput)}>
                    <InputPanel type="text" appearance="small_medium" placeholder="From" />
                    <InputPanel type="text" appearance="small_medium" placeholder="To" />
                  </div>
                )) || <InputPanel type="text" appearance="biggest" placeholder="Drop amount" />}
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
        )}

        {isShowDescription_nft && (
          <div className={styles.wrapper_nft}>
            <div className={styles.Marketplace}>
              {children}

              <LabelSettings title="Marketplace" />
              <div className={styles.radiobtnMarketplace}>
                <RadioButton id="1_marketplace" value="Paras" name="Marketplace" />
                <RadioButton id="2_marketplace" value="Minbase" name="Marketplace" />
                <RadioButton
                  id="3_marketplace"
                  value="Custom NFT"
                  name="Marketplace"
                  // defaultChecked={true}
                  onChange={onShowDescription_CustomNFT}
                />
              </div>
              {isShowDescription_CustomNFT && (
                <>
                  <div className={styles.customNFT}>
                    <div className={styles.addNFT}>
                      <div className={styles.inputCustomNFT}>
                        <InputPanel type="string" appearance="medium_big" placeholder="Token ID" />
                        <InputPanel type="string" appearance="small_mini" placeholder="Quantity" />
                      </div>
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
                        value={value}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isShowDescription_token && (
        <div className={cn(styles.navigation)}>
          <Link to="/select_box">
            <LinksStep step="prev" label="Back" icon={PrevStep} />
          </Link>
          <Link to="/fill_your_box">
            <LinksStep step="next" label="Next step" icon={NextStep} />
          </Link>
        </div>
      )}
      {isShowDescription_nft && (
        <div className={cn(styles.navigation)}>
          <Link to="/select_box">
            <LinksStep step="prev" label="Back" icon={PrevStep} />
          </Link>
          <Link to="/fill_your_box_nft">
            <LinksStep step="next" label="Next step" icon={NextStep} />
          </Link>
        </div>
      )}

      <div
        style={{ display: isShowDescription_nft || isShowDescription_token ? 'none' : 'flex' }}
        className={cn(styles.navigation)}
      >
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

export interface ChildComponentProps {
  number: number;
  onDeleteChild: () => void;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const { number, onDeleteChild } = props;
  return (
    <div className={styles.addNftBlock}>
      <LabelSettings title="Marketplace" />
      <div className={styles.radiobtnMarketplace}>
        <RadioButton id={`1_marketplace${number}`} value="Paras" name={`Marketplace${number}`} />
        <RadioButton id={`2_marketplace${number}`} value="Minbase" name={`Marketplace${number}`} />
        <RadioButton
          id={`3_marketplace${number}`}
          value="Custom NFT"
          name={`Marketplace${number}`}
          // onChange={onShowDescription_CustomNFT}
          // key={item}
        />
      </div>
      <div className={styles.addNFT}>
        <div className={styles.inputCustomNFT}>
          <InputPanel type="string" appearance="medium_big" placeholder="Token ID" />
          <InputPanel type="string" appearance="small_mini" placeholder="Quantity" />
        </div>
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
