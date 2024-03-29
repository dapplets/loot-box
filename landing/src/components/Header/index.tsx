import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../img/header/Logo.svg'
import { Burger } from '../Burger'
import styles from './Header.module.scss'

export const Header = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerBlock}>
        <div className={styles.logoBlock}>
          <Link to="/">
            <img src={logo} />
          </Link>
        </div>
        <Burger />
        <div className={styles.linkBlock}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <Link to="/create" className={styles.link}>
                How to&nbsp;create
              </Link>
            </li>
            <li className={styles.listItem}>
              <Link to="/how-to" className={styles.link}>
                How to&nbsp;collect
              </Link>
            </li>
            <li className={styles.listItem}>
              <Link className={styles.link} to="/about">
                About dapplet
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
