import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import styles from "./Header.module.css";
import { LanguageSelector } from "./LanguageSelector";
import { Spacer } from "./Spacer";
import { Text } from "./Text";

import { ImgBack } from "../../medias/images/UGT_Asset_UI_Back";

import { AssetRect } from "../../medias/images/UGT_Asset_SVGRect";
import { AssetName } from "../../medias/images/UGT_Asset_Name";
import { ImgInfo } from "../../medias/images/UGT_Asset_UI_Info";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { ImgBrand } from "../../medias/images/UGT_Asset_Brand";
import { isShareSupported, useShare } from "../helpers/share";
import { ImgShare } from "../../medias/images/UGT_Asset_UI_Share";

export interface HeaderProps {
  backLink?: string;
  hasHeadline?: boolean;
  hasLangSelector?: boolean;
}

export interface HeaderCardProps extends React.AllHTMLAttributes<HTMLDivElement> {}

export const Header: React.FunctionComponent<HeaderProps> = ({ backLink, hasHeadline, hasLangSelector }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { share } = useShare();
  const [displayModal, setDisplayModal] = React.useState(false);

  return (
    <div className={styles.navWrapper}>
      <nav className={styles.navigator}>
        <AssetRect className={styles.colorAccent}></AssetRect>
        <div className={styles.elementsWrapper}>
          {Boolean(backLink) && (
            <div className={styles.headerItem} onClick={() => backLink && navigate(backLink)}>
              <ImgBack alt={t("back")} className={styles.backIcon} />
              {t("back")}
            </div>
          )}
          {Boolean(hasHeadline) && (
            <div>
              <AssetName className={styles.nameSVG}></AssetName>
              <Text className={styles.nameLink}>SYLNISHI.COM</Text>
            </div>
          )}
          <div className={styles.infoIcon} onClick={() => setDisplayModal(true)}>
            <ImgInfo alt="" />
          </div>
          <Spacer flex={1} />
          {hasLangSelector && <LanguageSelector />}
        </div>
      </nav>
      {/* About modal */}
      <Modal show={displayModal} handleClose={() => setDisplayModal(false)}>
        <Spacer size={50} />
        <div style={{ display: "flex" }}>
          <Spacer flex={1} />
          <ImgBrand className={styles.ugtLogo} alt="UGT Logo" />
          <Spacer flex={1} />
        </div>
        <Spacer size={20} />
        <h1 style={{ textAlign: "center" }}>{t("about_dialog_head")}</h1>
        <Spacer size={22} />
        <div style={{textAlign: "center"}}><Text>{t("about_dialog_detailed")}</Text></div>
        <Spacer size={22} />
        {isShareSupported() && (
            <Button
                fullWidth
                variant="highlight"
                onClick={() => {
                  share();
                }}
                trailingIcon={
                  <ImgShare style={{ height: "15px" }} fill="var(--color-white)" alt={t("share")} />
                }
            >
              {t("share")}
            </Button>
        )}
        <div className={styles.contactLabel}
             onClick={(e) => {
                 const w = window.open('','_blank');
                   if(!w) return;
                   w.location.href = "mailto:ugt@ukraineglobaltaskforce.com";
                   w.focus();
                   e.preventDefault();
             }}
             >
            {t("contact_us_at")} <span>ugt@ukraineglobaltaskforce.com</span>
        </div>
      </Modal>
    </div>
  );
};
