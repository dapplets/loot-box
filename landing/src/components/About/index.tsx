import React, { FC, useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import styles from './About.module.scss';
import { Preloader } from '../Preloader';
import { Routes, Route, Link } from 'react-router-dom';
import imgDef from '../../img/about/img_def.png';

export interface AboutProps {
  completed: number;
  bgcolor: string;
  // stat: number;
}
export function About(AboutProps: any) {
  const [loader, setLoader] = useState(false);
  return (
    <div className={styles.BoxBlock}>
      {(loader && <Preloader />) || (
        <div className={styles.postLoader}>
          <h1 className={styles.boxTitle}>Sed egestas et est amet </h1>
          <div className={styles.boxContent}>
            <div className={styles.description}>
              <p className={styles.text}>
                Sapien, dui dictum cras amet sed in eget cras lacus. Vitae a egestas ornare ut nisl
                imperdiet. Sit eget rhoncus eget volutpat. Sit posuere enim urna fringilla. Laoreet
                velit luctus dui non. Dis et ullamcorper feugiat sollicitudin sed sed lectus dictum.
                Egestas aliquam leo non elit consectetur eu aliquam, non viverra. Ultrices magna
                mattis eu mattis magna in varius. Cum dolor donec in augue. Nulla laoreet proin
                risus magna ultrices mollis tincidunt praesent. Pharetra, massa lectus nunc, aenean
                in nullam a imperdiet maecenas. Odio duis at sapien consectetur nullam ac gravida
                velit urna. Quam arcu vulputate eget dolor viverra volutpat. Purus ultrices duis
                morbi fames risus nulla tempor. Praesent tellus eu a pharetra sit.
              </p>
            </div>
            <div className={styles.boxImg}>
              <img src={imgDef} />
            </div>
            <div className={styles.description}>
              <p className={styles.text}>
                Neque faucibus ut sed neque. Pellentesque nec, lorem massa diam sed ut nibh sed
                aliquet. Mattis eleifend nisl, ac vitae risus duis donec. Mauris bibendum vitae enim
                amet velit ut. Mi ipsum adipiscing ut erat interdum congue proin non. Quisque
                convallis id gravida imperdiet ultrices. Massa egestas tellus euismod molestie
                ultrices fermentum sit. Turpis adipiscing blandit in ornare nulla tortor amet.
                Volutpat duis velit proin ut proin. Platea sit tellus vitae enim turpis donec eu id
                dolor. Quis tempor at massa neque nunc, fringilla vitae.
              </p>
              <p className={styles.text}>
                Ultrices nunc consectetur magna sodales vivamus iaculis nam. Aenean netus volutpat
                praesent et vel. Adipiscing volutpat velit velit pellentesque eu sed. Tortor lacinia
                duis elementum sed consectetur.
              </p>

              <p className={styles.text}>
                Dignissim id mi euismod quis. Donec vestibulum imperdiet nunc quam morbi vel
                aliquam. Tortor, dolor vitae, massa lobortis leo, rutrum. Est, placerat venenatis,
                massa diam luctus quam arcu. Tristique ornare nisl duis nisl at viverra nulla.
                Venenatis egestas hac habitasse condimentum id viverra. Donec est, pharetra dictum
                aliquet faucibus tellus quis. Id duis consequat, at mauris et sit. Integer arcu
                pellentesque id scelerisque feugiat aliquam praesent.
              </p>
            </div>
          </div>

          <div className={styles.buttonBlock}>
            <Link to="/instruction">
              <button className={styles.button}>How to collect?</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
