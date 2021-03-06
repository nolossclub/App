import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const RPC_URLS = {
  56: "https://bsc-dataseed.binance.org/",
};

export const injected = new InjectedConnector({
  supportedChainIds: [56],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 56: RPC_URLS[56] },
  qrcode: true,
});
