import React from 'react';
import cn from 'classnames';

import styles from './Instruction.module.scss';

import { Header } from '../Header';
import { Footer } from '../Footer';

import bg from '../../img/instruction/bg.png';
import connect_near from '../../img/instruction/connect_near.png';
import connecting from '../../img/instruction/connecting.png';
import continueImg from '../../img/instruction/continue.png';
import downloads from '../../img/instruction/downloads.png';
import drag_drop from '../../img/instruction/drag_drop.png';

import inst_1 from '../../img/instruction/instruction_1.png';
import inst_2 from '../../img/instruction/instruction_2.png';
import inst_3 from '../../img/instruction/instruction_3.png';
import inst_4 from '../../img/instruction/instruction_4.png';
import inst_5 from '../../img/instruction/instruction_5.png';
import inst_6 from '../../img/instruction/instruction_6.png';
import inst_7 from '../../img/instruction/instruction_7.png';
import inst_8 from '../../img/instruction/instruction_8.png';
import inst_8_1 from '../../img/instruction/instruction_8_1.png';
import inst_9 from '../../img/instruction/instruction_9.png';
import inst_10 from '../../img/instruction/instruction_10.png';
import inst_10_1 from '../../img/instruction/instruction_10_1.png';
import inst_11 from '../../img/instruction/instruction_11.png';
import inst_12 from '../../img/instruction/instruction_12.png';
import inst_13 from '../../img/instruction/instruction_13.png';
import inst_13_1 from '../../img/instruction/instruction_13_1.png';
import inst_14 from '../../img/instruction/instruction_14.png';

import load_unpuck from '../../img/instruction/load_unpuck.png';
import near_wallet from '../../img/instruction/near_wallet.png';
import wallets_connect from '../../img/instruction/walets_connect.png';
import wallets from '../../img/instruction/walets.png';

export interface InstructionProps {
  completed: number;
  bgcolor: string;
}

