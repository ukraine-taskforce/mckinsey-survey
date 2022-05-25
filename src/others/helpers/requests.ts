
export type SupplyWithAmount = {
  id: string;
  amount: number;
};

export enum RequestStatus {
  New,
  Invalid,
  Expired,
};

export type Request = {
  id: number;
  internal_id: string;
  city_id: number;
  userName: string;
  organizationName: string;
  email: string;
  organizationWebsite: string;
  numPeopleHelped: number;
  userPhoneNumber: string;
  userComments: string;
  supplies: SupplyWithAmount[];
  status: RequestStatus;
  timestamp: number;
  deliveryDate: Date | undefined;
};
