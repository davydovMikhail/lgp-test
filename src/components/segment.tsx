import { useState, useEffect, useRef } from "react";
import Currswitcher from "./currswitcher";
import { useTypedSelector } from "../storeHooks/useTypedSelector";
import { Currency } from "../types/main";
import { useEthers } from "@usedapp/core";
import { toast } from "react-toastify";
import { useActions } from '../storeHooks/useActions';
import { Status } from "../types/main";
import { useGetAllowance } from "../hooks/useGetAllowance";
import { useApproveToGame } from "../hooks/useApproveToGame";
import { useGetLastSegmentID } from "../hooks/useGetLastSegmentID";
import { useGetEtherBal } from "../hooks/useGetEtherBal";
import { useGetTokenBal } from "../hooks/useGetTokenBal";
import { useBidSegment } from "../hooks/useBidSegment";
import { useGetCurrentBlockNumber } from "../hooks/useGetBlockNumber";
import { usePlaySegment } from "../hooks/usePlaySegment";
import { useGetRandomSegment } from "../hooks/useGetRandomSegment";
import { useGetMaxEtherPayout } from "../hooks/useGetMaxEtherPayout";
import { useGetMaxTokenPayout } from "../hooks/useGetMaxTokenPayout"; 
import { useGetTotalSegments } from "../hooks/useGetTotalSegments";
import SetInterval from 'set-interval'