export function Instruction(InstructionProps: any) {
  return (
    <div className={styles.wrapper}>
      <header>
        <Header />
      </header>
      <div className={styles.content}>
        {/* <Start /> */}
        <Installation />
        <Activate />
        <Claming />
        <Creation />
        <NearToken />
        <FungibleTokens />
        <NonFungibleTokens />
        <Status />
      </div>
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}

// export function Start(InstructionProps: any) {
//   return (
//     <div className={styles.start}>
//       <h1 className={styles.titleInstruction}>Install the Dapplets Extension</h1>
//       <ol className={styles.list}>
//         <li className={styles.item}>Open the Google Chrome browser.</li>
//         <li className={styles.item}>
//           Download the&nbsp;
//           <a className={styles.link}>Dapplet Browser Extension.</a>
//         </li>
//         <li className={styles.item}>
//           Open&nbsp;
//           <a className={styles.link}> chrome://extensions </a>&nbsp;in a new tab.
//         </li>
//         <li className={styles.item}>
//           Switch the Developer mode on and press F5 to refresh the page.
//         </li>
//       </ol>
//       <div className={styles.description}>
//         Lorem libero volutpat in condimentum nisl sem suspendisse netus. Suspendisse nulla semper
//         sollicitudin cursus ipsum. Eu gravida laoreet fringilla placerat tellus lectus. Ultrices dui
//         urna quis commodo. Fringilla felis morbi feugiat ullamcorper fermentum enim tortor turpis
//         pellentesque. Et tristique purus amet, vitae suspendisse integer est mauris. Enim, fusce
//         nisi, sagittis posuere.
//       </div>
//     </div>
//   );
// }

export function Installation(InstructionProps: any) {
  return (
    <div className={styles.installation}>
      <h2 className={styles.titleInstruction}>Install the Dapplets Extension</h2>
      <ol className={styles.list}>
        <li className={styles.item}>
          <span className={styles.itemText}>Open the Google Chrome browser. </span>
        </li>
        <li className={styles.item}>
          <span className={styles.itemText}>
            Download the <a className={styles.link}>Dapplet Browser Extension</a> .
          </span>
        </li>
        <li className={styles.item}>
          <span className={styles.itemText}>
            Open <a className={styles.link}>chrome://extensions </a> in&nbsp;a&nbsp;new tab.
          </span>
        </li>
        <li className={styles.item}>
          <span className={styles.itemText}>
            Switch the Developer mode on&nbsp;and press F5&nbsp;to&nbsp;refresh the page.
          </span>
        </li>
      </ol>
      <div className={styles.dragDrop}>
        <h3 className={styles.dragDropTitle}>Drag &amp;&nbsp;Drop Dapplets Extension</h3>

        <img src={drag_drop} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        P.S. If&nbsp;you are using Ubuntu or&nbsp;possibly another Linux OS&nbsp;the Dapplets
        extension can disappear from the Chrome Extensions after restarting the PC. To&nbsp;avoid
        this unzip the archive and use the Load unpacked button to&nbsp;add the extension.
      </div>
      <div className={styles.dragDrop}>
        <img src={load_unpuck} className={styles.loadUnpuck} />

        <img src={downloads} className={styles.downloads} />
      </div>
    </div>
  );
}

export function Activate(InstructionProps: any) {
  return (
    <div className={styles.walletConnection}>
      <h3 className={styles.titleWallet}>Activate the Lootbox Dapplet</h3>
      <div className={styles.description}>
        The extension depends on&nbsp;your current context. Please open a&nbsp;Twitter webpage
        before clicking on&nbsp;the extension icon. You will then see a&nbsp;list of&nbsp;dapplets
        available on&nbsp;Twitter. There the Lootbox Dapplet should be&nbsp;activated. Wait for the
        dapplet to&nbsp;load.
      </div>
      <div className={cn(styles.walletConnectionBlock, styles.block_1, styles.blockImgActivate)}>
        <span className={cn(styles.labelImg, styles.labelImgActivate)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgActivate)}>
          <span className={styles.labelTitle}>
            Please open a&nbsp;Twitter webpage before clicking on&nbsp;the extension icon.
          </span>
          <span>
            You will then see a&nbsp;list of&nbsp;dapplets available on&nbsp;Twitter. There
            the&nbsp;
            <span className={styles.highlightTitle}>Lootbox Dapplet</span> should be&nbsp;activated.
            <br />
          </span>
          <span className={styles.labelTitle}>Wait for the dapplet to&nbsp;load.</span>
        </h3>
        <img src={inst_1} className={styles.dragDropImg} />
      </div>

      <div className={styles.description}>
        The home button opens an&nbsp;overlay where you can create a&nbsp;new lootbox or&nbsp;see
        a&nbsp;list of existing ones. You need to&nbsp;be&nbsp;logged in&nbsp;before you can create
        or&nbsp;open a&nbsp;lootbox. Click on the &laquo;log&nbsp;in&raquo; button, select
        a&nbsp;wallet for dapplet interaction and go&nbsp;to&nbsp;the next step.
      </div>
    </div>
  );
}

export function Claming(InstructionProps: any) {
  return (
    <div className={styles.walletConnection}>
      <h3 className={styles.titleWallet}>Lootbox claiming</h3>
      <div className={styles.description}>
        Find a&nbsp;tweet with a&nbsp;lootbox giveaway created by&nbsp;this dapplet. You will see
        a&nbsp;lootbox picture after installating the dapplet.
      </div>
      <div className={cn(styles.walletConnectionBlock, styles.block_2, styles.blockImgClaming)}>
        <span className={cn(styles.labelImg, styles.labelImgClaming)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgClaming)}>
          <span>
            Find a&nbsp;<span className={styles.highlightTitle}>tweet with a&nbsp;lootbox</span>
            &nbsp; giveaway created by&nbsp;this dapplet.
          </span>
        </h3>
        <img src={inst_2} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        To&nbsp;open a&nbsp;lootbox you need to&nbsp;click on&nbsp;the picture. It&nbsp;opens
        a&nbsp;NEAR wallet where a&nbsp;claiming transaction should be&nbsp;confirmed. After that
        the smart contract will return with a&nbsp;result. A lootbox can be&nbsp;full or&nbsp;empty,
        depending on&nbsp;the giveaway&rsquo;s settings.
      </div>
      <div className={cn(styles.walletConnectionBlock, styles.block_3, styles.blockImgClaming)}>
        <span className={cn(styles.labelImg, styles.labelImgClaming)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgClaming)}>
          Example of&nbsp;a&nbsp;<span className={styles.highlightTitle}>winning lootbox</span>
        </h3>
        <img src={inst_3} className={styles.dragDropImg} />
      </div>
    </div>
  );
}

