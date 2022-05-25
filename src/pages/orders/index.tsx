import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import ReactGA from "react-ga4";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { FormControl, OutlinedInput, InputAdornment, IconButton, DialogTitle, DialogActions, DialogContent, Button as MUIButton, Accordion, AccordionSummary, AccordionDetails, Typography, Stack, Dialog, Grow, Avatar, Chip, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";
import { Header } from "../../others/components/Header";
import { Spacer } from "../../others/components/Spacer";
import { Button } from "../../others/components/Button";
import { Text } from "../../others/components/Text";
import { Content } from "../../others/components/Content";
import { FormData } from "../../others/contexts/form";
import { Request, RequestStatus } from "../../others/helpers/requests";
import { RequestUpdateParams, useRequestUpdateMutation, useLocationsQuery, useSuppliesQuery, useListRequests } from "../../others/contexts/api";
import styles from "./orders.module.css";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ImgBack } from "../../medias/images/UGT_Asset_UI_Back";
import { SupplyWithAmount } from "../../others/helpers/requests";

const statusToColor = {
  [RequestStatus.New]: "blue",
  [RequestStatus.Invalid]: "#CF2A20",
  [RequestStatus.Expired]: "#0D1234"
};

type ConfirmDialogConfig = {
  status: RequestStatus;
  request: Request;
};

type PartialDispatchConfig = {
  request: Request;
  new_supplies: SupplyWithAmount[];
};

