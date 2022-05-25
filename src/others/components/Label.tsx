import React from "react";
import styles from "./Label.module.css";

export interface LabelProps {
  className?: string;
  required?: boolean;
}

export const Label: React.FunctionComponent<LabelProps> = ({ className, required = false, children }) => {
  return (
    <label className={className}>
      {children}
      {required && <span className={styles.requiredField}> *</span>}
    </label>
  );
};
