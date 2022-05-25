
export type SupplyWithAmount = {
  id: string;
  amount: number;
};

export enum RequestStatus {
  New,
  InTransit,
  Delivered,
  Invalid,
  Expired,
};

export type Request = {
  id: number;
  internal_id: string;
  city_id: number;
  userName: string;
  userPhoneNumber: string;
  userComments: string;
  supplies: SupplyWithAmount[];
  status: RequestStatus;
  timestamp: number;
  deliveryDate: Date | undefined;
};

// TODO: Remove when we have a BE ready.
export const fakeRequests: Request[] = [
  {
    id: 1,
    internal_id: "test1",
    city_id: 13,
    userName: "Anton",
    userPhoneNumber: "911",
    supplies: [
      {
        id: "Baby: Cookies",
        amount: 13,
      },
      {
        id: "Breakfast: Cereal",
        amount: 7
      }
    ],
    status: RequestStatus.New,
    userComments: "really really need it",
    timestamp: 1652380921660,
    deliveryDate: undefined,
  },
  {
    id: 2,
    internal_id: "test2",
    city_id: 23,
    userName: "Anton",
    userPhoneNumber: "911",
    supplies: [
      {
        id: "Breakfast: Granola",
        amount: 26,
      },
      {
        id: "Household: Dish Soap",
        amount: 9
      }
    ],
    status: RequestStatus.New,
    userComments: "can wait a few days",
    timestamp: 1652380921660,
    deliveryDate: undefined,
  },
];
