import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Image } from 'semantic-ui-react';
import { bridge } from './dappletBridge';
import cn from 'classnames';
import { LogInButton } from './components/atoms/LoginButtons';
import CreateNewBox from './components/createNewBox';
import { BoxSettings } from './components/boxSettings';
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

interface ICtx {
  authorFullname: string;
  authorUsername?: string;
  authorImg: string;
  id: string;
  text: string;

  isOpen?: boolean;
}

export default () => {
  const [parsedCtx, setParsedCtx] = useState<ICtx>();
  const [nearAccount, setNearAccount] = useState<string>();
  const [savedTweets, setSavedTweets] = useState<string[]>();
  // const [isOpen, openChange] = useState<ICtx>();
  const [isOpen, onOpenChange] = useToggle(false);

  const [value, setValue] = useState('');
  const onChange_Input: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };
  const [valueIMG, setValueIMG] = useState('');
  const onChange_IMG = () => {
    setValueIMG(valueIMG);
    console.log(valueIMG);
  };

  useEffect(() => {
    bridge.onData((data?: ICtx) => {
      setParsedCtx(data);
    });
    bridge.isWalletConnected().then(async (isWalletConnected) => {
      let accountName: string | undefined;
      if (isWalletConnected) {
        accountName = await bridge.getCurrentNearAccount();
      }
      setNearAccount(accountName);

      let tweets: string[] | undefined = undefined;
      if (accountName) tweets = await bridge.getTweets(accountName);
      setSavedTweets(tweets);
    });
  }, []);

  const handleSaveTweet = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const stringifiedCtx = JSON.stringify(parsedCtx);
    if (savedTweets?.includes(stringifiedCtx)) return;
    await bridge.addTweet(stringifiedCtx);
    let tweets: string[] | undefined = undefined;
    if (nearAccount) tweets = await bridge.getTweets(nearAccount);
    setSavedTweets(tweets);
  };

  const handleDeleteTweet = (ctx: string) => async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    await bridge.removeTweet(ctx);
    let tweets: string[] | undefined = undefined;
    if (nearAccount) tweets = await bridge.getTweets(nearAccount);
    setSavedTweets(tweets);
  };

  return (
    <div className={cn(styles.app)}>
      <header style={{ justifyContent: nearAccount ? 'space-between' : 'center' }}>
        {!nearAccount ? (
          <LogInButton
            label="Log in "
            onClick={async () => {
              const isWalletConnected = await bridge.isWalletConnected();
              let accountName: string;
              if (!isWalletConnected) {
                accountName = await bridge.connectWallet();
              } else {
                accountName = await bridge.getCurrentNearAccount();
              }
              setNearAccount(accountName);
              let tweets: string[] | undefined = undefined;
              if (accountName) tweets = await bridge.getTweets(accountName);
              setSavedTweets(tweets);
              console.log(valueIMG);
            }}
          />
        ) : (
          <>
            <Profile
              avatar={parsedCtx?.authorImg}
              hash={nearAccount}
              onClick={async () => {
                const isWalletConnected = await bridge.isWalletConnected();
                if (isWalletConnected) {
                  await bridge.disconnectWallet();
                }
                setNearAccount(undefined);
                setSavedTweets(undefined);

                console.log(useEffect);
              }}
              openChange={onOpenChange}
              isOpen={isOpen}
            />
          </>
        )}
      </header>

      <Routes>
        <Route path="/" element={<CreateNewBox label={value} />} />
        <Route path="/select_box" element={<SelectBox onChange_IMG={onChange_IMG} />} />
        <Route path="/box_settings_value" element={<BoxSettings />} />
        <Route path="/fill_your_box" element={<FillBox imgVal={valueIMG} />} />
        {/* <Route path="/winners" element={<StatisticsWinners />} /> */}
        <Route path="/fill_your_box_nft" element={<FillBox_Nft />} />
        <Route path="/deploy_your_box" element={<DeployBox onChange={onChange_Input} />} />
        <Route path="/statistics" element={<StatisticsNear />} />
        <Route path="/winners" element={<StatisticsWinners />} />
        <Route path="/code" element={<StatisticsCode />} />
      </Routes>
    </div>
  );
};
