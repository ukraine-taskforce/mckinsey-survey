import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Content } from "../../others/components/Content";
import { Text } from "../../others/components/Text";
import { Header } from "../../others/components/Header";
import { Spacer } from "../../others/components/Spacer";
import styles from "./supplies.module.css";
import { ImgNext } from "../../medias/images/UGT_Asset_UI_ButtonNext";
import { Button } from "../../others/components/Button";
import { useFormValue } from "../../others/contexts/form";
import { useSuppliesQuery } from "../../others/contexts/api";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { FormControl, OutlinedInput, InputAdornment, IconButton, Box } from "@mui/material";

export function Supplies2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentValue, updateValue } = useFormValue();
  const { data: supplies } = useSuppliesQuery();

  useEffect(() => {
    document.title = t("supplies2_page_title");
    ReactGA.send("pageview");
  }, [t]);

  const getSupplyName = (supplyId: string) => {
    if (supplies !== undefined) {
      return supplies.find((supply) => supply.id === supplyId)?.name || "";
    }
    return "";
  };

  const handleInputChange = React.useCallback(
    (id: string, amount: string) => {
      const currentSupplies = currentValue.supplies;
      const index = currentSupplies.findIndex((element) => element.id === id);
      if (index !== -1) {
        let parsedAmount = 1;
        try {
          const tmp = parseInt(amount);
          if (tmp >= 1) {
            parsedAmount = tmp;
          }
        } finally {
          if (amount === "") {
            parsedAmount = 0;
          }
          currentSupplies[index].amount = parsedAmount;
        }
      }
      updateValue({ supplies: currentSupplies });
    },
    [currentValue, updateValue]
  );

  const handleCounterChange = React.useCallback(
    (id: string, counterType: "add" | "substract") => {
      const currentSupplies = currentValue.supplies;
      const index = currentSupplies.findIndex((element) => element.id === id);
      if (index !== -1) {
        const currentAmount = currentSupplies[index].amount;
        currentSupplies[index].amount = counterType === "add" ? currentAmount + 1 : currentAmount - 1;
      }
      updateValue({ supplies: currentSupplies });
    },
    [currentValue, updateValue]
  );

  const handleSubmit = React.useCallback(() => {
    navigate("/review");
  }, [navigate]);

  return (
    <React.Fragment>
      <Header backLink="/supplies" hasLangSelector />

      <Content>
        <h1 className={styles.title}>{t("supplies2_how_much")}</h1>
        <Spacer size={24} />
        <Box display="flex" flexDirection="column">
          {currentValue.supplies.map((supply) => (
            <React.Fragment key={supply.id}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Text>{getSupplyName(supply.id)}</Text>
                </Box>

                <Box>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id="supplies-count"
                      type="input"
                      value={supply.amount === 0 ? "" : supply.amount}
                      onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                        handleInputChange(supply.id, event.target.value)
                      }
                      notched={false}
                      sx={{
                        maxWidth: "140px",
                        borderRadius: "25px",
                        "& input": {
                          padding: "10px",
                        },
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <IconButton
                            sx={{
                              color: "#1337B8",
                            }}
                            disabled={supply.amount <= 1}
                            aria-label="remove supplies"
                            onClick={() => handleCounterChange(supply.id, "substract")}
                            edge="start"
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            sx={{
                              color: "#1337B8",
                            }}
                            aria-label="add supplies"
                            onClick={() => handleCounterChange(supply.id, "add")}
                            edge="end"
                          >
                            <AddCircleIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Supplies count"
                    />
                  </FormControl>
                </Box>
              </Box>

              <Spacer size={10} />
            </React.Fragment>
          ))}

          <Spacer size={30} flex={2} />

          <Button
            disabled={currentValue.supplies.filter((element) => (element.amount === 0)).length > 0}
            onClick={handleSubmit}
            trailingIcon={<ImgNext alt="" />}
            fullWidth floats>
            {t("supplies_next")}
          </Button>
        </Box>
      </Content>
    </React.Fragment>
  );
}
