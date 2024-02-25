import { useEffect } from "react"
import start from "../img/start.svg";
import connect from "../img/connect.svg";
import loader from "../img/loader.svg";
import won from "../img/won.svg";
import lost from "../img/lost.svg";
import wallet from "../img/wallet.svg";
import Girl from "../img/girl.png";
import { useTypedSelector } from '../storeHooks/useTypedSelector';
import { Currency } from "../types/main";
import { useActions } from '../storeHooks/useActions';
import { useGetMaxEtherPayout } from "../hooks/useGetMaxEtherPayout";
import { useGetMaxTokenPayout } from "../hooks/useGetMaxTokenPayout"; 
import { useGetEtherBal } from "../hooks/useGetEtherBal";
import { useGetTokenBal } from "../hooks/useGetTokenBal"; 
import { useGetTotalSegments } from "../hooks/useGetTotalSegments";
import { useEthers } from "@usedapp/core";
import { Status } from "../types/main";

const Info = () => {
    const { currency, notification, maxEthPayout, maxSplitPayout, ethBalance, splitBalance, status } = useTypedSelector(state => state.main);
    const { SetEthPayout, SetSplitPayout, SetEthBal, SetSplitBal, SetTotalSegments } = useActions();
    const { account } = useEthers();

    function getIcon() {
        if(!account) {
            return connect
        } else if (status === Status.Fail) {
            return lost;
        } else if (status === Status.Guess) {
            return start
        } else if (status === Status.Loader) {
            return loader
        } else if (status === Status.Won) {
            return won;
        }
    }

    function maxPayout() {
        return Currency.Ether === currency ? maxEthPayout.toFixed(5) : maxSplitPayout.toFixed(0);
    }

    function balance() {
        return Currency.Ether === currency ? ethBalance.toFixed(5) : splitBalance.toFixed(0);
    }

    const totalSegmentsHook = useGetTotalSegments();
    const maxPayoutEtherHook = useGetMaxEtherPayout();
    const maxPayoutTokenHook = useGetMaxTokenPayout();
    const balSplitHook = useGetTokenBal();
    const balEtherHook = useGetEtherBal();
    useEffect(() => {
        const fetchData = async () => {
            const maxEther = await maxPayoutEtherHook(); 
            const maxToken = await maxPayoutTokenHook(); 
            SetEthPayout(maxEther as number);
            SetSplitPayout(maxToken as number);
        }
        fetchData().catch(console.error);
    },[]);
    useEffect(() => {
        const fetchData = async () => {
            const totalSegments = await totalSegmentsHook();
            SetTotalSegments(totalSegments);
        }
        fetchData().catch(console.error);
    },[]);

    useEffect(() => {
        const fetchData = async () => {
            if(account) {
                const balanceSplit = await balSplitHook(account as string);   
                const balanceEther = await balEtherHook(account as string);   
                SetEthBal(balanceEther as number);
                SetSplitBal(balanceSplit as number);
            }
        }
        fetchData().catch(console.error);
    }, [account]);

    return (
        <div className="info">
            <div className="info__girl">
                <img className="info__pic" src={Girl} alt="" />
            </div>
            <div className="info__max">
                <div className="info__maxtitle">
                    Maximum payout:
                </div>
                <div className="info__maxinfo">
                    {maxPayout()} ${currency}
                </div>
            </div>
            <div className="info__text">
                <img style={{marginRight: "12px"}} src={wallet} alt="" />
                <div>
                    balance: {balance()} ${currency}
                </div>
            </div>
            <div 
                className={status === Status.Loader ? "info__pulse info__text" : "info__text"}
            >
                <img style={{marginRight: "12px"}} src={getIcon()} alt="" />
                <div>
                    {account ? notification : "connect your wallet"}
                </div>
            </div>
        </div>
    );
  };
  
export default Info;