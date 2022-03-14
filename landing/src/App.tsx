import { DappletApi } from './api';
import { Lootbox, LootboxStat } from '../../common/interfaces';
import React, { FC, useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import styles from './App.module.scss';
import box from './img/box.png';
import Box1 from './img/boxes/box1.png';
import Box2 from './img/boxes/box2.png';
import Box3 from './img/boxes/box3.png';
import Box4 from './img/boxes/box4.png';
import { Preloader } from './components/Preloader/index';
import { Routes, Route, Link } from 'react-router-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from './components/Header/index';
import { Footer } from './components/Footer/index';
import { About } from './components/About';
import { Instruction } from './components/Instruction';

export interface AppProps {
  completed: number;
  bgcolor: string;
  // stat: number;
}
export const IMG = [Box1, Box2, Box3, Box4];

const _api = new DappletApi();

export default function App(AppProps: any) {
  const [selectedLootboxId, setSelectedLootboxId] = useState<number | null>(null);
  const [loader, setLoader] = useState(false);
  return (
    <>
      <Routes>
        {/* <div className={styles.wrapper}> */}
        {/* <header>
            <Header />
          </header> */}
        <Route path="/">
          {/* <Route index element={<LootboxPage selectedLootboxId={null} />} /> */}
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
            // element={<LootboxPage selectedLootboxId={selectedLootboxId} />}
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
          // element={<About />}
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
        {/* <footer>
            <Footer />
          </footer> */}
        {/* </div> */}
      </Routes>
    </>
    // <div>
    //   <Preloader />
    // </div>
  );
}

function LootboxPage({
  selectedLootboxId,
}: // stat,
{
  selectedLootboxId: number | null;
  // stat: number | undefined;
}) {
  const { lootboxId } = useParams();
  const [statCur, setStat] = useState(Number);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    _api.getLootboxStat(Number(lootboxId!)).then((x) => {
      // console.log('getLootboxStat', x.currentBalance);

      setStat(x.currentBalance);
      setLoader(false);
    });
  }, [lootboxId]);
  return (
    // <main>
    <div className={styles.BoxBlock}>
      {(loader && <Preloader />) || (
        <div className={styles.postLoader}>
          <h1 className={styles.boxTitle}>Sed egestas et est amet </h1>
          <div className={styles.boxImg}>
            {/* <img src={selectedLootboxId === null ? IMG[Number(lootboxId)!] : box} /> */}
            <img src={selectedLootboxId === null ? box : IMG[Number(lootboxId)!]} />
          </div>

          <div className={styles.radialBarBlock}>
            {/* <h2 className={styles.radialBarTitle}>{statCur} / 100 tokens left</h2> */}
            <h2 className={styles.radialBarTitle}>{40} / 100 tokens left</h2>
            <div className={styles.radialBarGraph}>
              <div
                style={{
                  // width: `${100 - statCur}%`,
                  width: `${100 - 40}%`,
                  height: '100%',
                  // backgroundColor: ' #FFD904',
                  background:
                    'linear-gradient(0deg, rgb(240, 164, 29), rgb(255, 217, 4) 94%, rgb(255, 244, 171) 98%)',
                  boxShadow:
                    '10px -10px 24px rgba(242, 215, 4, 0.2), -10px -10px 20px rgba(246, 219, 4, 0.2), 10px 10px 31px rgba(242, 215, 4, 0.2)',
                  borderRadius: '40px',
                  textAlign: 'right',
                  position: 'relative',
                }}
              >
                <span className={cn(styles.labelStyles)}></span>
              </div>
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