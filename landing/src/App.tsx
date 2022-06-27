import { DappletApi } from './api';
import { Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import styles from './App.module.scss';
import styled, { keyframes } from 'styled-components';
import cn from 'classnames';

import boxDef from './img/box.png';

import blueBox from './img/boxes/blue_box.png';
import redBox from './img/boxes/red_box.png';
import safe from './img/boxes/safe.png';
import box from './img/boxes/box.png';
import bag from './img/boxes/bag.png';
import pinata from './img/boxes/pinata.png';
import pig from './img/boxes/pig.png';

import { Preloader } from './components/Preloader/index';

import { Header } from './components/Header/index';
import { Footer } from './components/Footer/index';
import { About } from './components/About';
import { Instruction } from './components/Instruction';
import { getNetworkConfig } from '@loot-box/common/helpers';
import { LootboxStat, Lootbox } from '@loot-box/common/interfaces';
import { Instruction_Create } from './components/Instruction/create';
import {ReactComponent as LogoWin} from './img/labelWin.svg'
import { toPrecision } from './helpers';

export interface AppProps {
  completed: number;
  bgcolor: string;
}
export const IMG = [blueBox, redBox, safe, box, bag, pinata, pig];

const _api = new DappletApi(getNetworkConfig(process.env.NETWORK as string));

export default function App() {
  const [selectedLootboxId, setSelectedLootboxId] = useState<string | null>(null);
  const { lootboxId } = useParams();
  useEffect(() => {
    _api.getLootboxById(lootboxId!).then((x) => setSelectedLootboxId(x?.id!));
  }, [lootboxId, selectedLootboxId]);

  return (
    <>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <div className={styles.wrapperFullscreen}>
                <header>
                  <Header />
                </header>
                <LootboxPage selectedLootboxId={null} />
                <footer>
                  <Footer />
                </footer>
              </div>
            }
          />
          <Route
            path=":lootboxId"
            element={
              <div className={styles.wrapperFullscreen}>
                <header>
                  <Header />
                </header>
                <LootboxPage selectedLootboxId={selectedLootboxId} />
                <footer>
                  <Footer />
                </footer>
              </div>
            }
          />
        </Route>
        <Route
          path="/about"
          element={
            <div className={styles.wrapper}>
              <header>
                <Header />
              </header>
              <About />
              <footer>
                <Footer />
              </footer>
            </div>
          }
        />
        <Route path="/how-to" element={<Instruction />} />
        <Route path="/create" element={<Instruction_Create />} />
      </Routes>
    </>
  );
}
let isMounted = false;
function LootboxPage({ selectedLootboxId }: { selectedLootboxId: string | null }) {
  const { lootboxId } = useParams();
  const [statCur, setStat] = useState<LootboxStat | null>(null);
  const [loader, setLoader] = useState(false);
  const [pictureId, setPictureId] = useState<number | null>(null);
  const [owner, setOwner] = useState<string | undefined>('');
  const [ownerAddress, setOwnerAddress] = useState<string | undefined>('');
  const [nameWin, setNameWin] = useState<string | undefined>('');
  const [ftMetadata, setFtMetadata] = useState<string | undefined>('')

  useEffect(() => {
    isMounted = true;
    setLoader(true);
    const init = async () => {
      await _api.getLootboxStat(lootboxId!).then((x) => {
        setStat(x);
        setLoader(false);
      });
      await _api.getLootboxById(lootboxId!).then((x) => setPictureId(Number(x?.pictureId)));

      await _api.getLootboxById(lootboxId!).then((x) => setOwner(x?.ownerId));

      const resultAddress = getNetworkConfig(process.env.NETWORK as string).explorerUrl;
      setOwnerAddress(`${resultAddress}/accounts/${owner}`);

      await _api.getLootboxById(lootboxId!).then((x) => {
        if (x?.ftContentItems.length) {
         
          setNameWin(x.ftContentItems[0].tokenTicker)
        } else if (x?.nearContentItems.length) {
          setNameWin('NEAR');
        } else if (x?.nftContentItems.length) {
          setNameWin('NFT');
        }
      
      });
  
    
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [lootboxId, owner, nameWin]);
  const pulse = keyframes`
    0% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  `;

  const Bar = styled.div<{ completedPercents?: string | null }>`
    width: ${(props) =>
      props !== null && props?.completedPercents !== null ? props?.completedPercents : '0px'}%;
    height: 100%;

    background: linear-gradient(
      0deg,
      rgb(240, 164, 29),
      rgb(255, 217, 4) 94%,
      rgb(255, 244, 171) 98%
    );
    box-shadow: 10px -10px 24px rgba(242, 215, 4, 0.2), -10px -10px 20px rgba(246, 219, 4, 0.2),
      10px 10px 31px rgba(242, 215, 4, 0.2);
    border-radius: 40px;
    text-align: right;
    position: relative;
    transform-origin: left top;
    transform: scaleX(0);
    animation: ${pulse} 2s forwards;
  `;

  return (
    <div className={styles.boxBlockWrapper}>
      <div
        className={cn(styles.BoxBlock, {
          [styles.BoxBlockWinners]: !Number.isNaN(pictureId),
        })}
      >
        {(loader && <Preloader />) || (
          <div className={styles.postLoader}>
            {!Number.isNaN(pictureId) ? (
              <h1 className={cn(styles.boxTitle, styles.boxTitleWinner)}>
                LootBox <span className={styles.wrap} />
                <span className={styles.authorTitleSpan}>{` by `}</span>
                <a className={styles.authorTitleLink} target="_blank" href={ownerAddress}>
                  {owner}
                </a>
                <span className={styles.imgLabel}>
                    <span className={styles.imgLabelSum}>{toPrecision(statCur?.totalAmount,3)}</span>
                  
                    <span className={styles.imgLabelTicker}> {nameWin}</span>
                   
                  </span>
              </h1>
            ) : (
              <h1 className={styles.boxTitle}>
                The LootBox Dapplet
                <br />
                <span className={styles.defaultTitleSpan}>
                  {`module for `}
                  <a
                    className={styles.defaultTitleLink}
                    target="_blank"
                    href="https://github.com/dapplets/dapplet-extension/releases/tag/v0.48.0"
                  >
                    Dapplets Extension
                  </a>
                </span>
               
              </h1>
            )}

            <div className={styles.boxImg}>
              {!Number.isNaN(pictureId) ? (
                <>
                  
                  <img className={styles.mainImg} src={IMG[pictureId!]} />
                </>
              ) : (
                <img className={styles.mainImgDef} src={boxDef} />
              )}
            </div>
            {selectedLootboxId !== null && statCur !== null ? (
              <div className={styles.radialBarBlock}>
                <h2 className={styles.radialBarTitle}>
                  <span className={styles.statCurNum}>{statCur && statCur?.completedPercents}</span>{' '}
                  / 100 %
                </h2>
                <div className={styles.radialBarGraph}>
                  <Bar completedPercents={statCur?.completedPercents} />
                </div>
              </div>
            ) : null}

            {!Number.isNaN(pictureId) ? (
              <div className={styles.description}>
                <p className={cn(styles.textDescription, styles.textDescriptionWinner)}>
                  <span className={styles.nameOwner}>{owner}</span>&nbsp;is&nbsp;hosting a&nbsp;giveaway
                  on&nbsp;Twitter. Join now for a&nbsp;chance to&nbsp;win
                  <span className={styles.totalSum}> {statCur?.totalAmount}</span>
                  <span className={styles.labelSum}> {nameWin}</span>
                </p>

                <p className={styles.textDescription}>
                  Read &laquo;How to&nbsp;collect?&raquo; to&nbsp;participate and win the prize!
                </p>
              </div>
            ) : (
              <div className={styles.description}>
                <p className={styles.textDescription}>
                  The LootBox Dapplet allows you to&nbsp;host airdrops and giveaways directly
                  on&nbsp;your social media page, where all of&nbsp;your followers can participate.
                </p>
                {/* <br /> */}
                <p className={styles.textDescription}>
                  The Lootbox dapp is&nbsp;a&nbsp;great tool that helps facilitate airdrops and
                  giveaways, making them more fun and convenient. No&nbsp;more complicated
                  mechanisms, and randomizers, your followers simply need to&nbsp;click on&nbsp;the
                  Lootbox once to&nbsp;receive their prize.
                </p>
              </div>
            )}

            <div className={styles.buttonBlock}>
              <Link to="/how-to">
                <button className={styles.button}>How to&nbsp;collect?</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