export function Orders() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [expandedRequestPanel, setExpandedRequestPanel] = useState<string | false>(false);
  const { data: cities } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();
  const { data: requests } = useListRequests();
  const { mutateAsync: mutate, isLoading } = useRequestUpdateMutation();
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [ignoreStatus, setIgnoreStatus] = React.useState<number[]>([]);
  const [confirmDialogConfig, setConfirmDialogConfig] = React.useState<undefined | ConfirmDialogConfig>(undefined);
  const [partialDispatchRequest, setPartialDispatchRequest] = React.useState<undefined | PartialDispatchConfig>(undefined);

  // TODO: If we don't replace it with a better mechanism at least use useMemo.
  const cityLookup = cities ? Object.assign({}, ...cities.map((city) => ({ [city.id]: city }))) : {};
  const supplyLookup = supplies ? Object.assign({}, ...supplies.map((supply) => ({ [supply.id]: supply }))) : {};

  const getSupplyName = (supplyId: string) => {
    if (supplies !== undefined) {
      return supplies.find((supply) => supply.id === supplyId)?.name || "";
    }
    return "";
  };

  const handleInputChange = React.useCallback(
    (id: string, amount: string) => {
      if (!partialDispatchRequest) {
        return;
      }
      const currentSupplies = partialDispatchRequest.new_supplies;
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
      setPartialDispatchRequest({request: partialDispatchRequest.request, new_supplies: currentSupplies});
    },
    [partialDispatchRequest, setPartialDispatchRequest]
  );

  const handleCounterChange = React.useCallback(
    (id: string, counterType: "add" | "substract") => {
      if (!partialDispatchRequest) {
        return;
      }
      const currentSupplies = partialDispatchRequest.new_supplies;
      const index = currentSupplies.findIndex((element) => element.id === id);
      if (index !== -1) {
        const currentAmount = currentSupplies[index].amount;
        currentSupplies[index].amount = counterType === "add" ? currentAmount + 1 : currentAmount - 1;
      }
      setPartialDispatchRequest({request: partialDispatchRequest.request, new_supplies: currentSupplies });
    },
    [partialDispatchRequest, setPartialDispatchRequest]
  );

  const toggleRequestPanel = (panel: string) => (event: React.SyntheticEvent, newExpandedPanel: boolean) => {
    setExpandedRequestPanel(newExpandedPanel ? panel : false);
  };

  const toggleRequestStatus = React.useCallback(
    (status: RequestStatus) => {
      const array = [...ignoreStatus];
      const index = array.indexOf(status);
      if (index === -1) {
        array.push(status);
      } else {
        array.splice(index, 1);
      }
      setIgnoreStatus(array);
    },
    [ignoreStatus]
  );

  const changeStatus = React.useCallback(
    async (request: Request, status: RequestStatus) => {
      const formData: FormData = {
        location: request.city_id,
        name: request.userName,
        organizationName: request.organizationName,
        organizationWebsite: request.organizationWebsite,
        email: request.email,
        phoneNumber: request.userPhoneNumber,
        numPeopleHelped: request.numPeopleHelped,
        comments: request.userComments,
        status: status,
        supplies: request.supplies
      };
      const updateData: RequestUpdateParams = {
        formData: formData,
        id: request.internal_id
      };
      await mutate(updateData);
      await queryClient.refetchQueries(["listRequests"]);
      setExpandedRequestPanel(false);
    }, [mutate, queryClient]
  );

  const handleClose = () => {
    setFilterOpen(false);
  };
  const showFilters = () => { setFilterOpen(true); };
  const refreshData = async () => { await queryClient.refetchQueries(["listRequests"]); };

  useEffect(() => {
    document.title = t("orders_page_title");
    ReactGA.send("pageview");
  }, [t]);

  // TODO need to properly handle error and loading states
  if (!cities || !supplies || !requests) {
    return null;
  }

  const filteredRequests = requests.filter((request: Request) => (!ignoreStatus.includes(request.status)));

  return (
    <React.Fragment>
      <Header hasHeadline hasLangSelector />
      <Content>
        <h1 className="title">Orders</h1>
        <Stack spacing={1} direction="row">
          <Avatar sx={{ backgroundColor: "#274FDB", cursor: "pointer" }}>
            <FilterListIcon onClick={showFilters} sx={{ color: "white" }} />
          </Avatar>
          <Avatar sx={{ backgroundColor: "#274FDB", cursor: "pointer" }}>
            <RefreshIcon onClick={refreshData} sx={{ color: "white" }} />
          </Avatar>
        </Stack>
        <Spacer size={24} />

        <div>
          {filteredRequests.map((request) => (
            <Accordion
              disableGutters
              elevation={0}
              square
              expanded={expandedRequestPanel === `panel-${request.internal_id}`}
              onChange={toggleRequestPanel(`panel-${request.internal_id}`)}
              key={request.internal_id}
              sx={{
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0px 1px 8px 2px #14141414",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${request.internal_id}-content`}
                id={`panel-${request.internal_id}-header`}
                sx={{
                  flexDirection: "row-reverse",
                  padding: "10px 16px",
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(180deg)",
                  },
                  "& .MuiAccordionSummary-content": {
                    marginLeft: "10px",
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" flexGrow="inherit">
                  <Box sx={{ marginLeft: "0px", paddingTop: "5px" }}>
                    <Text variant="bold">Request #{request.internal_id.substr(0, 8)}</Text>
                  </Box>
                  <Box marginLeft="20px" className={styles.circle}
                    sx={{ backgroundColor: statusToColor[request.status] }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  padding: "20px",
                }}
              >
                <Stack spacing={0}>
                  <Typography>{cityLookup[request.city_id].name}</Typography>
                  <Typography>{request.userName}</Typography>
                  <Typography>{request.userPhoneNumber}</Typography>
                </Stack>

                <Spacer size={24} />

                <Stack spacing={1}>
                  <dl className={styles.descriptionList}>
                    {request.supplies.map((supply) => (
                      <React.Fragment key={supply.id}>
                        <dt>{supplyLookup[supply.id].parent}: {supplyLookup[supply.id].name}</dt>
                        <dd>{supply.amount}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </Stack>

                <Spacer size={20} />

                <Stack spacing={1}>
                  <dl className={styles.descriptionList}>
                    <dt>Date</dt>
                    <dd>{new Date(request.timestamp).toLocaleString()}</dd>
                    <dt>Status</dt>
                    <dd>{RequestStatus[request.status]}</dd>
                  </dl>
                </Stack>

                {request.status !== RequestStatus.New &&
                 <>
                   <Spacer size={20} />
                   <Button fullWidth
                     disabled={isLoading}
                     onClick={() => setConfirmDialogConfig({status: RequestStatus.New, request: request})}>
                     Mark as New
                   </Button>
                 </>}

                {request.status === RequestStatus.New &&
                 <>
                   <Spacer size={20} />
                   <Button fullWidth
                     disabled={isLoading}
                     onClick={() => setPartialDispatchRequest({request: request, new_supplies: request.supplies.map(x => Object.assign({}, x))})}>
                     Partially dispatch
                   </Button>
                 </>}
                {request.status !== RequestStatus.Invalid &&
                 <>
                   <Spacer size={20} />
                   <Button fullWidth
                     disabled={isLoading}
                     onClick={() => setConfirmDialogConfig({request: request, status: RequestStatus.Invalid})}>
                     Mark as Invalid
                   </Button>
                 </>}

                {(request.status !== RequestStatus.Expired && request.status !== RequestStatus.Invalid) &&
                 <>
                   <Spacer size={20} />
                   <Button fullWidth
                     disabled={isLoading}
                     onClick={() => setConfirmDialogConfig({request: request, status: RequestStatus.Expired})}>
                     Mark as Expired
                   </Button>
                 </>}


              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        {confirmDialogConfig && <Dialog
          open={true}>
          <DialogTitle>Mark #{confirmDialogConfig.request.internal_id.substr(0, 8)} as {RequestStatus[confirmDialogConfig.status]}</DialogTitle>
          <DialogContent>
           You are about to change the status of this request.
          </DialogContent>
          <DialogActions>
            <MUIButton autoFocus onClick={() => setConfirmDialogConfig(undefined)}>
              Cancel
            </MUIButton>
            <MUIButton onClick={() => {changeStatus(confirmDialogConfig.request, confirmDialogConfig.status); setConfirmDialogConfig(undefined);}}>
              Confirm
            </MUIButton>
          </DialogActions>
        </Dialog>}
        {partialDispatchRequest && <Dialog open={true}>
          <DialogTitle>Dispatch #{partialDispatchRequest.request.internal_id.substr(0, 8)} partially</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column">
            {partialDispatchRequest.new_supplies.map((supply) => (
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
            </Box>
          </DialogContent>
        </Dialog>}
        <Dialog
          fullScreen
          open={filterOpen}
          onClose={handleClose}
          TransitionComponent={Grow as React.ComponentType}
        >
          <div className="dialog_body">
            <div className="dialog_body_root">
              <div onClick={handleClose} className={styles.headerItem} >
                <ImgBack alt="Back" className={styles.backIcon} />
                <span>Back</span>
              </div>
              <Spacer size={20} />
              <Text className={styles.filterTitle}>Status</Text>
              <Spacer size={10} />
              <Stack direction="row" spacing={1} >
                <Chip label="New" classes={{ label: styles.filterChip }} color={ignoreStatus.indexOf(RequestStatus.New) !== -1 ? "default" : "primary"} onClick={() => toggleRequestStatus(RequestStatus.New)} />
                <Chip label="Invalid" classes={{ label: styles.filterChip }} color={ignoreStatus.indexOf(RequestStatus.Invalid) !== -1 ? "default" : "primary"} onClick={() => toggleRequestStatus(RequestStatus.Invalid)} />
                <Chip label="Expired" classes={{ label: styles.filterChip }} color={ignoreStatus.indexOf(RequestStatus.Expired) !== -1 ? "default" : "primary"} onClick={() => toggleRequestStatus(RequestStatus.Expired)} />
              </Stack>
            </div>
          </div>
        </Dialog>
      </Content>
    </React.Fragment>
  );
}
