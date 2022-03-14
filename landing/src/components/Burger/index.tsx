import React, { Component, useState } from 'react';
import cn from 'classnames';
import styles from './Burger.module.scss';
import logo from '../../img/header/Logo.svg';
import { Link } from 'react-router-dom';

export const Burger = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [active, setActive] = useState('');
  const toggleMenu = () => {
    setIsMenuOpen((isOpen) => !isOpen);
    // event.currentTarget.classList.toggle('active');
  };
  let classNameWrapper = '';
  if (isMenuOpen) {
    classNameWrapper += ' active';
  }
  // target.classList.toggle('active');

  return (
    <div className={styles.wrapper + `${classNameWrapper}`}>
      <div className={styles.blockButton} onClick={toggleMenu}>
        <span className={styles.button}></span>
      </div>

      {isMenuOpen && (
        <div className={styles.menu}>
          <div className={styles.blockHeader}>
            <div className={styles.logoBlock}>
              <img src={logo} />
            </div>
            <div className={styles.blockButtonNew} onClick={toggleMenu}>
              <span className={styles.buttonNew}></span>
            </div>
          </div>

          <ul className={styles.menuList}>
            <li className={styles.menuItem}>
              <Link to="/instruction" className={styles.menuLink} onClick={toggleMenu}>
                How to collect
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link className={styles.menuLink} to="/about" onClick={toggleMenu}>
                About dapplet
              </Link>
            </li>
          </ul>
          <div className={styles.menuSocial}>
            <div className={styles.linkBlock}>
              <ul className={styles.listSocial}>
                <li className={styles.listItemSocial}>
                  <a
                    className={styles.linkSocial}
                    href="https://github.com/dapplets"
                    target="_blank"
                  >
                    {/* <img src={git} alt="github" /> */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40ZM4 20C4 11.16 11.16 4 20 4C28.84 4 36 11.16 36 20C35.999 23.3524 34.9469 26.6201 32.9916 29.3432C31.0362 32.0662 28.2762 34.1076 25.1 35.18C24.3 35.34 24 34.84 24 34.42C24 34.2394 24.0022 33.927 24.0052 33.511C24.0111 32.6828 24.02 31.4444 24.02 30.02C24.02 28.52 23.52 27.56 22.94 27.06C26.5 26.66 30.24 25.3 30.24 19.16C30.24 17.4 29.62 15.98 28.6 14.86C28.76 14.46 29.32 12.82 28.44 10.62C28.44 10.62 27.1 10.18 24.04 12.26C22.76 11.9 21.4 11.72 20.04 11.72C18.68 11.72 17.32 11.9 16.04 12.26C12.98 10.2 11.64 10.62 11.64 10.62C10.76 12.82 11.32 14.46 11.48 14.86C10.46 15.98 9.84 17.42 9.84 19.16C9.84 25.28 13.56 26.66 17.12 27.06C16.66 27.46 16.24 28.16 16.1 29.2C15.18 29.62 12.88 30.3 11.44 27.88C11.14 27.4 10.24 26.22 8.98 26.24C7.64 26.26 8.44 27 9 27.3C9.68 27.68 10.46 29.1 10.64 29.56C10.96 30.46 12 32.18 16.02 31.44C16.02 32.3144 16.0285 33.1547 16.0344 33.7387C16.0376 34.0497 16.04 34.288 16.04 34.42C16.04 34.84 15.74 35.32 14.94 35.18C8.58 33.06 4 27.08 4 20Z"
                        fill="#747376"
                      />
                    </svg>
                  </a>
                </li>
                <li className={styles.listItemSocial}>
                  <a
                    className={styles.linkSocial}
                    href="https://discord.com/invite/YcxbkcyjMV"
                    target="_blank"
                  >
                    {/* <img src={discord} alt="discord" /> */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40ZM24.1947 9.00241C26.2908 9.35686 28.2952 9.98019 30.1652 10.8235C30.1815 10.83 30.195 10.8422 30.2031 10.8577C33.5165 15.6513 35.1519 21.0609 34.5408 27.2869C34.5393 27.3 34.5351 27.3127 34.5283 27.3241C34.5216 27.3355 34.5125 27.3453 34.5017 27.3529C32.2792 28.972 29.799 30.2039 27.1659 30.9963C27.1473 31.0019 27.1275 31.0015 27.1091 30.9954C27.0908 30.9893 27.0747 30.9777 27.0632 30.9621C26.5095 30.2031 26.006 29.4037 25.566 28.5641C25.56 28.5525 25.5565 28.5398 25.5558 28.5268C25.5552 28.5137 25.5572 28.5007 25.562 28.4886C25.5667 28.4764 25.574 28.4654 25.5833 28.4563C25.5927 28.4472 25.6038 28.4402 25.6161 28.4357C26.4142 28.14 27.1744 27.7843 27.9053 27.3639C27.9184 27.3561 27.9293 27.3453 27.9371 27.3323C27.9449 27.3193 27.9493 27.3046 27.9501 27.2894C27.9508 27.2743 27.9478 27.2592 27.9412 27.2455C27.9347 27.2319 27.9249 27.22 27.9127 27.2111C27.7574 27.0974 27.6047 26.9789 27.458 26.8591C27.4445 26.8484 27.4284 26.8417 27.4113 26.8397C27.3942 26.8378 27.3769 26.8407 27.3614 26.8481C22.618 29.0041 17.4199 29.0041 12.6202 26.8481C12.6047 26.8411 12.5876 26.8385 12.5708 26.8407C12.554 26.8429 12.5381 26.8496 12.5249 26.8603C12.3782 26.9789 12.2242 27.0974 12.0702 27.2111C12.0581 27.2202 12.0484 27.2322 12.0421 27.246C12.0358 27.2598 12.033 27.275 12.0339 27.2901C12.0349 27.3052 12.0396 27.3199 12.0477 27.3328C12.0557 27.3457 12.0668 27.3563 12.08 27.3639C12.8134 27.7808 13.5784 28.1396 14.368 28.437C14.4193 28.4565 14.4438 28.5152 14.4181 28.5641C13.9879 29.405 13.4843 30.2055 12.9197 30.9633C12.9077 30.9783 12.8915 30.9894 12.8732 30.995C12.8549 31.0007 12.8353 31.0007 12.817 30.9951C10.1884 30.2004 7.71224 28.9692 5.49221 27.3529C5.48166 27.3448 5.47286 27.3347 5.46635 27.3231C5.45984 27.3116 5.45574 27.2988 5.45432 27.2856C4.94221 21.9005 5.98476 16.447 9.78832 10.8553C9.79768 10.8406 9.81133 10.8291 9.82743 10.8223C11.6987 9.97775 13.7031 9.35441 15.798 8.99997C15.8169 8.99697 15.8363 8.99981 15.8535 9.00811C15.8708 9.01641 15.8851 9.02977 15.8945 9.04641C16.1736 9.53313 16.4254 10.035 16.6487 10.5497C18.8718 10.2176 21.1319 10.2176 23.355 10.5497C23.5554 10.0853 23.8414 9.49741 24.0981 9.04641C24.1076 9.02997 24.1221 9.0169 24.1394 9.00902C24.1567 9.00114 24.176 8.99883 24.1947 9.00241ZM12.4992 21.0975C12.4992 22.6999 13.6909 24.0064 15.1355 24.0064C16.6034 24.0064 17.7719 22.7011 17.7719 21.0975C17.7951 19.505 16.6144 18.1886 15.1355 18.1886C13.6677 18.1886 12.4992 19.494 12.4992 21.0975ZM22.2464 21.0975C22.2464 22.6999 23.4369 24.0064 24.8828 24.0064C26.3629 24.0064 27.5191 22.7011 27.5191 21.0975C27.5423 19.505 26.3617 18.1886 24.8828 18.1886C23.4137 18.1886 22.2464 19.494 22.2464 21.0975Z"
                        fill="#747376"
                      />
                    </svg>
                  </a>
                </li>
                <li className={styles.listItemSocial}>
                  <a className={styles.linkSocial} href="https://t.me/dapplets" target="_blank">
                    {/* <img src={tg} alt="telegram" /> */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M40 20C40 31.045 31.045 40 20 40C8.955 40 0 31.045 0 20C0 8.955 8.955 0 20 0C31.045 0 40 8.955 40 20ZM20.7167 14.765C18.7717 15.5733 14.8833 17.2483 9.05333 19.7883C8.10667 20.165 7.61 20.5333 7.565 20.8933C7.48833 21.5033 8.25167 21.7433 9.28833 22.0683C9.43 22.1133 9.57667 22.1583 9.72667 22.2083C10.7483 22.54 12.1217 22.9283 12.835 22.9433C13.4833 22.9567 14.2067 22.69 15.005 22.1433C20.4517 18.465 23.2633 16.6067 23.44 16.5667C23.565 16.5383 23.7383 16.5017 23.855 16.6067C23.9717 16.71 23.96 16.9067 23.9483 16.96C23.8717 17.2817 20.8817 20.0633 19.3317 21.5033C18.8483 21.9517 18.5067 22.27 18.4367 22.3433C18.28 22.505 18.12 22.66 17.9667 22.8083C17.0167 23.7217 16.3067 24.4083 18.0067 25.5283C18.8233 26.0667 19.4767 26.5117 20.1283 26.955C20.84 27.44 21.55 27.9233 22.47 28.5267C22.7033 28.68 22.9267 28.8383 23.145 28.9933C23.9733 29.585 24.7183 30.115 25.6383 30.0317C26.1717 29.9817 26.725 29.48 27.005 27.9817C27.6667 24.4383 28.97 16.765 29.2717 13.6017C29.29 13.339 29.2788 13.0751 29.2383 12.815C29.2141 12.6049 29.1118 12.4116 28.9517 12.2733C28.7133 12.0783 28.3433 12.0367 28.1767 12.04C27.425 12.0533 26.2717 12.455 20.7167 14.765Z"
                        fill="#747376"
                      />
                    </svg>
                  </a>
                </li>
                <li className={styles.listItemSocial}>
                  <a
                    className={styles.linkSocial}
                    href="https://twitter.com/dappletsproject"
                    target="_blank"
                  >
                    {/* <img src={tweet} alt="twitter" /> */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 0C8.95536 0 0 8.95536 0 20C0 31.0446 8.95536 40 20 40C31.0446 40 40 31.0446 40 20C40 8.95536 31.0446 0 20 0ZM29.6116 15.0759C29.625 15.2857 29.625 15.5045 29.625 15.7188C29.625 22.2723 24.6339 29.8214 15.5134 29.8214C12.7009 29.8214 10.0938 29.0045 7.89732 27.5982C8.29911 27.6429 8.68304 27.6607 9.09375 27.6607C11.4152 27.6607 13.5491 26.875 15.25 25.5446C13.0714 25.5 11.2411 24.0714 10.6161 22.1071C11.3795 22.2188 12.067 22.2188 12.8527 22.0179C11.7309 21.79 10.7227 21.1807 9.99918 20.2937C9.2757 19.4066 8.88164 18.2965 8.88393 17.1518V17.0893C9.54018 17.4598 10.3125 17.6875 11.1205 17.7188C10.4413 17.266 9.88419 16.6527 9.49871 15.9332C9.11323 15.2136 8.91127 14.4101 8.91072 13.5938C8.91072 12.6696 9.15179 11.8259 9.58482 11.0938C10.8299 12.6265 12.3836 13.8801 14.1449 14.7731C15.9062 15.666 17.8358 16.1784 19.808 16.2768C19.1071 12.9063 21.625 10.1786 24.6518 10.1786C26.0804 10.1786 27.3661 10.7768 28.2723 11.7411C29.3929 11.5312 30.4643 11.1116 31.4196 10.5491C31.0491 11.6964 30.2723 12.6652 29.2411 13.2768C30.2411 13.1696 31.2054 12.8929 32.0982 12.5045C31.4241 13.4955 30.5804 14.375 29.6116 15.0759Z"
                        fill="#747376"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.copyBlock}>&copy;&nbsp;2022 LootBox Dapplet</div>
          </div>
        </div>
      )}
    </div>
  );
};