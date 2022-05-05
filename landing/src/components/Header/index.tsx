import React from 'react';

import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import logo from '../../img/header/Logo.svg';
import { Burger } from '../Burger';
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
              <Link to="/instruction" className={styles.link}>
                How to collect
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
  );
};
