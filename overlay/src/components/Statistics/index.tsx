import cn from 'classnames'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { ChartProgress } from '../atoms/CircleChart'
import { LabelSettings } from '../atoms/LabelSettings'
import { Progress } from '../atoms/Progress'
import { StatisticsInfo } from '../atoms/StatisticsInfo'
import { StatisticsLink } from '../atoms/StatisticsLink'
import styles from './Statistics.module.scss'

export interface StatisticsProps {
  statistics: any
  winnersLabelInfo: any
}
export const Statistics: FC<StatisticsProps> = (props: StatisticsProps) => {
  const { statistics, winnersLabelInfo } = props
  if (statistics === null || statistics === undefined) {
    return <div>Loading</div>
  }

  const newWinInfo = (str: string) => {
    const newStr = str.replace(/[-]{0,1}[\d]*[\.]{0,1}[\d]+/g, '')
    return newStr
  }

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

    labels: [`${newWinInfo(winnersLabelInfo)}`],
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperStatistics}>
        <Progress completed={statistics.completedPercents} bgcolor="#F26680" />
        <div className={cn(styles.Chart)}>
          <div className={cn(styles.ChartAmount)}>
            <LabelSettings title="Win Amount" />
            <ChartProgress
              width={'174px'}
              height={'174px'}
              options={options}
              series={[statistics.completedPercents as any]}
            ></ChartProgress>
            <span className={styles.span} />
          </div>
          <div className={cn(styles.ChartBalance)}>
            <LabelSettings title="Current Balance" />
            <ChartProgress
              width={'174px'}
              height={'174px'}
              options={options}
              series={[statistics.remainingPercents as any]}
            />
          </div>
        </div>
        <div className={cn(styles.statisticInfo)}>
          <StatisticsInfo title="Total Views" value={`${statistics.totalViews}`} />
        </div>
      </div>

      <div className={cn(styles.link)}>
        <Link to="/">
          <StatisticsLink />
        </Link>
      </div>
    </div>
  )
}