export function Creation(InstructionProps: any) {
  return (
    <div className={styles.walletConnection}>
      <h3 className={styles.titleWallet}>Lootbox Creation</h3>
      <div className={styles.description}>
        The first steps of&nbsp;lootbox creation are similar for every type of&nbsp;loot.
        It&nbsp;starts with a &laquo;Create new box&raquo; button.
      </div>
      <div className={cn(styles.walletConnectionBlock, styles.block_4, styles.blockImgCreation)}>
        <span className={cn(styles.labelImg, styles.labelImgCreation)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgCreation)}>
          <span>
            It&nbsp;starts with<br></br> a&nbsp;
            <span className={styles.highlightTitle}>&laquo;Create new box&raquo;</span> button.
          </span>
        </h3>
        {/* TODO: EDIT IMG!!! */}
        <img src={inst_4} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        Select a&nbsp;picture which will be&nbsp;displayed in&nbsp;your lootbox tweet.
      </div>
      <div className={cn(styles.walletConnectionBlock, styles.block_5, styles.blockImgCreation)}>
        <span className={cn(styles.labelImg, styles.labelImgCreation)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgCreation)}>
          <span>
            Select a&nbsp;picture which will be&nbsp;displayed<br></br> in&nbsp;
            <span className={styles.highlightTitle}>your lootbox tweet</span> .
          </span>
        </h3>
        <img src={inst_5} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        The next step is&nbsp;choosing your type of&nbsp;loot. There are three loots available:
        <br />
        <ol className={styles.listInstructionCreating}>
          <li className={styles.itemInstructionCreating}>NEAR</li>
          <li className={styles.itemInstructionCreating}>Fungible tokens</li>
          <li className={styles.itemInstructionCreating}>Non-fungible tokens</li>
        </ol>
        <br />
        Consider each option.
      </div>
    </div>
  );
}

export function NearToken(InstructionProps: any) {
  return (
    <div className={styles.walletConnection}>
      <h3 className={styles.titleWallet}>Native NEAR Tokens</h3>
      <div className={styles.description}>
        Select &laquo;Token&raquo; and check the radio-button &laquo;$NEAR&raquo;.
      </div>
      <div className={styles.description}>
        Enter the number of&nbsp;tokens you want to&nbsp;distribute in&nbsp;the &laquo;token
        amount&raquo; field.
      </div>
      <div className={styles.description}>
        Drop amount is&nbsp;the number of&nbsp;tokens the user will receive after claiming.
        It&nbsp;may be&nbsp;fixed or variable. In&nbsp;the case of&nbsp;variable a&nbsp;left value
        must be&nbsp;smaller then the right one.
      </div>
      <div className={styles.description}>
        Drop chance is&nbsp;a&nbsp;probability of&nbsp;a&nbsp;winning lootbox.&nbsp;50% means that
        almost every second person will receive a&nbsp;drop.
      </div>
      <div className={cn(styles.walletConnectionBlock, styles.block_6, styles.blockImgNearToken)}>
        <span className={cn(styles.labelImg, styles.labelImgNearToken)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgNearToken)}>
          <span>
            Select <span className={styles.highlightTitle}>&laquo;Token&raquo;</span> and check the
            radio-button&nbsp;
            <span className={styles.highlightTitle}>&laquo;$NEAR</span>.
          </span>
        </h3>

        <img src={inst_6} className={styles.dragDropImg} />
      </div>
    </div>
  );
}

