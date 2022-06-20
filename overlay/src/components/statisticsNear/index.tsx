import React, { FC, ReactChild, ReactNode } from 'react';
import styles from './StatisticsNear.module.scss';
import cn from 'classnames';

import { Link, useParams } from 'react-router-dom';
import { StatisticsTitle } from '../atoms/StatisticsTitle';
import { Code } from '../Code';
import { Winner } from '../Winners';
import { Statistics } from '../Statistics';
import { Lootbox } from '@loot-box/common/interfaces';

export interface StatisticsNearProps {
  creationForm: Lootbox;
  onCreationFormUpdate: (x: Lootbox) => void;
}

const titleList = [
  { id: 0, title: 'Statistics' },
  { id: 1, title: 'winners' },
  { id: 2, title: 'Code' },
];

export interface StatisticsNearPropsStat {
  
  children?:ReactChild| ReactNode
}
export  const StatisticsNear: FC<StatisticsNearPropsStat> = (props: StatisticsNearPropsStat) =>{
 const {children, } = props
  return (
    <div className={cn(styles.wrapper)}>
    <div className={cn(styles.titleLinks)}>
      <div>
        <Link to="/statistics">
          <StatisticsTitle key={0} title={titleList[0].title} isActive />
        </Link>
      </div>
      <div>
        <Link to="/winners">
          <StatisticsTitle key={1} title={titleList[1].title} />
        </Link>
      </div>
      <div>
        <Link to="/code">
          <StatisticsTitle key={2} title={titleList[2].title} />
        </Link>
      </div>
    </div>

    {children}
  </div>
  )
}


