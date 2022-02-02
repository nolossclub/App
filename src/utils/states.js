import { atom } from "recoil";

export const tvlState = atom({
  key: "tvl",
  default: 0,
});

export const lottoState = atom({
  key: "lotto",
  default: 0,
});

export const tokenBalanceState = atom({
  key: "tokenBalance",
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

export const selectedTokenState = atom({
  key: "selectedToken",
  default: "BUSD",
});