export function FungibleTokens(InstructionProps: any) {
  return (
    <div className={styles.walletConnection}>
      <h3 className={styles.titleWallet}>Fungible Tokens</h3>
      <div className={styles.description}>
        Select &laquo;Token&raquo; To&nbsp;create a&nbsp;lootbox filled with fungible tokens you
        need to&nbsp;know an&nbsp;address of&nbsp;the token&rsquo;s smart-contract.
      </div>
      <div className={styles.description}>
        A&nbsp;list of&nbsp;tokens that you own is&nbsp;available in&nbsp;your NEAR wallet &nbsp;(
        <a className={styles.link}>https://wallet.testnet.near.org/</a>&nbsp; for testnet,&nbsp;
        <a className={styles.link}>https://wallet.mainnet.near.org/</a>&nbsp; for mainnet).
      </div>
      <div
        className={cn(styles.walletConnectionBlock, styles.block_7, styles.blockImgFungibleTokens)}
      >
        <span className={cn(styles.labelImg, styles.labelImgFungibleTokens)}></span>
        <img src={inst_7} className={cn(styles.dragDropImg, styles.imgFungibleTokens)} />
      </div>
      <div className={styles.description}>
        For example BANANA token is&nbsp;available here. Its smart contract address is
        <span className={styles.descriptionFungibleTokensLabel}>banana.ft-fin.testnet</span>.
      </div>
      <div
        className={cn(styles.walletConnectionBlock, styles.block_8, styles.blockImgFungibleTokens)}
      >
        <span className={cn(styles.labelImg, styles.labelImgFungibleTokens)}></span>
        <div className={styles.wrapperTitleImgFungibleTokens}>
          <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgFungibleTokens)}>
            For example BANANA token is&nbsp;available here.
          </h3>
          <img src={inst_8_1} className={styles.dragDropImg} />
          <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgFungibleTokens)}>
            You can find it&nbsp;by&nbsp;clicking on&nbsp;the token name.
          </h3>
        </div>

        <img src={inst_8} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        Other parameters stay the same and are described in&nbsp;previous section.
      </div>
      <div className={styles.description}>
        You have to&nbsp;send multiple transactions. The first one will create a&nbsp;lootbox and
        at&nbsp;the least the other one will transfer the fungible token to&nbsp;the lootbox.
      </div>
    </div>
  );
}

