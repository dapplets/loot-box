import React from 'react'
import {
  Activate,
  Creation,
  FungibleTokens,
  Installation,
  NearToken,
  NonFungibleTokens,
  Status,
} from '.'
import { Footer } from '../Footer'
import { Header } from '../Header'
import styles from './Instruction.module.scss'

export interface InstructionProps {
  completed: number
  bgcolor: string
  title: string
}

export function Instruction_Create(InstructionProps: any) {
  const { title } = InstructionProps
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Header />
      </header>
      <div className={styles.content}>
        {/* <Start /> */}
        <Installation title="How to create" />
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
  )
}
