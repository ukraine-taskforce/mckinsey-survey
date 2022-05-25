import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import styles from "./PhoneInput.module.css";
import { ImgClose } from "../../medias/images/UGT_Asset_UI_Close";
import { useTranslation } from "react-i18next";

export interface PhoneInputProps {
  country: string;
  value: string | undefined;
  placeholder: string;
  onChange: (value: string, countryCode: string) => void;
  isValid?: boolean;
}

interface ClearButtonProps {
  onClick: (value: string) => void;
}

const ClearButton: React.FunctionComponent<ClearButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.clearContainer}>
      <ImgClose className={styles.clearButton} onClick={() => onClick("")} alt="clear value" />
    </div>
  );
};

const PhoneInputCustom: React.FunctionComponent<PhoneInputProps> = ({ country, value, placeholder, onChange, isValid = true }) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);

  const onFocus = () => {
    setFocused(true);
  };
  const onBlur = () => {
    setFocused(false);
  };

  const countriesListTranslation = JSON.parse(t("countries_list"));

  return (
    <div className={`${styles.wrapper} ${!isValid && styles.invalid} ${focused && styles.focused}`}>
      <PhoneInput
        country={country}
        value={value}
        placeholder={placeholder}
        onChange={(phone, data: { countryCode: string }) => onChange(`+${phone}`, data.countryCode)}
        inputClass={styles.input}
        containerClass={styles.container}
        buttonClass={styles.button}
        dropdownClass={styles.button}
        localization={countriesListTranslation}
        onFocus={onFocus}
        onBlur={onBlur}
        enableSearch
      />

      {value && value.length > 0 && <ClearButton onClick={() => onChange("", "")} />}
    </div>
  );
};

export default PhoneInputCustom;
