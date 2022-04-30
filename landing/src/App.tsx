import { DappletApi } from './api';
import { Routes, Route, Link } from 'react-router-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import { Lootbox, LootboxStat } from '../../common/interfaces';
import React, { FC, useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import styles from './App.module.scss';
import styled, { keyframes } from 'styled-components';

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

export interface AppProps {
  completed: number;
  bgcolor: string;
  // stat: number;
}
export const IMG = [blueBox, redBox, safe, box, bag, pinata, pig];

const _api = new DappletApi();

console.log('_api', _api);

export default function App(AppProps: any) {
  const [selectedLootboxId, setSelectedLootboxId] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  return (
    <>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <div className={styles.wrapper}>
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
              <div className={styles.wrapper}>
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
        <Route path="/instruction" element={<Instruction />} />{' '}
      </Routes>
    </>
  );
}

function LootboxPage({ selectedLootboxId }: { selectedLootboxId: string | null }) {
  const { lootboxId } = useParams();
  const [statCur, setStat] = useState<number | null>(null);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    _api.getLootboxStat(lootboxId!).then((x) => {
      setStat(x?.currentBalance ?? null);
      setLoader(false);
    });
  }, [lootboxId]);
  const pulse = keyframes`
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
`;

  const Bar = styled.div`
    width: ${100 - 40}%;
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
    // <main>
    <div className={styles.BoxBlock}>
      {(loader && <Preloader />) || (
        <div className={styles.postLoader}>
          <h1 className={styles.boxTitle}>Sed egestas et est amet </h1>
          <div className={styles.boxImg}>
            {/* <img src={selectedLootboxId === null ? IMG[Number(lootboxId)!] : boxDef} /> */}
            <img src={selectedLootboxId === null ? boxDef : IMG[Number(lootboxId)!]} />
          </div>

          <div className={styles.radialBarBlock}>
            {/* <h2 className={styles.radialBarTitle}>
              <span className={styles.statCurNum}>{statCur}</span> / 100 tokens left
            </h2> */}
            <h2 className={styles.radialBarTitle}>
              <span className={styles.statCurNum}>{40} / 100 tokens left</span>
            </h2>
            <div className={styles.radialBarGraph}>
              <Bar />
            </div>
          </div>

          <div className={styles.description}>
            Sed egestas et est amet convallis lectus congue cursus. Risus bibendum ornare vitae,
            risus turpis interdum. Imperdiet nulla proin faucibus molestie. Eleifend lacinia posuere
            posuere dolor est feugiat eu adipiscing.
          </div>
          <div className={styles.buttonBlock}>
            <Link to="/instruction">
              <button className={styles.button}>How to collect?</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
