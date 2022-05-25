import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { Header } from "../../others/components/Header";
import { Content } from "../../others/components/Content";
import { useAuth } from "../../others/contexts/auth";
import OutputIcon from "@mui/icons-material/Output";
import { Tooltip } from "@mui/material";

export function Logout() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  useEffect(() => {
    document.title = t("logout_page_title");
    ReactGA.send("pageview");
  }, [t]);

  return (
    <React.Fragment>
      <Header hasHeadline hasLangSelector />
      <Content>
        <Tooltip title="Logout" arrow>
          <OutputIcon onClick={logout} sx={{ cursor: "pointer" }} />
        </Tooltip>
      </Content>
    </React.Fragment>
  );
}
