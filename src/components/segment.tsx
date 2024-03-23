import { useState } from "react";
import { useTypedSelector } from "../storeHooks/useTypedSelector";
import { toast } from "react-toastify";
import { useActions } from '../storeHooks/useActions';
import { Status } from "../types/main";

const Segment = () => {
    const { status, address } = useTypedSelector(state => state.main);
    const { SetNotification } = useActions();

    const [from, setFrom] = useState(2500);
    const [to, setTo] = useState(7500);
    const [amount, setAmount] = useState(1);
    const minBidSplit = 1;
    const maxBidSplit = 5000000;

    function handleValidateAmount(_amount: number) {
      if (_amount < 0) {
        setAmount(0);  
      } else if (_amount < minBidSplit) {
          setAmount(minBidSplit);
      } else if (_amount > maxBidSplit) {
          setAmount(maxBidSplit);
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
        const answer = (amount * 99.5) / getPercent();
        return answer.toFixed(2);
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
      const doubleAmount = amount * 2;
      if (doubleAmount > maxBidSplit) {
        setAmount(maxBidSplit);
      } else {
          setAmount(doubleAmount);
      }
    }
    function handleMaxAmount() {
      setAmount(maxBidSplit); 
    }
    function handleHalfAmount() {
        const halfAmount = amount / 2;
        if(halfAmount < minBidSplit) {
          setAmount(minBidSplit);
        } else {
          setAmount(Number(halfAmount.toFixed(0)));
        }
    }
    function handleMinAmount() {
        setAmount(minBidSplit);
    }

    async function handlePlay() {
      if (!address) {
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
      toast.info('CASINO WILL GO LIVE ON MARCH 25TH 12:00', {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
      SetNotification('CASINO WILL GO LIVE ON MARCH 25TH 12:00');
    }
    
    return (
        <div className="game">
            <div className="chance">
              <div className="chance__text">
                <div>PAYOUT($LGP)</div>
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
                  BID AMOUNT (<span className="segment__title_span">$LGP</span>)
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