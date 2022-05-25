import React, { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "../../others/components/Button";
import { Content } from "../../others/components/Content";
import { Spacer } from "../../others/components/Spacer";
import { Label } from "../../others/components/Label";
import { useFormValue } from "../../others/contexts/form";
import { Header } from "../../others/components/Header";
import { Input } from "../../others/components/Input";
import { Text } from "../../others/components/Text";

import { ImgNext } from "../../medias/images/UGT_Asset_UI_ButtonNext";

import styles from "./contact.module.css";
import { validatePhoneNumber } from "../../others/helpers/validatePhoneNumber";
import PhoneInput from "../../others/components/PhoneInput";

export function Contact() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentValue, updateValue } = useFormValue();
  const [phoneNumberError, setPhoneNumberError] = useState<string | undefined>();

  useEffect(() => {
    document.title = t("contact_page_title");
    ReactGA.send("pageview");
  }, [t]);

  const handleSubmit = React.useCallback(() => {
    navigate("/locator");
  }, [navigate]);

  const setName = (newValue: string) => updateValue({ name: newValue });

  const setPhoneNumber = (newValue: string, countryCode: string) => {
    setPhoneNumberError(undefined);
    updateValue({ phoneNumber: newValue });

    const validationResult = validatePhoneNumber(newValue, countryCode);
    if (validationResult.isInvalid) setPhoneNumberError(validationResult.error);
  };

  const isFormValid = currentValue.phoneNumber && currentValue.phoneNumber.trim().length > 4 && !phoneNumberError;

  return (
    <React.Fragment>
      <Header backLink="/" hasLangSelector />
      <Content>
        <h1 className={styles.title}>{t("contact_description")}</h1>
        <Spacer size={24} />
        <div className={styles.flex}>
          <Label required>{t("phone_number_field")}</Label>
          <Spacer size={10} />
          <PhoneInput
            country={"ua"}
            value={currentValue.phoneNumber}
            placeholder={t("phone_number_placeholder")}
            isValid={!phoneNumberError}
            onChange={(value: string, countryCode: string) => setPhoneNumber(value, countryCode)}
          />
          {phoneNumberError && <Text className={styles.errorMessage}>{t(`phone_number_error_${phoneNumberError}`)}</Text>}

          <Spacer size={30} flex={2} />

          <Label>{t("name_field")}</Label>
          <Spacer size={10} />
          <Input value={currentValue.name || ""} label={t("name_field")} placeholder={t("name_placeholder")} onChange={setName} />

          <Spacer size={30} flex={2} />

          <Button disabled={!isFormValid} onClick={handleSubmit} trailingIcon={<ImgNext alt={t("context_next")} />} floats>
            {t("contact_next")}
          </Button>
        </div>
      </Content>
    </React.Fragment>
  );
}
