import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";

import { Button } from "../../others/components/Button";
import { Card } from "../../others/components/Card";
import { List } from "../../others/components/List";
import { Header } from "../../others/components/Header";
import { Spacer } from "../../others/components/Spacer";
import { Text } from "../../others/components/Text";
import { useFormValue } from "../../others/contexts/form";
import { isShareSupported, useShare } from "../../others/helpers/share";

import { ImgConfirmation } from "../../medias/images/UGT_Asset_UI_Confirmation";
import { ImgShare } from "../../medias/images/UGT_Asset_UI_Share_Icon";

import styles from "./success.module.css";

export function Success() {
  const { t } = useTranslation();
  const { clearStore } = useFormValue();
  const { share } = useShare();

  useEffect(() => {
    document.title = t("success_page_title");
    ReactGA.send("pageview");
  }, [t]);

  React.useEffect(() => {
    clearStore();
  }, [clearStore]);

  return (
    <React.Fragment>
      <Header hasHeadline hasLangSelector />
      <div className={styles.wrapper}>
        <Spacer size={40} />
        <ImgConfirmation className={styles.logo} alt="success" />
        <h1>{t("success_received")}</h1>
        <Spacer size={30} />
        <Card>
          <List>
            <li>
              <Text>{t("success_aggregate")}</Text>
            </li>
            <li>
              <Text>{t("success_insight")}</Text>
            </li>
            <li>
              <Text>{t("success_delivery")}</Text>
            </li>
          </List>
          {isShareSupported() && (
            <Button
              onClick={share}
              trailingIcon={<ImgShare fill="white" alt="" className={styles.nextArrow} />}
              fullWidth
              variant="highlight"
            >
              {t("success_share")}
            </Button>
          )}
        </Card>
      </div>
    </React.Fragment>
  );
}
