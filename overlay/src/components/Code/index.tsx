import cn from 'classnames'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Message } from '../atoms/Message'
import { StatisticsLink } from '../atoms/StatisticsLink'
import styles from './Code.module.scss'

export interface CodeProps {
  onChange?: () => void
  onSubmit?: () => void
  id: any
  winnersLabelInfo: any
  landingUrl: string
}

export const Code: FC<CodeProps> = (props: CodeProps) => {
  const { id, winnersLabelInfo, landingUrl } = props

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.code)}>
        <div className={styles.lootboxCode}>
          <Message
            message={`We are holding a ${winnersLabelInfo} #Giveaway. Click on the lootbox picture and get your prize!`}
            link={`${landingUrl}/${id}/`}
            instruction={`Don’t see the Box? Install this dapp: ${landingUrl}/how-to/`}
            project="The gift box is made with the LootBox Dapplet @lootboxdapp by @dappletsproject"
          />
        </div>
      </div>
      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink
          // label="Done"
          />
        </Link>
      </div>
    </div>
  )
}
