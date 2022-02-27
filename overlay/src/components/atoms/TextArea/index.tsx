import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  FC,
  useState,
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ChangeEventHandler,
} from 'react';
import cn from 'classnames';
import styles from './TextArea.module.scss';

export interface TextAreaProps
  extends DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  onSubmit?: () => void;
  value?: any;
  placeholder?: string;
  isButton?: true;

  className?: 'string';
}

export const TextArea: FC<TextAreaProps> = (props) => {
  const {
    value,
    onChange,
    onSubmit,
    placeholder,

    className,

    ...anotherProps
  } = props;
  const handleSubmit: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    // const formData = new FormData(event.currentTarget);
    event.preventDefault();
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    //   console.log(formData);
    event.preventDefault();
    const { name, value } = event.currentTarget;
    // console.log(name, value);
  };
  return (
    <div className={cn(styles.inputPanel)}>
      <textarea
        value={value}
        className={cn(styles.inputInfo)}
        onChange={onChange}
        // type="textarea"
        // type="textarea"
        placeholder={placeholder}
        maxLength={250}
        onSubmit={handleSubmit}
        {...anotherProps}
      />
    </div>
  );
};
