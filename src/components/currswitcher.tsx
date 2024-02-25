import ethcur from "../img/ethcur.svg";
import splitcur from "../img/splitcur.svg";
import { Currency } from "../types/main";
import { useActions } from "../storeHooks/useActions"; 
import { useTypedSelector } from '../storeHooks/useTypedSelector';
import { Status } from "../types/main";

const Currswitcher = () => {
    const { SetCurrency } = useActions();
    const { status, currency } = useTypedSelector(state => state.main);
    
    return (
        <div className="bid__switch">
            <button
                className={currency === Currency.Ether ? "bid__on" : "bid__off"}
                onClick={() => {SetCurrency(Currency.Ether)}}
                disabled={status === Status.Loader}
            >
                <img src={ethcur} alt="" />
                <div>ETH</div>
            </button>
            <button 
                className={currency === Currency.Split ? "bid__on" : "bid__off"}
                onClick={() => {SetCurrency(Currency.Split)}}
                disabled={status === Status.Loader}
            >
                <img src={splitcur} alt="" />
                <div>LGP</div>
            </button>
        </div>
    );
  };
  
export default Currswitcher;