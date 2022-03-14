import React, { useState, useEffect, FC, CSSProperties } from 'react';
import styles from './CircleChart.module.scss';
import cn from 'classnames';
import Chart from 'react-apexcharts';

export interface ChartProps {
  options: {};
  series: [75];
  width: string;
  height: string;
}

export const ChartProgress: FC<ChartProps> = (props: ChartProps) => {
  const { series, options, width, height } = props;
  return <Chart series={series} width={width} height={height} options={options} type="radialBar" />;
};
