import React, { useState } from 'react';
import cn from 'classnames';
import styles from './About.module.scss';
import { Preloader } from '../Preloader';
import { Link } from 'react-router-dom';
import imgDef from '../../img/about/about.png';
import how_1 from '../../img/about/how_1.png';
import how_2 from '../../img/about/how_2.png';
import how_3 from '../../img/about/how_3.png';
import future from '../../img/about/future.png';

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
          <h1 className={styles.boxTitle}>The Lootbox dapplet</h1>
          <span className={styles.boxTitleSpan}>by Dapplets Project</span>
          <div className={styles.boxImg}>
            <img src={imgDef} />
          </div>
          <div className={styles.boxContent}>
            <h3 className={styles.boxTitleMini}>About</h3>
            <div className={styles.description}>
              <p className={styles.text}>
                The Lootbox dapplet allows you to host airdrops and giveaways directly on your
                social media page, where all of your followers can participate.
              </p>
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
            <h3 className={styles.boxTitleMini}>How to</h3>
            <div className={styles.description}>
              <p className={styles.text}>To create the airdrop all you need to do is:</p>
              <p className={styles.text}>
                1.select a Lootbox design (currently there are 5 available)
              </p>
              <div className={styles.boxImg}>
                <img src={how_1} />
              </div>

              <p className={styles.text}>2. set the parameters</p>
              <div className={styles.boxImg}>
                <img src={how_2} />
              </div>
              <p className={styles.text}>3. fill it with tokens or even NFTs.</p>
              <div className={styles.boxImg}>
                <img src={how_3} />
              </div>
              <p className={styles.text}>
                You then need to post a small code in the form of a link on your social media page.
                Users who have the dapplet installed will see a clickable Lootbox image instead of
                the code. To start the lottery process the user simply needs to click on the
                Lootbox. If the user wins, the prize is sent directly to their crypto-wallet. Every
                user is only able to play the lottery once. The dapplet prevents malpractice by
                users with multiple accounts. The dapp links your social media account to your
                crypto-wallet, thereby making it impossible to use different accounts to play more
                than once. If the user doesn’t have the dapplets extension installed, he will see a
                link instead of the Lootbox. The link will redirect him to the airdrop webpage,
                where a set of instructions will explain how to join the lottery.
              </p>
            </div>
            <h3 className={styles.boxTitleMini}>Future development</h3>
            <div className={styles.description}>
              <div className={styles.boxImg}>
                <img src={future} />
              </div>

              <p className={styles.text}>
                The dapplet is a useful tool for community managers and can also be used as a
                loyalty-building mechanism. Right now the dapplet is in the final stages of
                development. After testing and releasing the dapp on the mainnet, we’d primarily
                like to see mass adoption by different communities and platforms.
              </p>
              <p className={styles.text}>
                We believe it significantly facilitates the airdrop process and makes it much more
                entertaining for the community. In the future we see the dapp being used by crypto
                investment communities, enterprises (for internal HR needs), and NFT marketplaces.
              </p>
            </div>
          </div>
          {/* 
          <div className={styles.buttonBlock}>
            <Link to="/instruction">
              <button className={styles.button}>How to collect?</button>
            </Link>
          </div> */}
        </div>
      )}
    </div>
  );
}
