import React from "react";
import { ID } from "./api";
import { RequestStatus } from "../helpers/requests";

export type SupplyWithAmount = {
  id: string;
  amount: number;
};

export interface FormData {
  location?: ID;
  supplies: SupplyWithAmount[];
  name: string;
  organizationName: string;
  organizationWebsite: string;
  numPeopleHelped: number;
  email: string;
  phoneNumber: string;
  comments: string;
  status: RequestStatus;
}

export interface FormContextValue {
  currentValue: FormData;
  updateValue: (values: { [x: string]: any }) => void;
  clearStore: () => void;
}

const defaultValue: FormData = {
  name: "",
  phoneNumber: "",
  supplies: [],
  comments: "",
  organizationName: "",
  organizationWebsite: "",
  numPeopleHelped: 0,
  email: "",
  status: RequestStatus.New,
};

const FormContext = React.createContext<FormContextValue>({
  currentValue: defaultValue,
  updateValue: () => {},
  clearStore: () => {},
});

export function useFormValue() {
  return React.useContext(FormContext);
}

export const FormContextProvider: React.FunctionComponent = ({ children }) => {
  const [currentValue, setCurrentValue] = React.useState<FormData>(defaultValue);

  const updateValue = React.useCallback(
    (values: { [x: string]: any }) => {
      setCurrentValue({
        ...currentValue,
        ...values,
      });
    },
    [currentValue, setCurrentValue]
  );

  const clearStore = React.useCallback(() => {
    setCurrentValue(defaultValue);
  }, [setCurrentValue]);

  return (
    <FormContext.Provider
      value={{
        currentValue,
        updateValue,
        clearStore,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
