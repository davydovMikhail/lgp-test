import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { useContracts } from "./useContracts";
import { utils } from 'ethers';
import { toast } from "react-toastify";
const chain = process.env.REACT_APP_CHAIN as string;

export const useBidSegment = () => {
  const { GameContract } = useContracts();
  const { switchNetwork, account, activateBrowserWallet } = useEthers();

  return useCallback(
    async (bid: number, from: number, to: number, eth: boolean) => {
      if (!GameContract) return;
      await switchNetwork(Number(chain));
      activateBrowserWallet();
      try {
        let txPromise;
        if(eth) {
            txPromise = await GameContract.bidSegment("0", from, to, {value: utils.parseEther(bid.toString())});
        } else {
            txPromise = await GameContract.bidSegment(utils.parseEther(bid.toString()), from, to);
        }   
        const tx = await txPromise.wait();
        toast.success('BID DONE', {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "colored",
        });
        return tx;
      } catch (error: any) {
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          "Check console logs for error";
        console.error(error);
        console.error(errorMessage);
        toast.error('Err! See console', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "colored",
        });
      }
    },
    [GameContract, switchNetwork, account]
  );
};