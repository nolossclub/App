const config = {
  network: "Binance Smart Chain",
  MAX_GAS_LIMIT: 800000,
  thegraph: {
    BUSD: "https://api.thegraph.com/subgraphs/name/nolossclub/busd",
    USDT: "https://api.thegraph.com/subgraphs/name/nolossclub/usdt",
    USDC: "https://api.thegraph.com/subgraphs/name/nolossclub/usdc",
  },
  tokens: {
    BUSD: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    USDT: "0x55d398326f99059ff775485246999027b3197955",
    USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  },
  controller: {
    BUSD: "0xCcA5090c5D80189eF27bc802eCB50A771CdA41Fc",
    USDT: "0x1776B0cda0CB4A99F377A3191676250FA553aa2A",
    USDC: "0x381289c891e6EE5AB5B89b45D4f141c511b0D559",
  },
  nft: {
    BUSD: "0x165a3cda295784c195746e3b267602eede1fc901",
    USDT: "0xE91DB8abe66613571c05471bfc358f15DAFBc4dB",
    USDC: "0xbD310c711602A605b8cd888240398478dA28b387",
  },
};

export default config;
