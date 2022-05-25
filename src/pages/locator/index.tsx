import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ImgSearch } from "../../medias/images/UGT_Asset_UI_Search";

import { Card } from "../../others/components/Card";
import { Content } from "../../others/components/Content";
import { Input } from "../../others/components/Input";
import { Loader } from "../../others/components/Loader";
import { Spacer } from "../../others/components/Spacer";
import { Text } from "../../others/components/Text";
import { useLocationsQuery, Location } from "../../others/contexts/api";
import { useFormValue } from "../../others/contexts/form";

import styles from "./locator.module.css";
import { fuzzySearch } from "./search";
import { Header } from "../../others/components/Header";

export function Locator() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: cities } = useLocationsQuery();
  const { updateValue } = useFormValue();
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    document.title = t("locator_page_title");
    ReactGA.send("pageview");
  }, [t]);

  const handleLocationSelection = React.useCallback(
    (location: Location) => {
      updateValue({ location: location.id });
      navigate("/supplies");
    },
    [navigate, updateValue]
  );

  const searchResults = React.useMemo(() => {
    if (cities?.length && inputValue.length) {
      return fuzzySearch(inputValue, cities);
    }

    return [];
  }, [cities, inputValue]);

  if (!cities) {
    return (
      <React.Fragment>
        <Spacer size={40} />
        <Loader />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Header backLink="/contact" hasLangSelector />
      <Content>
        <h1 className={styles.title}>{t("locator_where_are_you")}?</h1>
        <Spacer size={24} />
        <Input
          value={inputValue}
          onChange={setInputValue}
          placeholder={t("locator_search_your")}
          icon={<ImgSearch alt="" />}
          label={t("locator_search_your")}
          autoFocus
        />
        <Spacer size={12} />
        {Boolean(searchResults?.length) && (
          <React.Fragment>
            <Text variant="light">
              {searchResults?.length} {t("locator_results")}
            </Text>
            <Spacer />
          </React.Fragment>
        )}
        {searchResults?.map((result) => (
          <LocationElement key={result.obj.id} locationMatch={result} onClick={() => handleLocationSelection(result.obj)} />
        ))}
      </Content>
    </React.Fragment>
  );
}

interface LocationElementProps extends React.AllHTMLAttributes<HTMLDivElement> {
  locationMatch: Fuzzysort.KeyResult<Location>;
}

const LocationElement: React.FunctionComponent<LocationElementProps> = ({ locationMatch, ...props }) => {
  let highlightedText: any[] = [];

  function commit(list: any[], content: string, isHighlighted: boolean, key: string) {
    if (isHighlighted) {
      list.push(
        <span key={key} style={{ color: "var(--color-focus)" }}>
          {content}
        </span>
      );
    } else {
      list.push(content);
    }
  }

  // keep number of spans as small as possible
  let prevIsHighlighted = false;
  let group = "";
  for (let i = 0; i < locationMatch.obj.name.length; i++) {
    const isHighlighted = locationMatch.indexes.includes(i);

    if (!(prevIsHighlighted === isHighlighted) && group.length) {
      commit(highlightedText, group, prevIsHighlighted, i.toString());
      group = "";
    }
    group += locationMatch.obj.name[i];
    prevIsHighlighted = isHighlighted;
    if (i === locationMatch.obj.name.length - 1) commit(highlightedText, group, isHighlighted, i.toString());
  }

  return (
    <Card {...props} className={styles.wrapper}>
      <Text>{highlightedText}</Text>
    </Card>
  );
};
