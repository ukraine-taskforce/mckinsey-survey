import React from "react";
import styles from "./Input.module.css";

import {ImgClose} from "../../medias/images/UGT_Asset_UI_Close";


export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  icon?: React.ReactChild;
  value: string;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
}

export const Input: React.FunctionComponent<InputProps> = ({
                                                             icon,
                                                             value,
                                                             autoFocus,
                                                             label,
                                                             onChange,
                                                             ...rest
                                                           }) => {
  return (
    <div className={styles.wrapper}>
      {Boolean(icon) && <span className={styles.icon}>{icon}</span>}
      <input
        value={value}
        className={styles.input}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        autoFocus={autoFocus ?? false}
        {...rest}
      />
      {value.length > 0 &&
        <ImgClose className={styles.clear} onClick={() => onChange("")}
                  alt="clear value"/>}
    </div>
  );
};
