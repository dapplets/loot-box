import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  ChangeEvent,
  ChangeEventHandler,
} from 'react';
import styles from './StatisticsNear.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { StatisticsTitle } from '../atoms/StatisticsTitle';
import { LabelSettings } from '../atoms/LabelSettings';
import { Progress } from '../atoms/Progress';
import { StatisticsInfo } from '../atoms/StatisticsInfo';
import { ChartProgress } from '../atoms/CircleChart';
import { StatisticsLink } from '../atoms/StatisticsLink';
import { useToggle } from '../../hooks/useToggle';
import { WinnersInfo } from '../atoms/WinnersInfo';
import { InputPanel } from '../atoms/Input';
import { TextArea } from '../atoms/TextArea';
import { Message } from '../atoms/Message';
import { Code } from '../Code';
import { Winner } from '../Winners';
import { Statistics } from '../Statistics';
export interface StatisticsNearProps {
  // imageBox: string;
}

const titleList = [
  { id: 0, title: 'Statistics' },
  { id: 1, title: 'winners' },
  { id: 2, title: 'Code' },
];
export const StatisticsNear: FC<StatisticsNearProps> = (props: StatisticsNearProps) => {
  // const [isDappletActive, onDappletActive] = useToggle(false);

  // const stopEvent = (e: any) => {
  //   e.preventDefault();
  //   onDappletActive;
  // };
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.titleLinks)}>
        {/* {titleList.map(({ id, title }) => (
          <StatisticsTitle
            onClick={onDappletActive}
            key={id}
            title={title}
            isActive={title === 'Statistics' && isDappletActive}
          />
        ))} */}
        <div>
          <Link to="/statistics">
            <StatisticsTitle
              // onClick={onDappletActive}
              key={0}
              title={titleList[0].title}
              isActive
            />
          </Link>
        </div>
        <div>
          <Link to="/winners">
            <StatisticsTitle
              // onClick={onDappletActive}
              key={1}
              title={titleList[1].title}
              // isActive={isDappletActive}
            />
          </Link>
        </div>
        <div>
          <Link to="/code">
            <StatisticsTitle
              // onClick={onDappletActive}
              key={2}
              title={titleList[2].title}
              // isActive={isDappletActive}
            />
          </Link>
        </div>
      </div>
      {/* <Code /> <Winner />  */}
      <Statistics />
    </div>
  );
};
export const StatisticsWinners: FC<StatisticsNearProps> = (props: StatisticsNearProps) => {
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.titleLinks)}>
        {/* {titleList.map(({ id, title }) => (
          <StatisticsTitle
            onClick={onDappletActive}
            key={id}
            title={title}
            isActive={title === 'Statistics' && isDappletActive}
          />
        ))} */}
        <div>
          <Link to="/statistics">
            <StatisticsTitle key={0} title={titleList[0].title} />
          </Link>
        </div>
        <div>
          <Link to="/winners">
            <StatisticsTitle key={1} title={titleList[1].title} isActive />
          </Link>
        </div>
        <div>
          <Link to="/code">
            <StatisticsTitle key={2} title={titleList[2].title} />
          </Link>
        </div>
      </div>
      {/* <Code />  */}
      <Winner />
      {/* <Statistics /> */}
    </div>
  );
};

export const StatisticsCode: FC<StatisticsNearProps> = (props: StatisticsNearProps) => {
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.titleLinks)}>
        {/* {titleList.map(({ id, title }) => (
          <StatisticsTitle
            onClick={onDappletActive}
            key={id}
            title={title}
            isActive={title === 'Statistics' && isDappletActive}
          />
        ))} */}
        <div>
          <Link to="/statistics">
            <StatisticsTitle key={0} title={titleList[0].title} />
          </Link>
        </div>
        <div>
          <Link to="/winners">
            <StatisticsTitle key={1} title={titleList[1].title} />
          </Link>
        </div>
        <div>
          <Link to="/code">
            <StatisticsTitle key={2} title={titleList[2].title} isActive />
          </Link>
        </div>
      </div>
      <Code />
      {/* <Winner /> <Statistics /> */}
    </div>
  );
};
