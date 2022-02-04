// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useState, useEffect, FC, CSSProperties } from 'react';
import styles from './CircleChart.module.scss';
import cn from 'classnames';
import Chart from 'react-apexcharts';
// export interface DoughnutProps {}
// ChartJS.register(ArcElement, Tooltip, Legend);

// export const data = {
//   datasets: [
//     {
//       data: [75, 25],
//       backgroundColor: ['rgba(242, 102, 128, 1)', 'rgba(196, 196, 196, 1)'],
//     },
//   ],
// };
// export const options = {
//   responsive: true,
//   cutoutPercentage: 75,
//   title: {
//     display: false,
//     // text:'Rating',
//     // fontSize:200
//   },
//   legend: {
//     display: false,
//     // position:'right'
//   },
// };
// export const DoughnutProgress: FC<ChartProps> = (props: ChartProps) => {
//   return <Doughnut data={data} options={options} />;
// };
export interface ChartProps {
  options: {};
  series: [75];
  width: string;
  height: string;
  // labels: [];
}

export const ChartProgress: FC<ChartProps> = (props: ChartProps) => {
  const { series, options, width, height } = props;
  return <Chart series={series} width={width} height={height} options={options} type="radialBar" />;
};
