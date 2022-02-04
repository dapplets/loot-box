import React, { useState, useEffect, FC, CSSProperties } from 'react';
import styles from './StatisticsLink.module.scss';
import cn from 'classnames';
import { LinksStep } from '../LinksStep';
import prev from '../../../icons/selectBox/prevStep.svg';
import { Link } from 'react-router-dom';
export interface StatisticsLinkProps {
  label: string;
  className?: string;
}
export const StatisticsLink: FC<StatisticsLinkProps> = (props: StatisticsLinkProps) => {
  const { label } = props;
  return (
    <div className={cn(styles.wrapper)}>
      <Link to="/">
        <LinksStep icon={prev} label="Back" step="prev" />
      </Link>

      <a className={cn(styles.linksNavigation)}>{label}</a>
    </div>
  );
};
