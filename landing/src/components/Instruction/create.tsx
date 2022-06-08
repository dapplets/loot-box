import React from 'react';
import cn from 'classnames';

import styles from './Instruction.module.scss';

import { Header } from '../Header';
import { Footer } from '../Footer';

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

import m_inst_1 from '../../img/instruction/mobile/mobile_inst_1.svg';
import m_inst_2 from '../../img/instruction/mobile/mobile_inst_2.svg';
import m_inst_3 from '../../img/instruction/mobile/mobile_inst_3.svg';
import m_inst_4 from '../../img/instruction/mobile/mobile_inst_4.svg';
import m_inst_5 from '../../img/instruction/mobile/mobile_inst_5.svg';
import m_inst_6 from '../../img/instruction/mobile/mobile_inst_6.svg';
import m_inst_7 from '../../img/instruction/mobile/mobile_inst_7.svg';
import m_inst_8 from '../../img/instruction/mobile/mobile_inst_8.svg';
import m_inst_9 from '../../img/instruction/mobile/mobile_inst_9.svg';
import m_inst_10 from '../../img/instruction/mobile/mobile_inst_10.svg';
import m_inst_11 from '../../img/instruction/mobile/mobile_inst_11.svg';
import m_inst_12 from '../../img/instruction/mobile/mobile_inst_12.svg';
import m_inst_13 from '../../img/instruction/mobile/mobile_inst_13.svg';
import m_inst_14 from '../../img/instruction/mobile/mobile_inst_14.svg';
import m_inst_15 from '../../img/instruction/mobile/mobile_inst_15.svg';
import m_inst_16 from '../../img/instruction/mobile/mobile_inst_16.svg';

import load_unpuck from '../../img/instruction/load_unpuck.png';
import {
  Activate,
  Creation,
  FungibleTokens,
  Installation,
  NearToken,
  NonFungibleTokens,
  Status,
} from '.';

export interface InstructionProps {
  completed: number;
  bgcolor: string;
  title:string
}

export function Instruction_Create(InstructionProps: any) {
  const{title} = InstructionProps
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Header />
      </header>
      <div className={styles.content}>
        {/* <Start /> */}
        <Installation  title='How to create'/>
        <Activate />
        {/* <Claming />  */}
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
