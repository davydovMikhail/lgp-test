import Qurtred from "../img/qurtred.svg";
import Qurtbrown from "../img/qurtbrown.svg";
import { useTypedSelector } from '../storeHooks/useTypedSelector';

const Tabs = () => {
    const { totalSegments } = useTypedSelector(state => state.main);
    
    return (
        <div className="tabs">
              <div className="tabs__tab tabs__active">
                <img className="tabs__icon" src={Qurtred} alt="" />
                <div className="tabs__white">
                  total games (<span className="tabs__span">{totalSegments}</span>)
                </div>
              </div>
              <div className="tabs__tab tabs__default">
                <div className="tabs__left">
                  <img className="tabs__icon" src={Qurtbrown} alt="" />
                  <div className="tabs__brown">
                    top wins
                  </div>
                </div>
                <div className="tabs__soon">
                  <div className="tabs__soontext">
                    soon
                  </div>
                </div>
              </div>
              <div className="tabs__tab tabs__default">
                <div className="tabs__left">
                  <img className="tabs__icon" src={Qurtbrown} alt="" />
                  <div className="tabs__brown">
                    top loses
                  </div>
                </div>
                <div className="tabs__soon">
                  <div className="tabs__soontext">
                    soon
                  </div>
                </div>
              </div>
              <div className="tabs__tab tabs__default">
                <div className="tabs__left">
                  <img className="tabs__icon" src={Qurtbrown} alt="" />
                  <div className="tabs__brown">
                    luckiest
                  </div>
                </div>
                <div className="tabs__soon">
                  <div className="tabs__soontext">
                    soon
                  </div>
                </div>
              </div>
            </div>
    );
  };
  
export default Tabs;