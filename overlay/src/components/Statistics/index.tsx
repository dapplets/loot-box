import React, { FC, useEffect, useMemo, useState } from 'react';
import styles from './Statistics.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import { LabelSettings } from '../atoms/LabelSettings';
import { Progress } from '../atoms/Progress';
import { StatisticsInfo } from '../atoms/StatisticsInfo';
import { ChartProgress } from '../atoms/CircleChart';
import { StatisticsLink } from '../atoms/StatisticsLink';



export interface StatisticsProps {
  stat: any;
  winInfo: any;
}
export const Statistics: FC<StatisticsProps> = (props: StatisticsProps) => {
  const { stat, winInfo } = props;

  const newWinInfo = (str: string) => {
    const newStr = str.replace(/[-]{0,1}[\d]*[\.]{0,1}[\d]+/g, '');
    return newStr;
  };

  const options = {
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

 
    labels: [`${newWinInfo(winInfo)}`],
  };

  
  

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperStatistics}>
  
        <Progress completed={stat.completedPercents} bgcolor="#F26680" />
        <div className={cn(styles.Chart)}>
          <div className={cn(styles.ChartAmount)}>
            <LabelSettings title="Win Amount" />
            <ChartProgress
              width={'174px'}
              height={'174px'}
              options={options}
              series={[stat.completedPercents as any]}
            ></ChartProgress>
            <span className={styles.span} />
          </div>
          <div className={cn(styles.ChartBalance)}>
            <LabelSettings title="Current Balance" />
            <ChartProgress
              width={'174px'}
              height={'174px'}
              options={options}
              series={[stat.remainingPercents as any]}
            />
          </div>
        </div>
        <div className={cn(styles.statisticInfo)}>
          <StatisticsInfo title="Total Views" value={`${stat.totalViews}`} />
        </div>
      </div>

      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink
   
          />
        </Link>
      </div>
    </div>
  );
};