const Segment = () => {
    const { currency, ethBalance, splitBalance, maxEthPayout, maxSplitPayout, status } = useTypedSelector(state => state.main);
    const { SetStatus, SetNotification, SetEthBal, SetSplitBal, SetEthPayout, SetSplitPayout, SetTotalSegments } = useActions();
    const { account } = useEthers();

    const [from, setFrom] = useState(2500);
    const [to, setTo] = useState(7500);
    const [amount, setAmount] = useState(1);
    const firstUpdate = useRef(true);
    const firstIteration = useRef(true);
    const minBidEther = 0.00001;
    const minBidSplit = 1;
    const allowanceHook = useGetAllowance();
    const approveHook = useApproveToGame();
    const lastSegmentIDHook = useGetLastSegmentID();
    const etherBalHook = useGetEtherBal();
    const tokenBalHook = useGetTokenBal();
    const bidHook = useBidSegment();
    const blockHook = useGetCurrentBlockNumber();
    const playHook = usePlaySegment();
    const randomHook = useGetRandomSegment();
    const maxPayoutEtherHook = useGetMaxEtherPayout();
    const maxPayoutTokenHook = useGetMaxTokenPayout();
    const totalSegmentsHook = useGetTotalSegments();

    useEffect(() => {
      if(!firstUpdate.current) {
        handleValidateAmount(amount);
      }
      firstUpdate.current = false;
    },[currency]);

    function handleValidateAmount(_amount: number) {
      if (_amount < 0) {
        setAmount(0);  
      } else if (_amount < minBidSplit && currency === Currency.Split) {
          setAmount(minBidSplit);
      } else if (_amount < minBidEther && currency === Currency.Ether) {
          setAmount(minBidEther);
      } else if (_amount > splitBalance && currency === Currency.Split) {
          const num = Number((splitBalance - minBidSplit).toFixed(0)); 
          setAmount(num < 0 ? minBidSplit : num);
      } else if (_amount > ethBalance && currency === Currency.Ether) {
          const num = Number((ethBalance - minBidEther).toFixed(5));
          setAmount(num < 0 ? minBidEther : num);
      } else {
          setAmount(_amount);
      }
    }
    function handleValidateFrom(_from: number) {
        const diff = to - _from;
        if (_from > to || diff < 500) {
            const from = to - 500
            setFrom(Math.trunc(from));
        } else if (diff > 9500) {
            const from = to - 9500;
            if (from < 0) {
                setFrom(0);
            } else {
                setFrom(Math.trunc(from));
            }
        } else if (_from < 0) {
            setFrom(0);
        } else {
            setFrom(Math.trunc(_from));
        }
    }
    function handleValidateTo(_to: number) {
        const diff = _to - from;
        if (from > _to || diff < 500) {
            const to = from + 500
            setTo(Math.trunc(to));
        } else if (diff > 9500) {
            const to = from + 9500;
            if (to > 9999) {
                setTo(9999);
            } else {
                setTo(Math.trunc(to));
            }
        } else if (_to > 9999) {
            setTo(9999);
        } else {
            setTo(Math.trunc(_to));
        }
    }
    function changeFrom(_diff: number) {
        const newFrom = from + _diff;
        handleValidateFrom(newFrom);
    }
    function changeTo(_diff: number) {
        const newTo = to + _diff;
        handleValidateTo(newTo);
    }
    function getPercent() {
        const diff = to - from;
        if(diff < 500 || diff > 9500) {
            return NaN
        }
        return diff / 100;
    }
    function getPayuot() {
        if(getPercent() < 5 || getPercent() > 95) {
          return NaN
        }
        const numerator = currency === Currency.Ether ? 98 : 99.5;
        const answer = (amount * numerator) / getPercent();
        return currency === Currency.Ether ? answer.toFixed(6) : answer.toFixed(2);
    }
    function getWidthLeftDark() {
        const diff = to - from;
        if(diff < 500 || diff > 9500) {
            return 25
        }
        if(to > 9999 || from < 0) {
            return 25
        }
        return from / 100;
    }
    function getWidthMiddle() {
        const diff = to - from;
        if(diff < 500 || diff > 9500) {
            return 50
        }
        if(to > 9999 || from < 0) {
            return 50
        }
        return (to - from) / 100;
    }
    function getWidthRightDark() {
        const diff = to - from;
        if(diff < 500 || diff > 9500) {
            return 25
        }
        if(to > 9999 || from < 0) {
            return 25
        }
        return (9999 - to) / 100;
    }

    function handleDoubleAmount() {
      if(!_isAccount()) {
        return;
      }
      const doubleAmount = amount * 2;
      if(doubleAmount > ethBalance && currency === Currency.Ether) {
        setAmount(Number((ethBalance - minBidEther).toFixed(5)));
      } else if (doubleAmount > splitBalance && currency === Currency.Split) {
        setAmount(Number((splitBalance - minBidSplit).toFixed(0)));
      } else {
          setAmount(doubleAmount);
      }
    }
    function handleMaxAmount() {
      if(!_isAccount()) {
        return;
      }
      if(currency === Currency.Ether) {
        setAmount(Number((ethBalance - minBidEther).toFixed(5)));
      } else if (currency === Currency.Split) {
        setAmount(Number((splitBalance - minBidSplit).toFixed(0)));
      }  
    }
    function handleHalfAmount() {
        if(!_isAccount()) {
          return;
        }
        const halfAmount = amount / 2;
        if(halfAmount < minBidSplit && currency === Currency.Split) {
          setAmount(minBidSplit);
        } else if (halfAmount < minBidEther && currency === Currency.Ether) {
          setAmount(minBidEther);
        } else {
          setAmount(Number(halfAmount.toFixed(currency === Currency.Ether? 5 : 0)));
        }
    }
    function handleMinAmount() {
        if(!_isAccount()) {
          return;
        }
        if(currency === Currency.Ether) {
          setAmount(minBidEther);
        } else if(currency === Currency.Split) {
          setAmount(minBidSplit);  
        }
    }

    function _isAccount() {
      if (!account) {
        toast.info('FIRST CONNECT YOUR WALLET', {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "dark",
        });
        return false;
      } else {
        return true;
      }
    }

    async function handlePlay() {
      const _from = from;
      const _to = to;
      if (!account) {
        toast.info('FIRST CONNECT YOUR WALLET', {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "dark",
        });
        return;
      }
      if (
        (splitBalance < amount && currency === Currency.Split) || 
        (ethBalance < amount && currency === Currency.Ether)
      ) {
        toast.info('NOT ENOUGH BALANCE', {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "dark",
        });
        return;
      }
      if (
        (amount < minBidSplit && currency === Currency.Split) || 
        (amount < minBidEther && currency === Currency.Ether)
      ) {
        toast.info(`MINIMUM BET IS ${currency === Currency.Ether ? minBidEther : minBidSplit} $${currency}`, {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "dark",
        });
        return;
      }
      if (
        (maxEthPayout < (getPayuot() as number) && currency === Currency.Ether) ||
        (maxSplitPayout < (getPayuot() as number) && currency === Currency.Split)
      ) {
        toast.info('PAYOUT EXCEED THE MAX PAYOUT', {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
        return;
      }
      firstIteration.current = true;
      SetStatus(Status.Loader);
      if(currency === Currency.Split) {
        if((await allowanceHook(account) as number) < amount) {
          SetNotification('APPROVE YOUR $LGP TOKENS');
          await approveHook();
        }
      }
      SetNotification('CREATING A BID');
      const idBefore = await lastSegmentIDHook(account);
      const targetBlock = (await bidHook(amount, _from, _to, currency === Currency.Ether))?.blockNumber.toString() as string;
      SetInterval.start(async () => {
        const currentBlock = (await blockHook()) as number;
        const idAfter = await lastSegmentIDHook(account);
        if(idBefore !== idAfter && currentBlock > Number(targetBlock) && firstIteration.current) {
          firstIteration.current = false;
          SetInterval.clear('checkHash');
          SetNotification('CONFIRM THE FUNCTION TO FIND OUT THE RESULT');
          await playHook();
          const randomNumber = await randomHook(targetBlock, account);
          let balAfter: number;
          if(currency === Currency.Split) {
            balAfter = (await tokenBalHook(account as string)) as number;
          } else {
            balAfter = (await etherBalHook(account as string)) as number;
          }          
          if((randomNumber >= _from) && (randomNumber <= _to)) {
            SetNotification(`WIN. RANDOM: ${randomNumber}`);
            SetStatus(Status.Won);
          } else {
              SetNotification(`LOST. RANDOM: ${randomNumber}`);
              SetStatus(Status.Fail);
          }
          if(currency === Currency.Split) {
            SetSplitBal(balAfter);
          } else {
            SetEthBal(balAfter);
          }
          const maxEther = await maxPayoutEtherHook(); 
          const maxToken = await maxPayoutTokenHook(); 
          SetEthPayout(maxEther as number);
          SetSplitPayout(maxToken as number);
          const totalSegments = await totalSegmentsHook();
          SetTotalSegments(totalSegments);
        }
      }, 500, "checkHash")
    }
    
    return (
        <div className="game">
            <div className="chance">
              <div className="chance__text">
                <div>PAYOUT(${currency})</div>
                <div>CHANCE OF WIN</div>
              </div>
              <div className="chance__amount">
                <div className="chance__amount_left">{getPayuot()}</div>
                <div className="chance__amountpercent">{getPercent()}%</div>
              </div>
              <div className="line">
                <div style={{width: `${getWidthLeftDark()}%`}} className="line__left_dark"></div>
                <div style={{width: `${getWidthMiddle()}%`}} className="line__middle"></div>
                <div style={{width: `${getWidthRightDark()}%`}} className="line__right_dark"></div>
              </div>
              <div 
                className="range"
              >
                <div
                  style={{
                    width: `${getWidthLeftDark()}%`
                  }}  
                />
                <div 
                  className="range__item range__left"
                >
                  {from}
                </div>
                <div
                  style={{
                    width: `calc(${getWidthMiddle()}% - 100px)`,
                    paddingRight: "2px",
                    paddingLeft: "2px",
                  }}  
                />
                <div 
                  className="range__item range__right"
                >
                  {to}
                </div>
                <div
                  style={{
                    width: `${getWidthRightDark()}%`
                  }}  
                />
              </div>
              <button 
                className="decision__play"
                onClick={() => handlePlay()} 
                disabled={status === Status.Loader}
              >
                Play
              </button>
            </div>
            <div className="segment">
              <div className="segment__from">
                <div className="segment__title">
                  FROM
                </div>
                <input
                  type="number" 
                  placeholder='FROM' 
                  className="segment__input" 
                  value={from !== 0 ? from || '' : "0"}
                  onChange={(e) => setFrom(Number(e.target.value))}  
                  onBlur={(e) => handleValidateFrom(Number(e.target.value))}  
                />
                <div className="segment__buttons">
                  <button onClick={() => {changeFrom(-50)}} className="segment__setter">
                    -50
                  </button>
                  <button onClick={() => {changeFrom(50)}} className="segment__setter">
                    +50
                  </button>
                  <button onClick={() => {changeFrom(-500)}} className="segment__setter">
                    -500
                  </button>
                  <button onClick={() => {changeFrom(500)}} className="segment__setter">
                    +500
                  </button>
                </div>
              </div>
              <div className="segment__to">
                <div className="segment__title">
                  TO
                </div>
                <input
                  type="number"
                  placeholder='TO' 
                  className="segment__input"
                  value={to || ''}
                  onChange={(e) => setTo(Number(e.target.value))}  
                  onBlur={(e) => handleValidateTo(Number(e.target.value))} 
                />
                <div className="segment__buttons">
                  <button onClick={() => {changeTo(-50)}} className="segment__setter">
                    -50
                  </button>
                  <button onClick={() => {changeTo(50)}} className="segment__setter">
                    +50
                  </button>
                  <button onClick={() => {changeTo(-500)}} className="segment__setter">
                    -500
                  </button>
                  <button onClick={() => {changeTo(500)}} className="segment__setter">
                    +500
                  </button>
                </div>
              </div>
              <div className="segment__amount">
                <div className="segment__title">
                  BID AMOUNT (<span className="segment__title_span">${currency}</span>)
                </div>
                <div className="segment__bid">
                  <input
                    type="number"
                    placeholder='AMOUNT' 
                    className="bid__input"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    onBlur={(e) => handleValidateAmount(Number(e.target.value))} 
                  />
                  <Currswitcher />
                </div>
                <div className="segment__buttons">
                  <button onClick={() => handleDoubleAmount()} className="segment__setter">
                    Double
                  </button>
                  <button onClick={() => handleHalfAmount()} className="segment__setter">
                    Half
                  </button>
                  <button onClick={() => handleMaxAmount() } className="segment__setter">
                    Max
                  </button>
                  <button onClick={() => handleMinAmount()} className="segment__setter">
                    Min
                  </button>
                </div>
              </div>
            </div>
          </div> 
    );
  };
  
export default Segment;