export function NonFungibleTokens(InstructionProps: any) {
  return (
    <div className={styles.walletConnection}>
      <h3 className={styles.titleWallet}>Non-Fungible Tokens</h3>
      <div className={styles.description}>
        A&nbsp;list of&nbsp;NFTs that you own is&nbsp;available in&nbsp;the Collectibles tab
        of&nbsp;the NEAR wallet.
      </div>

      <div
        className={cn(
          styles.walletConnectionBlock,
          styles.block_9,
          styles.blockImgNonFungibleTokens,
        )}
      >
        <span className={cn(styles.labelImg, styles.labelImgNonFungibleTokens)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgNonFungibleTokens)}>
          <span className={styles.wrapperTitleNonFungibleTokens}>
            A&nbsp;list of&nbsp;NFTs that you own is&nbsp;available in&nbsp;the&nbsp;
            <span className={styles.highlightTitle}>Collectibles</span> tab of&nbsp;the NEAR wallet.
          </span>
        </h3>
        <img src={inst_9} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        Each NFT collection has its own smart contract address, which you can find in&nbsp;the URL
        of this token.
      </div>
      <div className={styles.description}>
        In&nbsp;this case
        <span className={styles.descriptionFungibleTokensLabel}>paras-token-v2.testnet</span>&nbsp;
        is&nbsp;a&nbsp;token address,
        <span className={styles.descriptionFungibleTokensLabel}>776:26</span>&nbsp;is
        a&nbsp;token&nbsp;id.
      </div>
      <div className={styles.description}>
        A&nbsp;lootbox can contain multiple NFT tokens. The button &laquo;add NFT&raquo; allows the
        user to&nbsp;enter the details of&nbsp;another token.
      </div>
      <div
        className={cn(
          styles.walletConnectionBlock,
          // styles.dragDrop,
          styles.block_10,
          styles.blockImgNonFungibleTokens,
        )}
      >
        <span className={cn(styles.labelImg, styles.labelImgNonFungibleTokens)}></span>
        <img src={inst_10} className={cn(styles.loadUnpuck, styles.img_10)} />
        <img src={inst_10_1} className={cn(styles.downloads, styles.img_10_1)} />
      </div>
      <div className={styles.description}>
        At&nbsp;the end you have to&nbsp;send multiple transactions. The first one will create
        a&nbsp;lootbox at the least the another one will transfer the NFT token to&nbsp;the lootbox.
      </div>
      <div className={styles.description}>
        After creating a&nbsp;lootbox you need to&nbsp;post a&nbsp;tweet with a&nbsp;text
        that&rsquo;s shown in&nbsp;the next step. It&nbsp;contains a&nbsp;link&nbsp;
        <a
          style={{ cursor: 'default' }}
          className={styles.link}
        >{`https://ltbx.app/<lootbox_id>`}</a>
        &nbsp; which will be&nbsp;replaced with a&nbsp;lootbox picture.
      </div>
      <div
        className={cn(
          styles.walletConnectionBlock,
          styles.block_11,
          styles.blockImgNonFungibleTokens,
        )}
      >
        <span className={cn(styles.labelImg, styles.labelImgNonFungibleTokens)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgNonFungibleTokens)}>
          <span>
            At&nbsp;the end you have to&nbsp;send multiple transactions. The first one will create
            a&nbsp;lootbox at the least the another one will transfer the&nbsp;
            <span className={styles.highlightTitle}>NFT token to&nbsp;the lootbox</span> .
          </span>
        </h3>
        <img src={inst_11} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        What the process of&nbsp;a&nbsp;lootbox twitter post looks like:
      </div>
      <div
        className={cn(
          styles.walletConnectionBlock,
          styles.block_12,
          styles.blockImgNonFungibleTokens,
        )}
      >
        <span className={cn(styles.labelImg, styles.labelImgNonFungibleTokens)}></span>
        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgNonFungibleTokens)}>
          <span>
            What the process of&nbsp;a&nbsp;lootbox&nbsp;
            <span className={styles.highlightTitle}>twitter post</span>&nbsp; looks like:
          </span>
        </h3>
        <img src={inst_12} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        A&nbsp;user that doesn&rsquo;t have the extension installed and/or the dapplet activated
        will see a tweet like this. A&nbsp;user with an&nbsp;activated dapplet will see
        a&nbsp;lootbox picture and will be able to&nbsp;open a&nbsp;lootbox and receive
        a&nbsp;prize.
      </div>
      <div
        className={cn(
          styles.walletConnectionBlock,
          styles.block_13,
          styles.blockImgNonFungibleTokens,
        )}
      >
        <span className={cn(styles.labelImg, styles.labelImgNonFungibleTokens)}></span>

        <h3 className={cn(styles.dragDropTitle, styles.blockTitleImgNonFungibleTokens)}>
          <span style={{ paddingBottom: '20px' }}>
            A&nbsp;user that
            <span className={styles.highlightTitle}>
              doesn&rsquo;t have the extension installed
            </span>
            and/or the dapplet activated will see a&nbsp;tweet like this.
          </span>
          <span>
            A&nbsp;user with an&nbsp;
            <span className={styles.highlightTitle}>activated dapplet</span>
            will see a lootbox picture and will be&nbsp;able to&nbsp;open a&nbsp;lootbox and
            <span className={styles.highlightTitle}>receive a&nbsp;prize</span> .
          </span>
        </h3>
        <div className={styles.wrapperImgBlockNonFungibleTokens}>
          <img src={inst_13} className={styles.dragDropImg} />
          <img src={inst_13_1} className={styles.dragDropImg} />
        </div>
      </div>
    </div>
  );
}

export function Status(InstructionProps: any) {
  return (
    <div className={styles.walletConnection}>
      <h3 className={styles.titleWallet}>Track a&nbsp;lootbox status</h3>
      <div className={styles.description}>
        In&nbsp;the home overlay you can see lootboxes that you created. Every lootbox has
        statistics of drops and a&nbsp;list of&nbsp;the participants.
      </div>
      <div className={cn(styles.walletConnectionBlock, styles.block_14, styles.blockImgStatus)}>
        <span className={cn(styles.labelImg, styles.labelImgStatus)}></span>
        <img src={inst_14} className={styles.dragDropImg} />
      </div>
    </div>
  );
}
