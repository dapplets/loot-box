import cn from 'classnames'
import React, { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { Message } from '../atoms/Message'
import { SettingTitle } from '../atoms/SettingTitle'
import styles from './DeployBox.module.scss'

export interface DeployBoxProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: any
  winnersLabelInfo: string
  landingUrl: string
}

export const DeployBox: FC<DeployBoxProps> = (props: DeployBoxProps) => {
  const { id, winnersLabelInfo, landingUrl } = props

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle title="Deploy your box" isActive />
      <div className={cn(styles.message)}>
        <Message
          message={`We are holding a ${winnersLabelInfo}  #Giveaway. Click on the lootbox picture and get your prize!`}
          link={`${landingUrl}/${id}/`}
          instruction={`Don’t see the Box? Install this dapp: ${landingUrl}/how-to/`}
          project="The gift box is made with the LootBox Dapplet @lootboxdapp by @dappletsproject"
        />
      </div>

      <div className={cn(styles.navigation)}>
        <Link to="/" className={cn(styles.link)}>
          Done
        </Link>
      </div>
    </div>
  )
}
