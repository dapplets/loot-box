import { type } from 'os';
import React, {
  useState,
  FC,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ChangeEvent,
  ReactNode,
  ReactChild,
} from 'react';
import { useToggle } from '../../../hooks/useToggle';
import { InputPanel, InputProps } from '../Input';
import { LabelSettings } from '../LabelSettings';
import { CreatedBox } from '../CreatedBoxCard';
import { CreateNewBox } from '../../createNewBox';
import { DeployBox } from '../../deployBox';
import { Button } from '../Button';
import box1 from '../../../icons/createNewBox/box1.png';
import box2 from '../../../icons/createNewBox/box2.png';
import box3 from '../../../icons/createNewBox/box3.png';
import box4 from '../../../icons/createNewBox/box4.png';
import { RadioButton } from '../RadioButton';
import styles from '../../boxSettings/BoxSettings.module.scss';
export interface TestProps {
  // prop?: '20';
  // numChildren: number;
}
// export const IMG = [box1, box2, box3, box4];

// export const Test: FC<TestProps> = (props) => {
//   const [fullSize, setFullSIze] = useState();

//   const getImage = (IMG: any) => {
//     console.log(IMG);
//   };

//   return (
//     <div className="container">
//       <img
//         className="api-image"
//         src={IMG[0]}
//         onClick={() => {
//           getImage(IMG);
//         }}
//       ></img>
//       <div className="full-size-image">
//         <img src={fullSize} />
//       </div>
//     </div>
//   );
// };

export const Test: FC<TestProps> = (props: TestProps) => {
  // const { numChildren } = props;

  // const onAddChild = () => {
  //   useState(numChildren + 1);
  // };
  // const [state, setState] = useState([])

  //   const removeItem = (id:number) => {
  //      setState(prevState => prevState.filter((el, id) => el.id !== id))
  //   }
  const [numChildren, onCount] = useState(0);
  const onAddChild = () => {
    onCount(numChildren + 1);
  };
  const onDel = () => {
    onCount(numChildren - 1);
  };

  const children = [];

  for (let i = 0; i < numChildren; i += 1) {
    children.push(<ChildComponent onDel={onDel} key={i} number={i} />);
  }

  return (
    <div>
      {children}
      <Button appearance="small" btnText="lala" isShowDescription={false} onClick={onAddChild} />
    </div>
  );
};
export interface ParentProps {
  addChild: () => void;
  // children: ReactNode;
}
// export const ParentComponent: FC<ParentProps> = (props: ParentProps) => {
//   const { addChild } = props;

//   return (
//     <div className="card calculator">
//       <p>
//         <a href="#" onClick={addChild}>
//           Add Another Child Component
//         </a>
//       </p>
//       {/* <div id="children-pane">{children}</div> */}
//     </div>
//   );
// };
export interface ChildComponentProps {
  number: number;
  onDel: () => void;
}

export const ChildComponent: FC<ChildComponentProps> = (props: ChildComponentProps) => {
  const { number, onDel } = props;
  return (
    <div className={styles.addNftBlock}>
      <LabelSettings title="Marketplace" />
      <div className={styles.radiobtnMarketplace}>
        <RadioButton id={`1_marketplace${number}`} value="Paras" name={`Marketplace${number}`} />
        <RadioButton id={`2_marketplace${number}`} value="Minbase" name={`Marketplace${number}`} />
        <RadioButton
          id={`3_marketplace${number}`}
          value="Custom NFT"
          name={`Marketplace${number}`}
          // onChange={onShowDescription_CustomNFT}
          // key={item}
        />
      </div>
      <div className={styles.addNFT}>
        <div className={styles.inputCustomNFT}>
          <InputPanel type="string" appearance="medium" placeholder="Token ID" />
          <InputPanel type="string" appearance="small" placeholder="Quantity" />
        </div>
        <Button
          onClick={onDel}
          isShowDescription={false}
          btnText="Remove NFT"
          appearance="remove"
        />
      </div>
    </div>
  );
};
