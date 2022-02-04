import cn from 'classnames';
import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  FunctionComponent,
} from 'react';
import styles from './LinksStep.module.scss';

interface LinksStepProps {
  step: 'next' | 'prev';
  label: string;
  className?: string;
  icon: string;
}

export const LinksStep: FC<LinksStepProps> = (props: LinksStepProps) => {
  const { step, label, className, icon } = props;
  return (
    <span
      className={cn(
        styles.linksNavigation,
        {
          [styles.next]: step === 'next',
          [styles.prev]: step === 'prev',
        },
        className,
      )}
    >
      {label}
      <img src={icon} />
    </span>
  );
};
