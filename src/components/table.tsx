
import { useTypedSelector } from '../storeHooks/useTypedSelector';
import SegmentItem from './segmentItem';

const Table = () => {
    const { segmentGames } = useTypedSelector(state => state.main);
    
    return (
        <div className="table">
            <div className="table__top">
                <div className="table__title">
                    Status
                </div>
                <div className="table__title">
                  Address
                </div>
                <div className="table__title">
                  From-To
                </div>
                <div className="table__title">
                  Payout
                </div>
                <div className="table__title">
                  Random number
                </div>
            </div> 
                {segmentGames.map((block, index) => SegmentItem(block, index)) }
        </div>
    );
  };
  
export default Table;