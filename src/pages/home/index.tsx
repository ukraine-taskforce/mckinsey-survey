import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "../../others/components/Button";
import { Card } from "../../others/components/Card";
import { Content } from "../../others/components/Content";
import { Header } from "../../others/components/Header";
import { List } from "../../others/components/List";
import { Spacer } from "../../others/components/Spacer";
import { Text } from "../../others/components/Text";
import { useLocationsQuery, useSuppliesQuery } from "../../others/contexts/api";

import styles from "./home.module.css";

import { ImgNext } from "../../medias/images/UGT_Asset_UI_ButtonNext";

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t("home_page_title");
    ReactGA.send("pageview");
  }, [t]);

  // For caching purposes
  useSuppliesQuery();
  useLocationsQuery();

  return (
    <React.Fragment>
      <Header hasHeadline hasLangSelector />
      <Content>
        <h1 className={styles.title}>{t("home_how_does_works")}</h1>
        <List>
          <li>
            <Text variant="bold">{t("home_tell_us")}</Text>
          </li>
          <li>
            <Text variant="bold">{t("home_we_help_authorities")}</Text>
          </li>
          <li>
            <Text variant="bold">{t("home_deliver_supplies")}</Text>
          </li>
        </List>
        <Card>
          <Text alignment="center">{t("home_acknowledgement")}</Text>
          <Spacer size={22} />
          <Button fullWidth onClick={() => navigate("/contact")} trailingIcon={<ImgNext alt="" />}>
            {t("home_i_understand")}
          </Button>
        </Card>
      </Content>
    </React.Fragment>
  );
}
