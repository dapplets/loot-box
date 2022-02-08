import React, { useEffect, useState } from 'react';
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
import { IDappletApi, Lootbox, LootboxStat, LootboxWinner } from '../../common/interfaces';
import { privateDecrypt } from 'crypto';
import { SettingDef } from './components/boxSettings';
import { SettingsToken } from './components/boxSettings';
import { SettingsNFT } from './components/boxSettings';

interface ICtx {
  authorFullname: string;
  authorUsername?: string;
  authorImg: string;
  id: string;
  text: string;

  isOpen?: boolean;
}

const dappletApi = new GeneralBridge<IDappletApi>();

(async () => {
  await dappletApi.clearAll();
  console.log('cleared all lootboxes');

  const lootboxes = await dappletApi.getBoxesByAccount('dapplets_lootbox.testnet');
  console.log('getBoxesByAccount', lootboxes);

  const lootbox: Lootbox = {
    id: -1,
    name: `Auto-created lootbox`,
    pictureId: 1,
    dropChance: 0.5,
    status: 'created',
    nearContentItems: [],
    ftContentItems: [],
    nftContentItems: [
      {
        contractAddress: 'nft.testnet',
        tokenId: 1,
        quantity: 1,
      },
      {
        contractAddress: 'nft.testnet',
        tokenId: 2,
        quantity: 1,
      },
    ],
  };

  const priceInfo = await dappletApi.calcBoxCreationPrice(lootbox);
  console.log('price of lootbox creation', priceInfo);

  const lootboxId = await dappletApi.createNewBox(lootbox);
  console.log('created new looxbox with id: ' + lootboxId);

  const stat = await dappletApi.getLootboxStat(lootboxId);
  console.log('statistics of lootbox #' + lootboxId, stat);

  const winners = await dappletApi.getLootboxWinners(lootboxId);
  console.log('winners of lootbox #' + lootboxId, winners);
})();

export default () => {
  const [parsedCtx, setParsedCtx] = useState<ICtx>();
  const [nearAccount, setNearAccount] = useState<string>();
  const [isOpen, onOpenChange] = useToggle(false);
  const [value, setValue] = useState('');
  const [valueIMG, setValueIMG] = useState('');
  const [numChildren, onCount] = useState(0);
  const [lootboxes, setLootboxes] = useState<Lootbox[]>([]);
  // const [isOpen, openChange] = useState<ICtx>();
  const [winners, setLootboxId] = useState<LootboxWinner[]>([]);
  const [stat, setStat] = useState<LootboxStat>();

  const onChange_Input: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const onAddChild = () => {
    onCount(numChildren + 1);
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
        console.log('lootboxes', x);
      })
      .catch((e) => {
        console.error(e);

        // ToDo: show error to user
      });
  }, []);
  // lootboxwin
  useEffect(() => {
    dappletApi
      .getLootboxWinners(1)
      .then((x) => {
        setLootboxId(x);
        console.log('winners of lootbox #' + 1, winners);
      })
      .catch((e) => {
        console.error(e);

        // ToDo: show error to user
      });
  }, []);
  // lootboxstat
  useEffect(() => {
    dappletApi
      .getLootboxStat(1)
      .then((x) => {
        setStat(x);
        console.log('statistics of lootbox #' + 1, stat);
      })
      .catch((e) => {
        console.error(e);

        // ToDo: show error to user
      });
  }, []);

  return (
    <div className={cn(styles.app)}>
      <header style={{ justifyContent: nearAccount ? 'space-between' : 'center' }}>
        {!nearAccount ? (
          <LogInButton
            label="Log in "
            onClick={async () => {
              const isWalletConnected = await dappletApi.isWalletConnected();
              let accountName: string;
              if (!isWalletConnected) {
                accountName = await dappletApi.connectWallet();
              } else {
                accountName = await dappletApi.getCurrentNearAccount();
              }
              setNearAccount(accountName);
            }}
          />
        ) : (
          <>
            <Profile
              avatar={parsedCtx?.authorImg}
              hash={nearAccount}
              onClick={async () => {
                const isWalletConnected = await dappletApi.isWalletConnected();
                if (isWalletConnected) {
                  await dappletApi.disconnectWallet();
                }
                setNearAccount(undefined);

                console.log(useEffect);
              }}
              openChange={onOpenChange}
              isOpen={isOpen}
            />
          </>
        )}
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <CreateNewBox imgVal={valueIMG} label={value}>
              {lootboxes.map((item, index) => (
                <ChildComponent imgVal={valueIMG} label={item.name} number={item.id} key={index} />
              ))}
            </CreateNewBox>
          }
        />
        <Route
          path="/select_box"
          element={
            <SelectBox
              onChange_IMG={(x: string) => {
                setValueIMG(x);
                console.log(x, 'hello');
              }}
            />
          }
        />
        {/* <Route path="/box_settings_value" element={<BoxSettings />} /> */}
        <Route path="/box_settings_value" element={<SettingDef />} />
        <Route path="/settings_token" element={<SettingsToken />} />
        <Route path="/settings_NFT" element={<SettingsNFT />} />
        <Route path="/fill_your_box" element={<FillBox imgVal={valueIMG} />} />
        {/* <Route path="/winners" element={<StatisticsWinners />} /> */}
        <Route path="/fill_your_box_nft" element={<FillBox_Nft imgVal={valueIMG} />} />
        <Route
          path="/deploy_your_box"
          element={<DeployBox onAddChild={onAddChild} onChange={onChange_Input} />}
        />
        <Route path="/statistics" element={<StatisticsNear stat={stat} />} />
        <Route path="/winners" element={<StatisticsWinners winners={winners} />} />
        <Route path="/code" element={<StatisticsCode />} />
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
