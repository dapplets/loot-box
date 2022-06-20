import React, { useEffect, useState  } from 'react';
import cn from 'classnames';
import styles from './App.module.scss';

import { useToggle } from './hooks/useToggle';
import { Routes, Route, useNavigate } from 'react-router-dom';

import GeneralBridge from '@dapplets/dapplet-overlay-bridge';
import {
  IDappletApi,
  Lootbox,
  LootboxStat,
  LootboxWinner,
  BoxCreationPrice,
  FtMetadata,
} from '@loot-box/common/interfaces';
import {} from '@dapplets/dapplet-extension';
import Avatar from './icons/Lootbox.png';

import { StatisticsNear } from './components/statisticsNear';
import { DeployBox } from './components/deployBox';
import { Profile } from './components/atoms/Profile';
import SelectBox, { IMG } from './components/selectBox';
import { FillBox } from './components/fillBox';
import { FillBox_Nft } from './components/FillBoxNFT';
import { ChildComponent } from './components/createNewBox';
import { LogInButton } from './components/atoms/LoginButtons';
import CreatedBoxList from './components/createNewBox';

import { SettingDef } from './components/boxSettings';
import { SettingsToken } from './components/boxSettings/settingsToken';
import { SettingsNFT } from './components/boxSettings/settingsNft';

import { Preloader } from './components/atoms/Preloader';
import { MessageMain } from './components/atoms/MessageMain';
import useApi from './hooks/useApi';
import { Statistics } from './components/Statistics';
import { Winner } from './components/Winners';
import { Code } from './components/Code';
import {getWin} from './utils/getWin'

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
  id: '0',
  status: 'created',
};

