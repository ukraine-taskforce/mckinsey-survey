import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spacer } from "../../others/components/Spacer";
import { Text } from "../../others/components/Text";
import { Header } from "../../others/components/Header";

export function NotFound() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("notfound_page_title");
    ReactGA.send("pageview");
  }, [t]);

  return (
    <React.Fragment>
      <Header hasHeadline hasLangSelector />
      <Spacer size={100} />
      <h1>404</h1>
      <Spacer size={24} />
      <Text>{t("page_not_exist")}</Text>
      <Spacer />
      <Link to="/">{t("go_to_homepage")}</Link>
    </React.Fragment>
  );
}
