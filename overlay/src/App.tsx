import React, { Children, useEffect, useState, useMemo, FC } from 'react';
import { Button, Card, Divider, Image, Item } from 'semantic-ui-react';
// import { bridge } from './dappletBridge';
import cn from 'classnames';
import { LogInButton } from './components/atoms/LoginButtons';
import CreateNewBox from './components/createNewBox';

import { DeployBox } from './components/deployBox';
import { Profile } from './components/atoms/Profile';
// import avatar from './icons/UserAvatarBig.png';
import styles from './App.module.scss';
import SelectBox, { IMG } from './components/selectBox';
import { StatisticsNear, StatisticsWinners, StatisticsCode } from './components/statisticsNear';
import { FillBox } from './components/fillBox';
import { useToggle } from './hooks/useToggle';
import { Routes, Route, Link } from 'react-router-dom';
import { FillBox_Nft } from './components/FillBoxNFT';
import { ChildComponent } from './components/createNewBox';
import GeneralBridge from '@dapplets/dapplet-overlay-bridge';
import {
  IDappletApi,
  Lootbox,
  LootboxStat,
  LootboxWinner,
  BoxCreationPrice,
} from '../../common/interfaces';

import { SettingDef } from './components/boxSettings';
import { SettingsToken } from './components/boxSettings/settingsToken';
import { SettingsNFT } from './components/boxSettings/settingsNft';

interface ICtx {
  authorFullname: string;
  authorUsername?: string;
  authorImg: string;
  id: string;
  text: string;

  isOpen?: boolean;
  // loading: true;
}

