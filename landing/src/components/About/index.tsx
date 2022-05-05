import React, { useState } from 'react';
import cn from 'classnames';
import styles from './About.module.scss';
import { Preloader } from '../Preloader';
import { Link } from 'react-router-dom';
import imgDef from '../../img/about/about.png';

export interface AboutProps {
  completed: number;
  bgcolor: string;
}
export function About(AboutProps: any) {
  const [loader, setLoader] = useState(false);
  return (
    <div className={styles.BoxBlock}>
      {(loader && <Preloader />) || (
        <div className={styles.postLoader}>
          <h1 className={styles.boxTitle}>About </h1>
          <div className={styles.boxContent}>
            <div className={styles.description}>
              <p className={styles.text}>
                The Lootbox dapplet allows you to host airdrops and giveaways directly on your
                social media page, where all of your followers can participate.
              </p>
            </div>
            <div className={styles.boxImg}>
              <img src={imgDef} />
            </div>
            <div className={styles.description}>
              <p className={styles.text}>
                The airdrop is presented as a clickable image of a special box. When the Lootbox is
                made, the creator loads it with tokens or NFTs and selects the number of possible
                winners. Once the Lootbox has been posted anyone who can view your social media page
                is able to participate in the lottery.
              </p>
              <p className={styles.text}>
                The Lootbox dapp is a great tool that helps facilitate airdrops and giveaways,
                making them more fun and convenient. No more complicated mechanisms, and
                randomizers, your followers simply need to click on the Lootbox once to receive
                their prize.
              </p>

              <p className={styles.text}>
                The dapplet can be used by community managers, companies, or just really generous
                individuals.
              </p>
            </div>
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
