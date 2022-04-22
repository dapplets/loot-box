import React, { FC, useEffect, useState } from 'react';
import styles from './Statistics.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import { LabelSettings } from '../atoms/LabelSettings';
import { Progress } from '../atoms/Progress';
import { StatisticsInfo } from '../atoms/StatisticsInfo';
import { ChartProgress } from '../atoms/CircleChart';
import { StatisticsLink } from '../atoms/StatisticsLink';

export const labels = ['NEAR'];
export const options = {
  chart: {
    height: 174,
    type: 'radialBar',
    fontFamily: 'Roboto, sans-serif',
    foreColor: '#747376',
  },
  colors: ['#F26680'],

  plotOptions: {
    radialBar: {
      hollow: {
        size: '60%',
      },
    },
  },

  labels: ['NEAR'],
};
export interface StatisticsProps {
  stat: any;
}
export const Statistics: FC<StatisticsProps> = (props: StatisticsProps) => {
  const { stat } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperStatistics}>
        {/* ToDo: what's total amount? */}
        <Progress completed={stat.winAmount / stat.totalAmount * 100} bgcolor="#F26680" />
        <div className={cn(styles.Chart)}>
          <div className={cn(styles.ChartAmount)}>
            <LabelSettings title="Win Amount" />
            <ChartProgress
              width={'174px'}
              height={'174px'}
              options={options}
              series={[stat.winAmount / stat.totalAmount * 100 as any]}
            ></ChartProgress>
            <span className={styles.span} />
          </div>
          <div className={cn(styles.ChartBalance)}>
            <LabelSettings title="Current Balance" />
            <ChartProgress
              width={'174px'}
              height={'174px'}
              options={options}
              series={[(1 - stat.winAmount / stat.totalAmount) * 100 as any]}
            />
          </div>
        </div>
        <div className={cn(styles.statisticInfo)}>
          <StatisticsInfo title="Total Views" value={`${stat.totalViews}`} />
          {/* <StatisticsInfo title="ESTIMATED END IN" value="5 min" /> */}
        </div>
      </div>

      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink label="Copy code" />
        </Link>
      </div>
    </div>
  );
};
