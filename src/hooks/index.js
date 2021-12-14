import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import config from "../utils/config";
import controllerAbi from "../utils/abis/controller.json";
import nftAbi from "../utils/abis/nft.json";
import busdAbi from "../utils/abis/busd.json";
import { Contract } from "@ethersproject/contracts";

export function useControllerContract() {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    try {
      return new Contract(
        config.CONTROLLER_CONTRACT_ADDRESS,
        controllerAbi,
        library.getSigner(account).connectUnchecked()
      );
    } catch (error) {
      console.error("Contract error.", error);
      return null;
    }
  }, [library, account]);
}

export function useNFTContract() {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    try {
      return new Contract(
        config.NFT_ADDRESS,
        nftAbi,
        library.getSigner(account).connectUnchecked()
      );
    } catch (error) {
      console.error("Contract error.", error);
      return null;
    }
  }, [library, account]);
}

export function useBUSDContract() {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    try {
      return new Contract(
        config.BUSD_ADDRESS,
        busdAbi,
        library.getSigner(account).connectUnchecked()
      );
    } catch (error) {
      console.error("Contract error.", error);
      return null;
    }
  }, [library, account]);
}
