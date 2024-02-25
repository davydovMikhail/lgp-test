import { provider } from "../utils/provider";
import { useCallback } from "react"; 
import { formatEther } from '@ethersproject/units'

export const useGetEtherBal = () => {

    return useCallback(
        async (account: string) => {  
            try {
                const balance = await provider.getBalance(account);
                return Number(formatEther(balance));
            } catch(error: any) {
                const errorMessage =
                    error?.error?.message ||
                    error?.message ||
                    "Check console logs for error";
                console.error(error);
                console.error(errorMessage);
            } 
        }
        ,[]
    );
}