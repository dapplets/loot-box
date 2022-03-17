import React, { useState, FC, useMemo, useEffect } from 'react';

import box1 from '../../../icons/createNewBox/box1.png';
import box2 from '../../../icons/createNewBox/box2.png';
import box3 from '../../../icons/createNewBox/box3.png';
import box4 from '../../../icons/createNewBox/box4.png';

import cn from 'classnames';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider, KeenSliderPlugin, KeenSliderInstance } from 'keen-slider/react';
import './Slider.module.scss';
import styles from './Slider.module.scss';
export interface ImageProps {
  onClick: any;
  item: string;
  index: number;
  clicked: number | null;
}

const Image = ({ onClick, item, index, clicked }: ImageProps) => {
  const imgClassName = useMemo(
    () => `keen-slider__slide number-slide1 ${index}  ${clicked === index && 'clicked'}`,
    [clicked, index],
  );

  return <img onClick={() => onClick(index)} className={imgClassName} src={item} id={item} />;
};

interface SliderProps {
  id: number;
  imgs: any;
  onChange_IMG: () => void;
  clicked: number | null;
  setClicked: any;

  onCreationFormUpdate: (id: number) => void;
}
export const IMG = [box1, box2, box3, box4];
export const Imges: FC<SliderProps> = (props: SliderProps) => {
  const { clicked, setClicked } = props;
  const { id, imgs, onCreationFormUpdate } = props;

  const onSetId = useMemo(
    () => (index: number) => {
      setClicked(index);
      onCreationFormUpdate(index);
    },
    [onCreationFormUpdate, setClicked],
  );

  useEffect(() => {}, [setClicked]);
  useEffect(() => {}, [onCreationFormUpdate]);

  return (
    <>
      {imgs.map((item: string, index: number) => (
        <Image
          key={item}
          onClick={(index: number) => {
            setClicked(index);
            onCreationFormUpdate(index);
          }}
          item={item}
          index={index}
          clicked={clicked}
        />
      ))}
    </>
  );
};

export const Slider: FC<SliderProps> = (props: SliderProps) => {
  const { onChange_IMG, onCreationFormUpdate, id, clicked, setClicked } = props;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: {
      perView: 4,
      spacing: 5,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <>
      <div className={cn(styles.navigationWrapper)}>
        <div ref={sliderRef} className={cn(styles.keenSlider)}>
          <Imges
            clicked={clicked}
            setClicked={setClicked}
            key={id}
            id={id}
            imgs={IMG}
            onChange_IMG={IMG[id]}
            onCreationFormUpdate={onCreationFormUpdate}
            // onClick={() => onChange_IMG}
          />
        </div>
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
              disabled={false}
              style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
              }}
            />

            <Arrow
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
              disabled={false}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
  style: React.CSSProperties;
}) {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <svg
      onClick={props.onClick}
      className={cn(`arrow ${props.left ? 'arrow--left' : 'arrow--right'} ${disabeld}`)}
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
    >
      {props.left && (
        <path
          d="M10.6605 0.283061C16.0246 0.288953 20.3716 4.63594 20.3774 10L20.3774 10.1944C20.2706 15.5343 15.874 19.787 10.5335 19.7162C5.19295 19.6453 0.910733 15.2774 0.94563 9.93655C0.980527 4.59566 5.31945 0.284129 10.6605 0.283061ZM12.6039 14.3727L12.6039 5.6274L6.77367 10L12.6039 14.3727Z"
          fill="#2E3A59"
        />
      )}
      {!props.left && (
        <path
          d="M9.98114 19.7169C4.61704 19.711 0.270051 15.3641 0.26416 9.99996V9.80562C0.37098 4.46568 4.76758 0.212972 10.1081 0.283832C15.4487 0.354692 19.7309 4.72255 19.696 10.0634C19.6611 15.4043 15.3221 19.7159 9.98114 19.7169ZM8.03775 5.62732L8.03775 14.3726L13.8679 9.99996L8.03775 5.62732Z"
          fill="#2E3A59"
        />
      )}
    </svg>
  );
}
