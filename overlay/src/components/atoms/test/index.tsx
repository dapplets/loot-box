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
  Component,
  MutableRefObject,
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
import left from '../../../icons/selectBox/sliderLeft.svg';
import right from '../../../icons/selectBox/sliderRight.svg';
import { RadioButton } from '../RadioButton';
import './Test.module.scss';
import cn from 'classnames';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider, KeenSliderPlugin, KeenSliderInstance } from 'keen-slider/react';
export interface TestProps {
  // prop?: '20';
  // numChildren: number;
}
export const IMG = [box1, box2, box3, box4];
export const Imges: FC<SliderProps> = (props: SliderProps) => {
  // const { id, onSetId, imgs, onChange_IMG } = props;
  return (
    <>
      {IMG.map((item, index) => (
        <img className={'keen-slider__slide number-slide1'} src={item} key={index} />
      ))}
    </>
  );
};
interface SliderProps {}
export function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>,
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove('active');
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add('active');
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on('created', () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on('animationStarted', (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(next);
      });
    });
  };
}

export const Test: FC<TestProps> = (props: TestProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    // slideChanged(slider) {
    //   setCurrentSlide(slider.track.details.rel);
    // },
    // created() {
    //   setLoaded(true);
    // },
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },

    [ThumbnailPlugin(instanceRef)],
  );

  return (
    <div>
      <div ref={sliderRef} className="keen-slider">
        <Imges />
      </div>
      <div className="navigation-wrapper">
        <div ref={thumbnailRef} className="keen-slider">
          <Imges />
          {loaded && instanceRef.current && (
            <>
              <Arrow
                left
                onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
                disabled={currentSlide === 0}
              />

              <Arrow
                onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
                disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export function Arrow(props: { disabled: boolean; left?: boolean; onClick: (e: any) => void }) {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${props.left ? 'arrow--left' : 'arrow--right'} ${disabeld}`}
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