const dappletApi = new GeneralBridge<IDappletApi>();
// const IMG = [Box1, Box2, Box3, Box4];
const EMPTY_FORM: Lootbox = {
  name: '',
  dropChance: 20,
  ftContentItems: [],
  nftContentItems: [],
  nearContentItems: [],
  pictureId: 0,
  id: 0,
  status: 'created',
};
export const MessageData = [
  {
    id: 0,
    boxMessage: '',
  },
];
(async () => {
  await dappletApi.clearAll();
  // console.log('cleared all lootboxes');

  // const lootboxes = await dappletApi.getBoxesByAccount('dapplets_lootbox.testnet');
  // console.log('getBoxesByAccount', lootboxes);

  // const lootbox: Lootbox = {
  //   id: -1,
  //   name: `Auto-created lootbox`,
  //   pictureId: 1,
  //   dropChance: 0.5,
  //   status: 'created',
  //   nearContentItems: [],
  //   ftContentItems: [],
  //   nftContentItems: [
  //     {
  //       contractAddress: 'nft.testnet',
  //       tokenId: 1,
  //       quantity: 1,
  //     },
  //     {
  //       contractAddress: 'nft.testnet',
  //       tokenId: 2,
  //       quantity: 1,
  //     },
  //   ],
  // };

  // const priceInfo = await dappletApi.calcBoxCreationPrice(lootbox);
  // console.log('price of lootbox creation', priceInfo);

  // const lootboxId = await dappletApi.createNewBox(lootbox);
  // console.log('created new looxbox with id: ' + lootboxId);

  // const stat = await dappletApi.getLootboxStat(lootboxId);
  // console.log('statistics of lootbox #' + lootboxId, stat);

  // const winners = await dappletApi.getLootboxWinners(lootboxId);
  // console.log('winners of lootbox #' + lootboxId, winners);
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

  // console.log('CREATE: -->', creationForm);
  const [creationMessageData, setCreationMessageData] = useState(MessageData);
  // const wallet =  dappletApi.connectWallet()
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

  useEffect(() => {
    dappletApi
      .getBoxesByAccount('dapplets_lootbox.testnet')
      .then((x) => {
        setLootboxes(x);
        // console.log('lootboxes', x);
      })
      .catch((e) => {
        console.error(e);

        // ToDo: show error to user
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
    // hide loader
    // move to homepage

    await dappletApi.getBoxesByAccount('dapplets_lootbox.testnet').then((x) => {
      setLootboxes(x);
      console.log('lootboxes', x);
    });
    setCreationMessageData(MessageData);
    // console.log(MessageData);
    // console.log(creationForm);
  };

  useEffect(() => {
    if (selectedLootboxId === null) return;
    // console.log(creationForm.id);
    dappletApi
      .getLootboxWinners(selectedLootboxId)
      .then((x) => {
        // console.log('getLootboxStat', x);
        setWinners(x);
        // console.log('winners of lootbox #' + selectedLootboxId, winners);
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
        // console.log('getLootboxStat', x);
        setStat(x);
        // console.log('statistics of lootbox #' + selectedLootboxId, stat);
        setLoader(false);
      })

      .catch((e) => {
        console.error('getLootboxStat', e);

        // ToDo: show error to user
      });
  }, [selectedLootboxId]);

  useEffect(() => {
    // if (selectedLootboxId === null) return;

    dappletApi
      .calcBoxCreationPrice(creationForm)
      .then((x) => {
        // console.log('getLootboxPrice', x);
        setPrice(x);
        // console.log('price of lootbox creation', price);
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
            <CreateNewBox imgVal={imgBox} label={valueLabel}>
              {(loader && <div>Loading</div>) ||
                lootboxes.map((item, index) => (
                  <ChildComponent
                    onClick={() => {
                      setLootboxes(lootboxes);
                      setSelectedLootboxId(item.id!);
                      // console.log(lootboxes, 'hello');
                    }}
                    imgVal={IMG[item.pictureId]}
                    label={item.name}
                    number={index}
                    key={index}
                    id={item.id!}
                    creationForm={creationForm}
                    status={item.status!}
                  />
                ))}
            </CreateNewBox>
          }
        />
        <Route
          path="/select_box"
          element={
            <SelectBox
              setClicked={setClickedBoxImg}
              clicked={clickedBoxImg}
              onChange_IMG={(x: string) => {
                setImgBox(x);
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

        <Route
          path="/box_settings_value"
          element={
            <SettingDef
              creationForm={creationForm}
              onCreationFormUpdate={(x) => setCreationForm(x)}
            />
          }
        />
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
          element={<FillBox price={price} imgVal={imgBox} onDoneClick={doneClickHandler} />}
        />

        <Route
          path="/fill_your_box_nft"
          element={<FillBox_Nft price={price} imgVal={imgBox} onDoneClick={doneClickHandler} />}
        />
        <Route
          path="/deploy_your_box"
          element={
            (loader && <div>Loading</div>) || (
              <DeployBox
                // creationForm={creationForm}
                // onCreationFormUpdate={(x) => setCreationForm(x)}
                id={lootboxes.map((item, i) => item.id!)}
                onDoneClick={doneClickHandler}
                onChange={onChange}
                setCreationMessageData={(x: any) => setCreationMessageData(x)}
                MessageData={MessageData}
              />
            )
          }
        />
        <Route
          path="/statistics"
          element={(loader && <div>Loading</div>) || <StatisticsNear stat={stat} />}
        />
        <Route
          path="/winners"
          element={
            <StatisticsWinners
              winners={winners}
              // setSelectedLootboxId={creationForm.id}
              // creationForm={creationForm}
              // onCreationFormUpdate={(x: Lootbox) => setCreationForm(x)}
            />
          }
        />
        <Route
          path="/code"
          element={
            <StatisticsCode
              creationForm={creationForm}
              onCreationFormUpdate={(x) => setCreationForm(x)}
              setCreationMessageData={(x: any) => setCreationMessageData(x)}
              MessageData={MessageData}
            />
          }
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

export interface PreloaderProps {
  message: any;
}
export const Preloader: FC<PreloaderProps> = (props: PreloaderProps) => {
  const { message } = props;
  return <div>{message}</div>;
};