export default () => {
  const [parsedCtx, setParsedCtx] = useState<ICtx>();
  const [nearAccount, setNearAccount] = useState<string>();
  const [isOpenProfile, onOpenProfile] = useToggle(false);
  const [valueLabel, setValueLabel] = useState('');
  const [imgSelectBox, setImgSelectBox] = useState('');
  const [lootboxes, setLootboxes] = useState<Lootbox[]>([]);
  const [winners, setWinners] = useState<LootboxWinner[]>([]);
  const [selectedLootboxId, setSelectedLootboxId] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<LootboxStat | null>(null);
  const [creationForm, setCreationForm] = useState<Lootbox>(EMPTY_FORM);
  const [clickedBoxImg, setClickedBoxImg] = useState<number | null>(0);
  const [priceCreationForm, setPriceCreationForm] = useState<BoxCreationPrice | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [winnersLabelInfo, setWinnersLabelInfo] = useState('');
  const [messageError, setMessageError] = useState(false);
  const [ftMetadata, setFtMetadata] = useState(null);
  const [newMetadata, setMetadata] = useState<FtMetadata | null>();
  const [networkConfig, setNetworkConfig] = useState<any>({});
  const [isFetching, setFetching] = useState(false);
  const [currentLootboxes, setCurrentLootboxes] = useState(8);
  const [totalCountPagination, setTotalCountPagination] = useState(0);
  const [dropTypeCreationForm, setDropTypeCreationForm] = useState(null);
  const [clearCreationForm, setClearCreationForm,] = useState(false);
  const getLootboxStat = useApi(selectedLootboxId,dappletApi.getLootboxStat,setStatistics)
  const getLootboxWinners = useApi(selectedLootboxId,dappletApi.getLootboxWinners,setWinners)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueLabel(e.target.value);
  };

  useEffect(() => {
    dappletApi.on('data', (x: ICtx) => setParsedCtx(x));
    dappletApi.isWalletConnected().then(async (isWalletConnected) => {
      let accountName: string | undefined;
      if (isWalletConnected || isFetching) {
        accountName = await dappletApi.getCurrentNearAccount();
        await dappletApi
          .getBoxesByAccount(accountName, 0, 8 + currentLootboxes)
          .then((x) => {
            setLootboxes(x);

            setCurrentLootboxes((prevState) => prevState + 8);
            setTotalCountPagination(x.length);
          })
          .finally(() => setFetching(false));
      }
      setNearAccount(accountName);
    });
    dappletApi.getNetworkConfig().then((config: any) => {
      setNetworkConfig(config);
    });
  }, [isFetching]);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const scrollHandler = (e: any) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
        100 &&
      lootboxes.length === totalCountPagination
    ) {
      setFetching(true);
    } else {
      setFetching(false);
    }
  };
  let navigate = useNavigate();
  const navigationDeploy = () => {
    navigate('/deploy_your_box');
  };

  const doneClickHandler = async () => {
    if (!nearAccount) throw new Error('Not logged in.');
    setLoading(true);
    try {
      const id = await dappletApi.createNewBox(creationForm);
      setSelectedLootboxId(id);
      await dappletApi.getBoxesByAccount(nearAccount).then((x) => {
        setLootboxes(x);
      });
      navigationDeploy();
    } catch (error) {
      console.log(error);
      setMessageError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ftMetadata === null) return;
    Promise.all([dappletApi.getFtMetadata(ftMetadata)])
      .then(([x]) => {
        setMetadata(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [ftMetadata]);

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
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className={cn(styles.app)}>
          <header style={{ justifyContent: nearAccount ? 'space-between' : 'center' }}>
            {!nearAccount ? (
              <LogInButton label="Log in " onClick={handleLogInBtn} />
            ) : (
              <>
                <Profile
                  avatar={Avatar}
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
                (isLoading && <Preloader />) || (
                  <CreatedBoxList >
                    {lootboxes.length !== 0 ? (
                      lootboxes.map((item, index) => (
                        <ChildComponent
                          onClick={() => {
                            getWin(item,setWinnersLabelInfo);
                            setLootboxes(lootboxes);
                            setSelectedLootboxId(item.id!);
                          }}
                          imgValue={IMG[item.pictureId]}
                          label={String(item.id!)}
                          key={index}
                          id={item.id!}
                          status={item.status!}
                          winnersLabelInfo={item}
                          loader={isLoading}
                         
                        />
                      ))
                    ) : (
                      <div className={styles.messageNewBox}>
                        <MessageMain
                          className={styles.messageNewBoxTitle}
                          title="Welcome to the Lootbox Dapplet"
                          subtitle={
                            'Get started by creating a lootbox! All of your lootboxes will be displayed on this page. Learn more about lootboxes at '
                           
                          }
                          link={networkConfig.landingUrl}
                          linkText={networkConfig.landingUrl}
                        />
                      </div>
                    )}
                  </CreatedBoxList>
                )
              }
            ></Route>
            <Route
              path="/select_box"
              element={
                <SelectBox
                  setClicked={setClickedBoxImg}
                  imgId={clickedBoxImg}
                  onChange_IMG={(x: string) => {
                    setImgSelectBox(x);
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
                />
              }
            />
            <Route
              path="/settings_token"
              element={
                <SettingsToken
                  setFtMetadata={setFtMetadata}
                  creationForm={creationForm}
                  newMetadata={newMetadata}
                  onCreationFormUpdate={(x) => setCreationForm(x)}
                  setDropType={setDropTypeCreationForm}
                  setMetadata={setMetadata}
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
                (isLoading && <Preloader />) || (
                  <FillBox
                    imgValue={IMG[creationForm.pictureId]}
                    onDoneClick={doneClickHandler}
                    creationForm={creationForm}
                    winnersLabelInfo={winnersLabelInfo}
                    dropType={dropTypeCreationForm}
                    setWinInfo={(x) => setWinnersLabelInfo(x)}
                    onCreationFormUpdate={(x) => setCreationForm(x)}
                    setMessageError={setMessageError}
                    messageError={messageError}
                    newMetadata={newMetadata}
                    nearAccount={nearAccount}
                    setClearForm={setClearCreationForm}
                    setMetadata={setMetadata}
                  />
                )
              }
            />
            <Route
              path="/fill_your_box_nft"
              element={
                (isLoading && <Preloader />) || (
                  <FillBox_Nft
                    creationForm={creationForm}
                    setWinInfo={(x) => setWinnersLabelInfo(x)}
                    imgValue={IMG[creationForm.pictureId]}
                    onDoneClick={doneClickHandler}
                    setMessageError={setMessageError}
                    messageError={messageError}
                    nearAccount={nearAccount}
                  />
                )
              }
            />
            <Route
              path="/deploy_your_box"
              element={
                (isLoading && <Preloader />) || (
                  <DeployBox
                  winnersLabelInfo={winnersLabelInfo}
                    id={selectedLootboxId}
                    onChange={onChange}
                    landingUrl={networkConfig.landingUrl}
                  />
                )
              }
            />
            <Route
              path="/statistics"
              element={
                (isLoading && <Preloader />) || <StatisticsNear ><Statistics statistics={statistics} winnersLabelInfo={winnersLabelInfo} /></StatisticsNear>
              }
            />
            <Route
              path="/winners"
              element={
                (isLoading && <Preloader />) || (
                  <StatisticsNear > <Winner winners={winners}  winnersLabelInfo={winnersLabelInfo} /></StatisticsNear>
                )
              }
            />
            <Route
              path="/code"
              element={
                (isLoading && <Preloader />) || (
                  <StatisticsNear > <Code 
                    id={selectedLootboxId}
                    winnersLabelInfo={winnersLabelInfo}
                    landingUrl={networkConfig.landingUrl}/></StatisticsNear>
                )
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
};