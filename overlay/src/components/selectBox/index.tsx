import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  useMemo,
  useEffect,
} from 'react';
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
import { Slider } from '../atoms/test';
import { Lootbox } from '../../../../common/interfaces';

export interface SelectBoxProps {
  children?: ReactNode;
  imgLink?: string;
  id?: number;
  setRef?: any;
  onClick?: () => void;
  image?: string;
  onChange_IMG: (x: string) => void;
  valueIMG?: string;
  creationFormId: number;
  onCreationFormUpdate: (id: number) => void;
  clicked: number | null;
  setClicked: any;
}
export const IMG = [box1, box2, box3, box4];

// export const Imges: FC<SelectBoxProps> = (props: SelectBoxProps) => {
//   const [clicked, useClicked] = useState('');
//   const handleClick = (id: string) => useClicked(id);

//   const { id, creationForm, onCreationFormUpdate } = props;

//   const onSetId = (index: number) => {
//     creationForm.pictureId = index;
//     onCreationFormUpdate(creationForm);
//   };
//   return (
//     <>
//       {IMG.map((item: any, index: any) => (
//         <img
//           onClick={(e) => {
//             // e.stopPropagation();
//             handleClick(`${index}`);
//             onSetId(index);
//           }}
//           className={`keen-slider__slide number-slide1 ${clicked === `${index}` && 'clicked'}`}
//           src={item}
//           key={index}
//           id={index}
//         />
//       ))}
//     </>
//   );
// };

export interface CetBoxProps {
  onClick?: any;
  icon?: string;
  clicked: number | null;
  setClicked: any;
  onChange_IMG: (x: string) => void;
  id: any;
  // creationForm: Lootbox;
  onCreationFormUpdate: (id: number) => void;
}

export const GetBox: FC<CetBoxProps> = (props: CetBoxProps) => {
  const { icon, onChange_IMG, id, onCreationFormUpdate, clicked, setClicked } = props;
  return (
    <div className={cn(styles.wrapperImage)}>
      <div className={cn(styles.firstLine)}>
        <img className={cn(styles.selectedImage)} id={IMG[id]} src={IMG[id]} />
      </div>
      <SettingTitle title="Box skin" />
      <div
        className={cn(styles.secondLine)}
        onClick={(e) => {
          // e.stopPropagation();
          // handleClick(`${id}`);
          onChange_IMG(IMG[id]);
        }}
      >
        <Slider
          clicked={clicked}
          setClicked={setClicked}
          key={id}
          id={id}
          imgs={IMG}
          onChange_IMG={IMG[id]}
          onCreationFormUpdate={onCreationFormUpdate}
        />
      </div>
    </div>
  );
};

const SelectBox: FC<SelectBoxProps> = (props: SelectBoxProps) => {
  const {
    onClick,
    onChange_IMG,
    imgLink,
    creationFormId,
    onCreationFormUpdate,
    clicked,
    setClicked,
  } = props;

  // const id = creationForm.pictureId;
  // const id = useMemo(() => creationForm.pictureId, [creationForm]);
  // const [imges] = useState(IMG);

  // const [clicked, useClicked] = useState('');
  // const handleClick = (id: string) => useClicked(id);
  // useEffect(() => {
  //   console.log({ creationForm });
  // }, [creationForm]);

  return (
    <div className={cn(styles.wrapper)} onClick={() => console.log(IMG[creationFormId])}>
      <SettingTitle isActive={true} title="Select box" />
      <GetBox
        clicked={clicked}
        setClicked={setClicked}
        onChange_IMG={onChange_IMG}
        id={creationFormId}
        // creationForm={creationForm}
        onCreationFormUpdate={onCreationFormUpdate}
      />
      {/* <Slider
        key={id}
        id={id}
        imgs={IMG}
        onChange_IMG={IMG[id]}
        creationForm={creationForm}
        onCreationFormUpdate={onCreationFormUpdate}
      /> */}

      {/* <Slider
        onChange_IMG={IMG[id]}
        // onChange_IMG={IMG[id]}
        creationForm={creationForm}
        onCreationFormUpdate={onCreationFormUpdate}
        imgs={IMG}
        id={id}
      /> */}
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
