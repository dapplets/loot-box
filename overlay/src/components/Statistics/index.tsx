import React, { FC } from 'react';
import styles from './Statistics.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import progr from '../../icons/progress/progress.svg';
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
  // imageBox: string;
}
export const Statistics: FC<StatisticsProps> = (props: StatisticsProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperStatistics}>
        <Progress completed={55} bgcolor="#F26680" />
        <div className={cn(styles.Chart)}>
          <div className={cn(styles.ChartAmount)}>
            <LabelSettings title="Win Amount" />
            <ChartProgress width={'174px'} height={'174px'} options={options} series={[75]} />
          </div>
          <div className={cn(styles.ChartBalance)}>
            <LabelSettings title="Current Balance" />
            <ChartProgress width={'174px'} height={'174px'} options={options} series={[75]} />
          </div>
        </div>
        <div className={cn(styles.statisticInfo)}>
          <StatisticsInfo title="Total Views" value="1000000" />
          <StatisticsInfo title="ESTIMATED END IN" value="5 min" />
        </div>
      </div>

      <div className={cn(styles.link)}>
        <StatisticsLink label="Copy code" />
      </div>
    </div>
  );
};
