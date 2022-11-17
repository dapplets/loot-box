import cn from 'classnames'
import React, { FC } from 'react'
import Down from '../../../icons/createNewBox/down.svg'
import { Avatar } from '../Avatar'
import styles from './Profile.module.scss'

export interface ProfileProps {
  avatar?: string
  hash: string
  isOpenProfile?: boolean
  openChange?: () => void
  onClick?: () => void
  mini?: boolean
}
export const Profile: FC<ProfileProps> = (props: ProfileProps) => {
  const { avatar, hash, isOpenProfile = true, openChange, onClick, mini = false } = props

  return (
    <div className={styles.wrapper}>
      <header className={cn(styles.header, { [styles.mini]: mini })} onClick={openChange}>
        <Avatar avatar={avatar} size="big" className={styles.avatar} />
        {!mini && <p className={styles.hash}>{hash}</p>}
        {!mini && <img src={Down} />}
      </header>
      {isOpenProfile && !mini && (
        <ul
          className={cn(styles.list, {
            [styles.isOpenProfile]: isOpenProfile,
          })}
        >
          <li onClick={onClick} className={styles.item}>
            Log out
          </li>
        </ul>
      )}
    </div>
  )
}
