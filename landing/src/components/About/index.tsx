import React, { useState } from 'react'
import imgDef from '../../img/about/about.png'
import future from '../../img/about/future.png'
import how_1 from '../../img/about/how_1.png'
import how_2 from '../../img/about/how_2.png'
import how_3 from '../../img/about/how_3.png'
import { Preloader } from '../Preloader'
import styles from './About.module.scss'

export interface AboutProps {
  completed: number
  bgcolor: string
}
export function About(AboutProps: any) {
  const [loader, setLoader] = useState(false)
  return (
    <div className={styles.BoxBlock}>
      {(loader && <Preloader />) || (
        <div className={styles.postLoader}>
          <h1 className={styles.boxTitle}>The Lootbox dapplet</h1>
          <span className={styles.boxTitleSpan}>by&nbsp;Dapplets Project</span>
          <div className={styles.boxImg}>
            <img src={imgDef} />
          </div>
          <div className={styles.boxContent}>
            <h3 className={styles.boxTitleMini}>About</h3>
            <div className={styles.description}>
              <p className={styles.text}>
                The Lootbox dapplet allows you to&nbsp;host airdrops and giveaways directly
                on&nbsp;your social media page, where all of&nbsp;your followers can participate.
              </p>
            </div>

            <div className={styles.description}>
              <p className={styles.text}>
                The airdrop is&nbsp;presented as&nbsp;a&nbsp;clickable image of&nbsp;a&nbsp;special
                box. When the Lootbox is made, the creator loads it&nbsp;with tokens or&nbsp;NFTs
                and selects the number of&nbsp;possible winners. Once the Lootbox has been posted
                anyone who can view your social media page is&nbsp;able to&nbsp;participate
                in&nbsp;the lottery.
              </p>
              <p className={styles.text}>
                The Lootbox dapp is&nbsp;a&nbsp;great tool that helps facilitate airdrops and
                giveaways, making them more fun and convenient. No&nbsp;more complicated mechanisms,
                and randomizers, your followers simply need to&nbsp;click on&nbsp;the Lootbox once
                to&nbsp;receive their prize.
              </p>

              <p className={styles.text}>
                The dapplet can be&nbsp;used by&nbsp;community managers, companies, or&nbsp;just
                really generous individuals.
              </p>
            </div>
            <h3 className={styles.boxTitleMini}>How&nbsp;to</h3>
            <div className={styles.description}>
              <p className={styles.text}>
                To&nbsp;create the airdrop all you need to&nbsp;do&nbsp;is:
              </p>
              <p className={styles.text}>
                1.&nbsp;select a&nbsp;Lootbox design (currently there are 7&nbsp;available)
              </p>
              <div className={styles.boxImg}>
                <img src={how_1} />
              </div>

              <p className={styles.text}>2. set the parameters</p>
              <div className={styles.boxImg}>
                <img src={how_2} />
              </div>
              <p className={styles.text}>3. fill it&nbsp;with tokens or&nbsp;even NFTs.</p>
              <div className={styles.boxImg}>
                <img src={how_3} />
              </div>
              <p className={styles.text}>
                You then need to&nbsp;post a&nbsp;small code in&nbsp;the form of&nbsp;a&nbsp;link
                on&nbsp;your social media page. Users who have the dapplet installed will see
                a&nbsp;clickable Lootbox image instead of the code. To&nbsp;start the lottery
                process the user simply needs to&nbsp;click on&nbsp;the Lootbox. If&nbsp;the user
                wins, the prize is&nbsp;sent directly to&nbsp;their crypto-wallet. Every user
                is&nbsp;only able to&nbsp;play the lottery once. The dapplet prevents malpractice by
                users with multiple accounts. The dapp links your social media account to&nbsp;your
                crypto-wallet, thereby making it&nbsp;impossible to&nbsp;use different accounts
                to&nbsp;play more than once. If&nbsp;the user doesn&rsquo;t have the dapplets
                extension installed, he&nbsp;will see a link instead of&nbsp;the Lootbox. The link
                will redirect him to&nbsp;the airdrop webpage, where a&nbsp;set of&nbsp;instructions
                will explain how to&nbsp;join the lottery.
              </p>
            </div>
            <h3 className={styles.boxTitleMini}>Future development</h3>
            <div className={styles.description}>
              <div className={styles.boxImg}>
                <img src={future} />
              </div>

              <p className={styles.text}>
                The dapplet is&nbsp;a&nbsp;useful tool for community managers and can also
                be&nbsp;used as&nbsp;a loyalty-building mechanism. Right now the dapplet
                is&nbsp;in&nbsp;the final stages of development. After testing and releasing the
                dapp on&nbsp;the mainnet, we&rsquo;d primarily like to&nbsp;see mass adoption
                by&nbsp;different communities and platforms.
              </p>
              <p className={styles.text}>
                We&nbsp;believe it&nbsp;significantly facilitates the airdrop process and makes
                it&nbsp;much more entertaining for the community. In&nbsp;the future we&nbsp;see the
                dapp being used by&nbsp;crypto investment communities, enterprises (for
                internal&nbsp;HR needs), and NFT marketplaces.
              </p>
            </div>
          </div>
          {/* 
          <div className={styles.buttonBlock}>
            <Link to="/how-to">
              <button className={styles.button}>How to collect?</button>
            </Link>
          </div> */}
        </div>
      )}
    </div>
  )
}
