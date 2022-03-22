import React, { useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import styles from './App.module.scss';

import { useToggle } from './hooks/useToggle';
import { Routes, Route, Link } from 'react-router-dom';

import GeneralBridge from '@dapplets/dapplet-overlay-bridge';
import {
  IDappletApi,
  Lootbox,
  LootboxStat,
  LootboxWinner,
  BoxCreationPrice,
} from '../../common/interfaces';

import { StatisticsNear, StatisticsWinners, StatisticsCode } from './components/statisticsNear';
import { DeployBox } from './components/deployBox';
import { Profile } from './components/atoms/Profile';
import SelectBox, { IMG } from './components/selectBox';
import { FillBox } from './components/fillBox';
import { FillBox_Nft } from './components/FillBoxNFT';
import { ChildComponent } from './components/createNewBox';
import { LogInButton } from './components/atoms/LoginButtons';
import CreateNewBox from './components/createNewBox';

import { SettingDef } from './components/boxSettings';
import { SettingsToken } from './components/boxSettings/settingsToken';
import { SettingsNFT } from './components/boxSettings/settingsNft';

import { Preloader } from './components/atoms/Preloader';

interface ICtx {
  authorFullname: string;
  authorUsername?: string;
  authorImg: string;
  id: string;
  text: string;

  isOpen?: boolean;
}

const dappletApi = new GeneralBridge<IDappletApi>();

const EMPTY_FORM: Lootbox = {
  dropChance: 20,
  ftContentItems: [],
  nftContentItems: [],
  nearContentItems: [],
  pictureId: 0,
  id: 0,
  status: 'created',
};

(async () => {
  await dappletApi.clearAll();
})();

export default () => {
  const [parsedCtx, setParsedCtx] = useState<ICtx>();
  const [nearAccount, setNearAccount] = useState<string>();
  const [isOpenProfile, onOpenProfile] = useToggle(false);
  const [valueLabel, setValueLabel] = useState('');
  const [imgBox, setImgBox] = useState('');
  const [lootboxes, setLootboxes] = useState<Lootbox[]>([]);
  const [winners, setWinners] = useState<LootboxWinner[]>([]);
  const [selectedLootboxId, setSelectedLootboxId] = useState<number | null>(null);
  const [stat, setStat] = useState<LootboxStat | null>(null);

  // TODO: come up with a better name
  const [creationForm, setCreationForm] = useState<Lootbox>(EMPTY_FORM);
  const [clickedBoxImg, setClickedBoxImg] = useState<number | null>(0);
  const [price, setPrice] = useState<BoxCreationPrice | null>(null);
  const [loader, setLoader] = useState(false);

  const [imgSelect, setImgSelect] = useState('');

  const updateImgSelect = (x: string) => {
    setImgSelect(x);
    console.log(imgSelect);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueLabel(e.target.value);
  };

  useEffect(() => {
    dappletApi.on('data', (x: ICtx) => setParsedCtx(x));
    dappletApi.isWalletConnected().then(async (isWalletConnected) => {
      let accountName: string | undefined;
      if (isWalletConnected) {
        accountName = await dappletApi.getCurrentNearAccount();
      }
      setNearAccount(accountName);
    });
  }, []);

  const doneClickHandler = async () => {
    // show loader
    console.log('done');

    setLoader(true);
    await dappletApi.createNewBox(creationForm).then((x) => {
      console.log('created new lootbox with id: ' + x);
    });

    setLoader(false);

    await dappletApi.getBoxesByAccount('dapplets_lootbox.testnet').then((x) => {
      setLootboxes(x);
      console.log('lootboxes', x);
    });
    if (selectedLootboxId === null) return;
  };
  useEffect(() => {
    doneClickHandler;
    selectedLootboxId;
  }, [doneClickHandler, selectedLootboxId]);

  useEffect(() => {
    if (selectedLootboxId === null) return;

    dappletApi
      .getLootboxWinners(selectedLootboxId)
      .then((x) => {
        setWinners(x);
      })
      .catch((e) => {
        console.error('getLootboxWinners', e);

        // ToDo: show error to user
      });
  }, [selectedLootboxId]);

  useEffect(() => {
    if (selectedLootboxId === null) return;
    setLoader(true);
    dappletApi
      .getLootboxStat(selectedLootboxId)
      .then((x) => {
        setStat(x);

        setLoader(false);
      })

      .catch((e) => {
        console.error('getLootboxStat', e);

        // ToDo: show error to user
      });
  }, [selectedLootboxId]);

  useEffect(() => {
    dappletApi
      .calcBoxCreationPrice(creationForm)
      .then((x) => {
        setPrice(x);
      })
      .catch((e) => {
        console.error('getLootboxPrice', e);

        // ToDo: show error to user
      });
  }, []);

  const handleLogIn = async () => {
    const isWalletConnected = await dappletApi.isWalletConnected();
    if (isWalletConnected) {
      await dappletApi.disconnectWallet();
    }
    setNearAccount(undefined);
  };

  const handleLogInBtn = async () => {
    const isWalletConnected = await dappletApi.isWalletConnected();
    let accountName: string;
    if (!isWalletConnected) {
      accountName = await dappletApi.connectWallet();
    } else {
      accountName = await dappletApi.getCurrentNearAccount();
    }
    setNearAccount(accountName);
  };
  // console.log(selectedLootboxId);

  return (
    <div className={cn(styles.app)}>
      <header style={{ justifyContent: nearAccount ? 'space-between' : 'center' }}>
        {!nearAccount ? (
          <LogInButton label="Log in " onClick={handleLogInBtn} />
        ) : (
          <>
            <Profile
              avatar={parsedCtx?.authorImg}
              hash={nearAccount}
              onClick={handleLogIn}
              openChange={onOpenProfile}
              isOpenProfile={isOpenProfile}
            />
          </>
        )}
      </header>

      <Routes>
        <Route
          path="/"
          element={
            (loader && <Preloader />) || (
              <CreateNewBox imgVal={imgBox} label={valueLabel}>
                {lootboxes.map((item, index) => (
                  <ChildComponent
                    onClick={() => {
                      setLootboxes(lootboxes);
                      setSelectedLootboxId(item.id!);
                    }}
                    imgVal={IMG[item.pictureId]}
                    label={String(item.id!)}
                    number={index}
                    key={index}
                    id={item.id!}
                    creationForm={creationForm}
                    status={item.status!}
                  />
                ))}
              </CreateNewBox>
            )
          }
        ></Route>
        <Route
          path="/select_box"
          element={
            <SelectBox
              setClicked={setClickedBoxImg}
              clicked={clickedBoxImg}
              onChange_IMG={(x: string) => {
                setImgBox(x);
                updateImgSelect(x);
              }}
              creationFormId={creationForm.pictureId}
              onCreationFormUpdate={(id: number) =>
                setCreationForm({
                  ...creationForm,
                  pictureId: id,
                })
              }
            />
          }
        />

        <Route path="/box_settings_value" element={<SettingDef />} />
        <Route
          path="/settings_token"
          element={
            <SettingsToken
              creationForm={creationForm}
              onCreationFormUpdate={(x) => setCreationForm(x)}
            />
          }
        />
        <Route
          path="/settings_NFT"
          element={
            <SettingsNFT
              creationForm={creationForm}
              onCreationFormUpdate={(x) => setCreationForm(x)}
            />
          }
        />
        <Route
          path="/fill_your_box"
          element={
            (loader && <Preloader />) || (
              <FillBox price={price} imgVal={imgSelect} onDoneClick={doneClickHandler} />
            )
          }
        />

        <Route
          path="/fill_your_box_nft"
          element={
            (loader && <Preloader />) || (
              <FillBox_Nft price={price} imgVal={imgSelect} onDoneClick={doneClickHandler} />
            )
          }
        />
        <Route
          path="/deploy_your_box"
          element={
            (loader && <Preloader />) || <DeployBox id={selectedLootboxId} onChange={onChange} />
          }
        />
        <Route
          path="/statistics"
          element={(loader && <Preloader />) || <StatisticsNear stat={stat} />}
        />
        <Route
          path="/winners"
          element={(loader && <Preloader />) || <StatisticsWinners winners={winners} />}
        />
        <Route
          path="/code"
          element={(loader && <Preloader />) || <StatisticsCode id={selectedLootboxId} />}
        />
      </Routes>
    </div>
  );
};
function then(arg0: (x: any) => void) {
  throw new Error('Function not implemented.');
}

function winners(arg0: string, winners: any) {
  throw new Error('Function not implemented.');
}
