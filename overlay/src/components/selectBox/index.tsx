import React, { CSSProperties, ReactElement, ReactNode, FC, useState } from 'react';
import { SettingTitle } from '../atoms/SettingTitle';
import styles from './SelectBox.module.scss';
import cn from 'classnames';
import box1 from '../../icons/createNewBox/box1.png';
import box2 from '../../icons/createNewBox/box2.png';
import box3 from '../../icons/createNewBox/box3.png';
import box4 from '../../icons/createNewBox/box4.png';
import left from '../../icons/selectBox/sliderLeft.svg';
import right from '../../icons/selectBox/sliderRight.svg';
import { LinksStep } from '../atoms/LinksStep';
import NextStep from '../../icons/selectBox/NextStep.svg';
import PrevStep from '../../icons/selectBox/prevStep.svg';
import { Link } from 'react-router-dom';
import { Test } from '../atoms/test';
// export interface SelectBoxProps {
//   children?: ReactNode;
//   imgLink?: string;
//   id?: number;
//   setRef?: any;
//   onClick?: () => void;
//   image?: string;
//   onChange_IMG?: () => void;
//   valueIMG?: string;
// }
// export const IMG = [box1, box2, box3, box4];
// interface SliderProps {
//   id: number;
//   onSetId: any;
//   imgs: any;
// }
// export const Slider: FC<SliderProps> = (props: SliderProps) => {
//   const { id, onSetId, imgs } = props;

//   return (
//     <div className={cn(styles.wrapperSlider)}>
//       <div className={cn(styles.left)} onClick={() => onSetId(Math.max(id - 1, 0))}>
//         <img src={left} />
//       </div>
//       {imgs.map((img: any, index: any) => (
//         <img
//           src={img}
//           onClick={() => {
//             onSetId(index);
//             // console.log(IMG[id]);
//           }}
//           alt={img}
//           key={index}
//           className={cn(styles.choiseImage)}
//           id={index}
//         />
//       ))}
//       <div className={cn(styles.right)} onClick={() => onSetId(Math.min(id + 1, imgs.length - 1))}>
//         <img src={right} />
//       </div>
//     </div>
//   );
// };
// export interface CetBoxProps {
//   onClick?: any;
//   icon?: string;
//   onChange_IMG?: () => void;
// }

// const SelectBox: FC<SelectBoxProps> = (props: SelectBoxProps) => {
//   const { onClick, onChange_IMG } = props;
//   const [id, setId] = useState(0);

//   const GetBox: FC<CetBoxProps> = () => {
//     return (
//       <div className={cn(styles.wrapperImage)} onClick={onChange_IMG}>
//         <div className={cn(styles.firstLine)}>
//           <img className={cn(styles.selectedImage)} src={IMG[id]} alt={IMG[id]} />
//         </div>
//         <SettingTitle title="Box skin" />
//         <div className={cn(styles.secondLine)}>
//           <Slider key={id} id={id} onSetId={setId} imgs={IMG} />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className={cn(styles.wrapper)}>
//       <SettingTitle isActive={true} title="Select box" />
//       <GetBox
//         onClick={console.log(IMG[id])}
//         onChange_IMG={IMG[id]}
//         // console.log(IMG[id]);
//         // console.log(onChange_IMG());
//       />

//       {/* <Test /> */}
//       <div className={cn(styles.navigation)}>
//         <Link to="/" className={cn(styles.prevStep)}>
//           <LinksStep step="prev" label="Back" icon={PrevStep} />
//         </Link>
//         <Link to="/box_settings_value" className={cn(styles.nextStep)}>
//           <LinksStep step="next" label="Next step" icon={NextStep} />
//         </Link>
//       </div>
//     </div>
//   );
// };
// export default SelectBox;

export interface SelectBoxProps {
  children?: ReactNode;
  imgLink?: string;
  id?: number;
  setRef?: any;
  onClick?: () => void;
  image?: string;
  onChange_IMG?: () => void;
  valueIMG?: string;
}
export const IMG = [box1, box2, box3, box4];
interface SliderProps {
  id: number;
  onSetId: any;
  imgs: any;
}
export const Slider: FC<SliderProps> = (props: SliderProps) => {
  const { id, onSetId, imgs } = props;

  return (
    <div className={cn(styles.wrapperSlider)}>
      <div className={cn(styles.left)} onClick={() => onSetId(Math.max(id - 1, 0))}>
        <img src={left} />
      </div>
      {imgs.map((img: any, index: any) => (
        <img
          src={img}
          onClick={() => {
            onSetId(index);

            // console.log(IMG[id]);
          }}
          alt={img}
          key={index}
          className={cn(styles.choiseImage)}
          id={index}
        />
      ))}
      <div className={cn(styles.right)} onClick={() => onSetId(Math.min(id + 1, imgs.length - 1))}>
        <img src={right} />
      </div>
    </div>
  );
};
export interface CetBoxProps {
  onClick?: any;
  icon?: string;
  onChange_IMG?: () => void;
}

const SelectBox: FC<SelectBoxProps> = (props: SelectBoxProps) => {
  const { onClick, onChange_IMG, imgLink } = props;
  const [id, setId] = useState(0);
  const [imges] = useState(IMG);
  const GetBox: FC<CetBoxProps> = (props: CetBoxProps) => {
    const { icon, onChange_IMG } = props;
    return (
      <div className={cn(styles.wrapperImage)}>
        <div className={cn(styles.firstLine)} onClick={onChange_IMG}>
          <img className={cn(styles.selectedImage)} id={IMG[id]} src={IMG[id]} alt={IMG[id]} />
        </div>
        <SettingTitle title="Box skin" />
        <div className={cn(styles.secondLine)}>
          <Slider key={id} id={id} onSetId={setId} imgs={IMG} />
        </div>
      </div>
    );
  };

  return (
    <div className={cn(styles.wrapper)}>
      <SettingTitle isActive={true} title="Select box" />
      <GetBox
        // onClick={console.log(imgas[id])}
        // onClick={console.log(onChange_IMG(imgas[id]))}
        onChange_IMG={() => {
          imges[id];
          console.log(imges[id]);
        }}
        // onClick={console.log(onChange_IMG()=>imgas[id])}
        // console.log(IMG[id]);
        // console.log(onChange_IMG());
      />

      {/* <Test /> */}
      <div className={styles.navigation}>
        <Link to="/" className={cn(styles.prevStep)}>
          <LinksStep step="prev" label="Back" icon={PrevStep} />
        </Link>
        <Link to="/box_settings_value" className={cn(styles.nextStep)}>
          <LinksStep step="next" label="Next step" icon={NextStep} />
        </Link>
      </div>
    </div>
  );
};
export default SelectBox;
