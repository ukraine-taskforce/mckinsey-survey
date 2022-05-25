import React, { useEffect, useMemo } from "react";
import ReactGA from "react-ga4";
import { Accordion, AccordionSummary, AccordionDetails, Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import map from "lodash/map";
import groupBy from "lodash/groupBy";

import { Button } from "../../others/components/Button";
import { Content } from "../../others/components/Content";
import { Header } from "../../others/components/Header";
import { Loader } from "../../others/components/Loader";
import { Spacer } from "../../others/components/Spacer";
import { Text } from "../../others/components/Text";
import { useFormValue, SupplyWithAmount } from "../../others/contexts/form";
import { useSuppliesQuery } from "../../others/contexts/api";

import { ImgNext } from "../../medias/images/UGT_Asset_UI_ButtonNext";

import styles from "./supplies.module.css";

export function Supplies() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentValue, updateValue } = useFormValue();
  const { data: supplies } = useSuppliesQuery();

  const suppliesLookup = useMemo(() => {
    if (!supplies) {
      return {};
    }
    return Object.assign({}, ...supplies.map((supply) => ({ [supply.id]: supply })));
  }, [supplies]);

  useEffect(() => {
    document.title = t("supplies_page_title");
    ReactGA.send("pageview");
  }, [t]);

  const handleSubmit = React.useCallback(() => {
    navigate("/supplies2");
  }, [navigate]);

  const toggleSupply = React.useCallback(
    (supplyId: string) => {
      const array = currentValue.supplies;
      const index = array.findIndex((element) => element.id === supplyId);

      if (index === -1) {
        array.push({ id: supplyId, amount: 1 });
      } else {
        array.splice(index, 1);
      }

      updateValue({ supplies: array });
    },
    [currentValue, updateValue]
  );

  const suppliesGrouped = groupBy(supplies, "parent");

  const getNumberOfMatches = React.useCallback(
    (parent: string) => {
      const num = currentValue.supplies.filter((obj: SupplyWithAmount) => {
        return suppliesLookup[obj.id].parent === parent;
      }).length;
      if (num > 0) {
        return <span className={styles.counter}>{num}</span>;
      }
    },
    [currentValue, suppliesLookup]
  );

  if (!supplies) {
    return (
      <React.Fragment>
        <Spacer size={40} />
        <Loader />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Header backLink="/locator" hasLangSelector />
      <Content>
        <h1 className={styles.title}>{t("supplies_what_is_needed")}?</h1>
        <Spacer size={24} />
        <div className={styles.flex}>
          {map(suppliesGrouped, (categories, parent) => (
            <Accordion
              key={parent}
              sx={{
                boxShadow: "none",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  flexDirection: "row-reverse",
                  background: "#F9F9F9",
                  marginBottom: "5px",
                  borderRadius: "8px",
                  "&.Mui-expanded": {
                    minHeight: "48px",
                  },
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(180deg)",
                  },
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: 0,
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" flexGrow="inherit">
                  <Box
                    sx={{
                      marginLeft: "20px",
                    }}
                  >
                    <Text>{parent}</Text>
                  </Box>
                  <Box marginLeft="20px">{getNumberOfMatches(parent)}</Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  background: "var(--color-global-bg)",
                  padding: 0,
                }}
              >
                {categories.map((supply) => (
                  <React.Fragment key={supply.name}>
                    <Box
                      sx={{
                        marginLeft: 0,
                        marginBottom: "5px",
                        background: "#F9F9F9",
                        paddingLeft: "30px",
                      }}
                    >
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onClick={() => toggleSupply(supply.id)}
                              checked={currentValue.supplies.some((element) => element.id === supply.id)}
                            />
                          }
                          label={supply.name}
                        />
                      </FormGroup>
                      <Spacer size={6} />
                    </Box>
                  </React.Fragment>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
          <Spacer size={30} flex={2} />
          <Button
            onClick={handleSubmit}
            trailingIcon={<ImgNext alt="" />}
            disabled={currentValue.supplies.length <= 0}
            fullWidth
            floats
          >
            <span className={styles.counter}>{currentValue.supplies.length}</span>
            {t("supplies_next")}
          </Button>
        </div>
      </Content>
    </React.Fragment>
  );
}
