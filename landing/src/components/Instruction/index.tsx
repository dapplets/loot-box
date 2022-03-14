import React, { FC, useState, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';
import styles from './Instruction.module.scss';
import { Preloader } from '../Preloader';
import { Header } from '../Header';
import { Footer } from '../Footer';

import bg from '../../img/instruction/bg.png';
import connect_near from '../../img/instruction/connect_near.png';
import connecting from '../../img/instruction/connecting.png';
import continueImg from '../../img/instruction/continue.png';
import downloads from '../../img/instruction/downloads.png';
import drag_drop from '../../img/instruction/drag_drop.png';
import instruction_bg from '../../img/instruction/instruction_bg.png';
import load_unpuck from '../../img/instruction/load_unpuck.png';
import near_wallet from '../../img/instruction/near_wallet.png';
import wallets_connect from '../../img/instruction/walets_connect.png';
import wallets from '../../img/instruction/walets.png';

import { Routes, Route, Link } from 'react-router-dom';

export interface InstructionProps {
  completed: number;
  bgcolor: string;
  // stat: number;
}

export function Instruction(InstructionProps: any) {
  return (
    <div className={styles.wrapper}>
      <header>
        <Header />
      </header>
      <div className={styles.content}>
        <Start />
        <Installation />
        <Wallet />
        <div className={styles.accepting}>
          <h3 className={styles.titleWallet}>Accepting received lootboxes</h3>
          <div className={styles.description}>
            If you already have tokens that were donated to you by other users, you can collect them
            by clicking. The button will show how many tokens were donated to you at the moment,
            which you have not yet collected. When you click on the button a new page will open.
          </div>
          <img src={bg} className={styles.bg} />
          <div className={styles.description}>
            Click Allow to accept the tokens donated to you. After this, the Claim button should
            change to 0 and the tokens should be added to your account.
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}

export function Start(InstructionProps: any) {
  return (
    <div className={styles.start}>
      <h1 className={styles.titleInstruction}>How to start using Lootboxes Dapplet</h1>
      <ol className={styles.list}>
        <li className={styles.item}>
          <a className={styles.link}>Lobortis aenean sit.</a>
        </li>
        <li className={styles.item}>
          <a className={styles.link}>Nec sagittis quis rhoncus sit at leo.</a>
        </li>
        <li className={styles.item}>
          <a className={styles.link}>Sed sed volutpat mauris vitae. </a>
        </li>
        <li className={styles.item}>
          <a className={styles.link}>Quam magnis quis neque.</a>
        </li>
        <li className={styles.item}>
          <a className={styles.link}>Pulvinar purus nunc, nunc nunc. </a>
        </li>
        <li className={styles.item}>
          <a className={styles.link}>Ultricies sagittis quam eu sapien.</a>
        </li>
      </ol>
      <div className={styles.description}>
        Lorem libero volutpat in condimentum nisl sem suspendisse netus. Suspendisse nulla semper
        sollicitudin cursus ipsum. Eu gravida laoreet fringilla placerat tellus lectus. Ultrices dui
        urna quis commodo. Fringilla felis morbi feugiat ullamcorper fermentum enim tortor turpis
        pellentesque. Et tristique purus amet, vitae suspendisse integer est mauris. Enim, fusce
        nisi, sagittis posuere.
      </div>
    </div>
  );
}

export function Installation(InstructionProps: any) {
  return (
    <div className={styles.installation}>
      <h2 className={styles.titleInstruction}>Browser extension installation</h2>
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
            3. Open <a className={styles.link}>chrome://extensions </a> in a new tab.
          </span>
        </li>
        <li className={styles.item}>
          <span className={styles.itemText}>
            Switch the Developer mode on and press F5 to refresh the page.
          </span>
        </li>
      </ol>
      <div className={styles.dragDrop}>
        <h3 className={styles.dragDropTitle}>Drag &#38; Drop Dapplets Extension</h3>

        <img src={drag_drop} className={styles.dragDropImg} />
      </div>
      <div className={styles.description}>
        P.S. If you are using Ubuntu or possibly another Linux OS the Dapplets extension can
        disappear from the Chrome Extensions after restarting the PC. To avoid this unzip the
        archive and use the Load unpacked button to add the extension.
      </div>
      <div className={styles.dragDrop}>
        <img src={load_unpuck} className={styles.loadUnpuck} />

        <img src={downloads} className={styles.downloads} />
      </div>
    </div>
  );
}

export function Wallet(InstructionProps: any) {
  return (
    <div className={styles.walletConnection}>
      <h3 className={styles.titleWallet}>NEAR Wallet Connection</h3>
      <div className={styles.description}>
        To interact with the Tipping Dapplet, you need to connect a wallet.
      </div>
      <div className={[styles.walletConnectionBlock, styles.block_1].join(' ')}>
        <h3 className={styles.dragDropTitle}>
          Click on Dapplets Extension Icon. The overlay will open. Select the Wallet Tab.
        </h3>
        <img src={wallets} className={styles.dragDropImg} />
      </div>
      <div className={[styles.walletConnectionBlock, styles.block_2].join(' ')}>
        <h3 className={styles.dragDropTitle}>
          You don't have any wallets connected right now. Click the Connect button.
        </h3>
        <img src={wallets_connect} className={styles.dragDropImg} />
      </div>
      <div className={[styles.walletConnectionBlock, styles.block_3].join(' ')}>
        <h3 className={styles.dragDropTitle}>
          An overlay with available wallets will open. We will be using the NEAR Wallet. Click on
          it.
        </h3>
        <img src={near_wallet} className={styles.dragDropImg} />
      </div>
      <div className={[styles.walletConnectionBlock, styles.block_4].join(' ')}>
        <h3 className={styles.dragDropTitle}>
          A new page will open. Click on the blue Next button, and then - on the blue Connect
          button.
        </h3>
        <img src={connect_near} className={styles.dragDropImg} />
      </div>
      <div className={[styles.walletConnectionBlock, styles.block_5].join(' ')}>
        <h3 className={styles.dragDropTitle}>
          After this, the page will close and a new tab will open in the overlay. Press the Continue
          button.
        </h3>
        <img src={connecting} className={styles.dragDropImg} />
      </div>
      <div className={[styles.walletConnectionBlock, styles.block_6].join(' ')}>
        <h3 className={styles.dragDropTitle}>
          Done!
          <br />
          You have connected your wallet.
        </h3>
        <img src={continueImg} className={styles.dragDropImg} />
      </div>
    </div>
  );
}
