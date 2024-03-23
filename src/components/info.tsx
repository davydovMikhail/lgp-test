import start from "../img/start.svg";
import connect from "../img/connect.svg";
import loader from "../img/loader.svg";
import won from "../img/won.svg";
import lost from "../img/lost.svg";
import wallet from "../img/wallet.svg";
import Girl from "../img/girl.png";
import { useTypedSelector } from '../storeHooks/useTypedSelector';
import { Status } from "../types/main";

const Info = () => {
    const { address, notification, status } = useTypedSelector(state => state.main);

    function getIcon() {
        if(!address) {
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
        return "10500000"
    }

    function balance() {
        return "0";
    }

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
                    {maxPayout()} $LGP
                </div>
            </div>
            <div className="info__text">
                <img style={{marginRight: "12px"}} src={wallet} alt="" />
                <div>
                    balance: {balance()} $LGP
                </div>
            </div>
            <div 
                className={status === Status.Loader ? "info__pulse info__text" : "info__text"}
            >
                <img style={{marginRight: "12px"}} src={getIcon()} alt="" />
                <div>
                    {address ? notification : "connect your wallet"}
                </div>
            </div>
        </div>
    );
  };
  
export default Info;