import { atom } from "recoil";

export const tvlState = atom({
  key: "tvl",
  default: 0,
});

export const lottoState = atom({
  key: "lotto",
  default: 0,
});

export const busdBalanceState = atom({
  key: "busdBalance",
  default: 0,
});

export const totalNftsState = atom({
  key: "totalNfts",
  default: 0,
});

export const userTicketsState = atom({
  key: "userTickets",
  default: [],
});

export const totalTicketsState = atom({
  key: "totalTickets",
  default: 0,
});

export const winnersState = atom({
  key: "winners",
  default: [],
});
