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
import { Link, useParams } from 'react-router-dom';
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
import { Lootbox } from '../../../../common/interfaces';
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
  stat?: any;
  // creationForm: Lootbox;
  // onCreationFormUpdate: (x: Lootbox) => void;
}

export const StatisticsNear: FC<StatisticsNearPropsStat> = (props: StatisticsNearPropsStat) => {
  // const { creationForm, onCreationFormUpdate } = props;
  const { lootboxId } = useParams();
  const { stat } = props;

  if (stat === null) {
    return <div>Loading</div>;
  }

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

      <Statistics stat={stat} />
    </div>
  );
};
export interface StatisticsNearPropsWinner {
  winners: any;
  // setSelectedLootboxId: void;
  // creationForm: Lootbox;
  // onCreationFormUpdate: (x: Lootbox) => void;
}
export const StatisticsWinners: FC<StatisticsNearPropsWinner> = (
  props: StatisticsNearPropsWinner,
) => {
  const {
    winners,

    //  creationForm, onCreationFormUpdate
  } = props;
  // console.log(winners, 'llaa');
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.titleLinksWinners)}>
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
      <Winner winners={winners} />
      {/* <Statistics /> */}
    </div>
  );
};
export interface StatisticsNearPropsCode {
  // winners: any;
  creationForm: Lootbox;
  onCreationFormUpdate: (x: Lootbox) => void;
}
export const StatisticsCode: FC<StatisticsNearPropsCode> = (props: StatisticsNearPropsCode) => {
  const { creationForm, onCreationFormUpdate } = props;
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
      <Code creationForm={creationForm} onCreationFormUpdate={onCreationFormUpdate} />
      {/* <Winner /> <Statistics /> */}
    </div>
  );
};
