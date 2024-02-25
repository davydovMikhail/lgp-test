import Logo from "./img/logo.svg";
import Person from "./img/person.svg";
import Info from './components/info';
import Segment from './components/segment';
import Table from './components/table';
import Tabs from './components/tabs';
import Pagination from './components/pagination';
import Footer from './components/footer';
import { useEthers } from "@usedapp/core";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useTypedSelector } from './storeHooks/useTypedSelector';
import { Status } from './types/main';
import { useClaim } from './hooks/useClaim';
import { toast } from "react-toastify";
import { useActions } from './storeHooks/useActions';
import { useGetTokenBal } from "./hooks/useGetTokenBal";

function App() {
  const { status, advanced, splitBalance } = useTypedSelector(state => state.main);
  const { SetSplitBal, SetNotification, SetStatus, SetAdvanced } = useActions();
  const { activateBrowserWallet, account } = useEthers();
  
  const advancedHandler = () => {
    SetAdvanced(!advanced)
  }

  const claimHook = useClaim();
  const balSplitHook = useGetTokenBal();

  async function handleClaim() {
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
    if (splitBalance > 0) {
        toast.info('YOU HAVE ALREADY RECEIVED TEST TOKENS', {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "dark",
        });
        return;
    }
    SetNotification("GETTING TOKENS");
    SetStatus(Status.Loader);
    await claimHook();
    const balSplit = await balSplitHook(account as string);   
    SetSplitBal(balSplit as number);
    SetNotification("TOKENS RECEIVED");
    SetStatus(Status.Won);
}

  return (
    <>
      <main>
        <div className="header-wrapper">
          <div className="header">
            <div className="header__left">
              <img src={Logo} className="header__logo" />
              {/* <div className="switcher">
                <div className="toggle-pill-dark">
                  <input 
                    type="checkbox" 
                    id="pill4"
                    name="check"
                    checked={advanced}
                    onChange={advancedHandler}
                    disabled={status === Status.Loader}
                  />
                  <label htmlFor="pill4"></label>
                </div>
                <div className="switcher__title">
                  advanced mode
                </div>
              </div> */}
            </div>
            <div className="header__right">
              <div 
                onClick={() => handleClaim()} 
                className="button__size button__transparent header__claim"
              >
                <div>
                CLAIM TEST
                </div> 
              </div>
              {account? <div className="button__size button__transparent">
                          <img style={{marginRight: "10px"}} src={Person} alt="Person" />
                          <div>
                          {account?.slice(0, 5)}...{account?.slice(-2)}
                          </div>
                        </div> :
                        <div style={{cursor: "pointer"}}  onClick={() => activateBrowserWallet()} className="button__size button__style">
                          <div>CONNECT WALLET</div> 
                        </div>
              }
            </div>
          </div>
        </div>

        <div className="bg-wrapper">
          <div className="base">
            <Info />
              <Segment/>  
          </div>
        </div>
        <div className="table-wrapper">
            <Tabs />
            <Table />
            <div className="pagination-wrapper">
              <Pagination />
            </div>
        </div>
        <Footer />
      </main>
      <ToastContainer/>
    </>
    
  );
}

export default App;
