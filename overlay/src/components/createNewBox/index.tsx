import cn from 'classnames'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToggle } from '../../hooks/useToggle'
import { getWin } from '../../utils/getWin'
import { Button } from '../atoms/Button'
import { CreatedBox } from '../atoms/CreatedBoxCard'
import { Preloader } from '../atoms/Preloader'
import styles from './CreateNewBox.module.scss'

export interface CreateNewBoxProps {
  children: ReactNode
}

export const CreatedBoxList: FC<CreateNewBoxProps> = (props: CreateNewBoxProps) => {
  const { children } = props

  const [isShowDescription, onShowDescription] = useToggle(false)

  return (
    <div className={cn(styles.wrapper)}>
      <Link to="/select_box" className={cn(styles.firstLine)}>
        <Button
          isShowDescription={isShowDescription}
          appearance="big"
          color="active"
          btnText="Create new box"
        />
      </Link>
      <div className={cn(styles.secondLine)}>{children}</div>
    </div>
  )
}
export default CreatedBoxList

export interface ChildComponentProps {
  label: string
  imgValue: string
  onClick: () => void
  id: string
  status: string
  winnersLabelInfo: any
  loader: boolean
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const { label, imgValue, onClick, winnersLabelInfo, status, loader } = props

  const [winAmount, setWinAmount] = useState('')
  const [isLoad, setLoad] = useState(false)

  useEffect(() => {
    setLoad(true)
    getWin(winnersLabelInfo, setWinAmount)
    setLoad(false)
  }, [])

  return (
    <>
      {isLoad ? (
        <Preloader />
      ) : (
        <CreatedBox
          label={label}
          imageBox={imgValue}
          status={status}
          onClick={onClick}
          WinInfo={winAmount}
          loader={loader}
        />
      )}
    </>
  )
}
