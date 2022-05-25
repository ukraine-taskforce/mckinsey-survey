import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import parsePhoneNumber from "libphonenumber-js";

import { ID, useSubmitMutation } from "../../others/contexts/api";
import { useFormValue } from "../../others/contexts/form";
import { useLocationsQuery, useSuppliesQuery } from "../../others/contexts/api";
import { Button } from "../../others/components/Button";
import { Content } from "../../others/components/Content";
import { Header } from "../../others/components/Header";
import { Label } from "../../others/components/Label";
import { Spacer } from "../../others/components/Spacer";
import { Card } from "../../others/components/Card";
import { Text } from "../../others/components/Text";
import { Toast } from "../../others/components/Toast";
import { Input } from "../../others/components/Input";

import { ImgNext } from "../../medias/images/UGT_Asset_UI_ButtonNext";

import styles from "./review.module.css";

export function Review() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: mutate, isLoading, error } = useSubmitMutation();
  const { currentValue, updateValue } = useFormValue();
  const { supplies: supplyIds, location, name, phoneNumber } = currentValue;
  // These calls read from cache.
  const { data: cities } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();

  useEffect(() => {
    document.title = t("review_page_title");
    ReactGA.send("pageview");
  }, [t]);

  const setComment = (newValue: string) => updateValue({ comments: newValue });

  React.useEffect(() => {
    if (location === undefined || supplyIds.length === 0) {
      navigate("/", { replace: true });
    }
  }, [location, supplyIds, navigate]);

  const getCityName = (cityId?: ID) => {
    if (cities !== undefined && cityId !== undefined) {
      return cities.find((city) => city.id === cityId)?.name || "";
    }
    return "";
  };

  const getSupplyName = (supplyId: ID) => {
    if (supplies !== undefined) {
      const supply = supplies.find((supply) => supply.id === supplyId);
      if (supply) {
        return `${supply.parent}: ${supply.name}`;
      }
      return "";
    }
    return "";
  };

  const handleSubmit = React.useCallback(async () => {
    await mutate(currentValue);
    navigate("/success");
  }, [mutate, currentValue, navigate]);

  return (
    <React.Fragment>
      <Header backLink="/supplies2" hasLangSelector />
      <Content>
        <h1 className={styles.title}>{t("review_request")}</h1>
        <Spacer size={24} />
        <div className={styles.flex}>
          <Card className={styles.card}>
            <Text className={styles.cardTitle}>{t("review_contact_info")}</Text>
            <Text className={styles.cardContent}>
              {name ? `${name}, ` : ""}
              {getCityName(location)}
            </Text>
            <Text className={styles.secondaryCardContent}>{parsePhoneNumber(phoneNumber)?.formatInternational()}</Text>
          </Card>
          <Spacer size={8} />
          <Card className={styles.card}>
            {supplyIds.map((supply) => {
              return (
                <React.Fragment key={supply.id}>
                  <Text key="name" className={styles.categoryName}>
                    {getSupplyName(supply.id)}
                  </Text>
                  <Text key="amount" className={styles.categoryAmount}>
                    {supply.amount}
                  </Text>
                </React.Fragment>
              );
            })}
          </Card>
  
          <Spacer size={30} flex={2} />
  
          <Label className={styles.addComment}>{t("add_comment")}</Label>
          <Spacer size={10} />
          <Input value={currentValue.comments} label="comments_field" placeholder={t("comment_placeholder")} onChange={setComment} />

          <Spacer size={30} flex={2} />
          <Button onClick={handleSubmit} disabled={isLoading} trailingIcon={<ImgNext alt="" />} fullWidth floats>
            {t("review_submit_request")}
          </Button>
        </div>
        <Toast display={!isLoading && Boolean(error)}>
          <Text>{t("review_error")}</Text>
        </Toast>
      </Content>
    </React.Fragment>
  );
}
