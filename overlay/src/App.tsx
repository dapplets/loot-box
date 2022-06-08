import React, { useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import styles from './App.module.scss';

import { useToggle } from './hooks/useToggle';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

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
import { Api } from './api';
import { MessageMain } from './components/atoms/MessageMain';

interface ICtx {
  authorFullname: string;
  authorUsername?: string;
  authorImg: string;
  id: string;
  text: string;

  isOpen?: boolean;
}

const dappletApi = new GeneralBridge<IDappletApi>();
const api = new Api();

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
  const [imgBox, setImgBox] = useState('');
  const [lootboxes, setLootboxes] = useState<Lootbox[]>([]);
  const [winners, setWinners] = useState<LootboxWinner[]>([]);
  const [selectedLootboxId, setSelectedLootboxId] = useState<string | null>(null);
  const [stat, setStat] = useState<LootboxStat | null>(null);

  // TODO: come up with a better name
  // toDo -  idPicture on creationForm
  const [creationForm, setCreationForm] = useState<Lootbox>(EMPTY_FORM);
  const [clickedBoxImg, setClickedBoxImg] = useState<number | null>(0);
  const [price, setPrice] = useState<BoxCreationPrice | null>(null);
  const [loader, setLoader] = useState(false);

  const [winInfo, setWinInfo] = useState('');

  const [messageError, setMessageError] = useState(false);
  const [ftMetadata, setFtMetadata] = useState(null);
  const [newMetadata, setMetadata] = useState<FtMetadata | null>();

  const [networkConfig, setNetworkConfig] = useState<any>({});

  const [isFetching, setFetching] = useState(false);
  const [currentLootboxes, setCurrentLootboxes] = useState(8);
  const [totalCount, setTotalCount] = useState(0);

  const [ticketName, setTicketName] = useState('');

  const [dropType, setDropType] = useState(null);

  const [clearForm, setClearForm] = useState(false);

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
            setTotalCount(x.length);
          })
          .finally(() => setFetching(false));
      }
      // setLoader(false);
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
      lootboxes.length === totalCount
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

    setLoader(true);
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
      setLoader(false);
    }
  };
  const refreshStat = async () => {
    if (!nearAccount) throw new Error('Not logged in.');
    await dappletApi.getBoxesByAccount(nearAccount).then((x) => {
      setLootboxes(x);
    });
  };

  useEffect(() => {
    if (ftMetadata === null) return;
    Promise.all([dappletApi.getFtMetadata(ftMetadata)])

      .then(([x]) => {
        setMetadata(x);
      })

      .catch((e) => {
        console.error(e);
      });
  }, [ftMetadata]);

  useEffect(() => {
    if (selectedLootboxId === null) return;

    Promise.all([
      api.getLootboxClaims(selectedLootboxId.toString()),
      dappletApi.getLootboxWinners(selectedLootboxId),
    ])
      .then(([claims, winners]) => {
     
        console.log(winners);
        setWinners(
          winners.map((x) => {
            const txHash = claims.find((y: any) => y.signerId === x.nearAccount)?.hash;
            return {
              ...x,
              txLink: txHash ? `${networkConfig?.explorerUrl}/transactions/${txHash}` : '',
            };
          }),
        );
      })
      .catch((e) => {
        console.error('getLootboxWinners', e);

        // ToDo: show error to user
      });
     
      
  }, [selectedLootboxId]);

  useEffect(() => {
    if (selectedLootboxId === null) return;

    dappletApi
      .getLootboxStat(selectedLootboxId)
      .then((x) => {
        setStat(x);
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
  }, [creationForm]);

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

  const getWin = async (y: any) => {
    if (y.ftContentItems.length !== 0) {
      y.ftContentItems.map((x: any) => setWinInfo(`${x.tokenAmount} ${x.tokenTicker}`));
    } else if (y.nearContentItems.length !== 0) {
      y.nearContentItems.map((x: any) => setWinInfo(`${x.tokenAmount} NEAR`));
    } else if (y.nftContentItems.length !== 0) {
      const winNft = String(y.nftContentItems.length) + ` NFT`;
      setWinInfo(winNft);
    }
  };
 

  
  

  return (
    <>
      {loader ? (
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
                (loader && <Preloader />) || (
                  <CreateNewBox winInfo={winInfo} imgVal={imgBox} label={valueLabel}>
                    {lootboxes.length !== 0 ? (
                      lootboxes.map((item, index) => (
                        <ChildComponent
                          onClick={() => {
                            refreshStat();
                            getWin(item);
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
                          winInfo={item}
                          loader={loader}
                          setWinInfo={setWinInfo}
                        />
                      ))
                    ) : (
                      <div className={styles.messageNewBox}>
                        <MessageMain
                          className={styles.messageNewBoxTitle}
                          title="Welcome to the Lootbox Dapplet"
                          subtitle={
                            'Get started by creating a lootbox! All of your lootboxes will be displayed on this page. Learn more about lootboxes at '
                            // +
                            // networkConfig.landingUrl
                          }
                          link={networkConfig.landingUrl}
                          linkText={networkConfig.landingUrl}
                        />
                      </div>
                    )}
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
                  setFtMetadata={setFtMetadata}
                  creationForm={creationForm}
                  newMetadata={newMetadata}
                  onCreationFormUpdate={(x) => setCreationForm(x)}
                  // setTicketName={setTicketName}
                  setDropType={setDropType}
                  clearForm={clearForm}
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
                (loader && <Preloader />) || (
                  <FillBox
                    price={price}
                    imgVal={IMG[creationForm.pictureId]}
                    onDoneClick={doneClickHandler}
                    creationForm={creationForm}
                    winInfo={winInfo}
                    dropType={dropType}
                    setWinInfo={(x) => setWinInfo(x)}
                    onCreationFormUpdate={(x) => setCreationForm(x)}
                    setMessageError={setMessageError}
                    messageError={messageError}
                    newMetadata={newMetadata}
                    nearAccount={nearAccount}
                    setClearForm={setClearForm}
                    setMetadata={setMetadata}
                  />
                )
              }
            />

            <Route
              path="/fill_your_box_nft"
              element={
                (loader && <Preloader />) || (
                  <FillBox_Nft
                    creationForm={creationForm}
                    price={price}
                    winInfo={winInfo}
                    setWinInfo={(x) => setWinInfo(x)}
                    imgVal={IMG[creationForm.pictureId]}
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
                (loader && <Preloader />) || (
                  <DeployBox
                    winInfo={winInfo}
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
                (loader && <Preloader />) || <StatisticsNear stat={stat} winInfo={winInfo} />
              }
            />
            <Route
              path="/winners"
              element={
                (loader && <Preloader />) || (
                  <StatisticsWinners id={selectedLootboxId} winners={winners} winInfo={winInfo} />
                )
              }
            />
            <Route
              path="/code"
              element={
                (loader && <Preloader />) || (
                  <StatisticsCode
                    id={selectedLootboxId}
                    winInfo={winInfo}
                    landingUrl={networkConfig.landingUrl}
                  />
                )
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
};
function then(arg0: (x: any) => void) {
  throw new Error('Function not implemented.');
}

function winners(arg0: string, winners: any) {
  throw new Error('Function not implemented.');
}
