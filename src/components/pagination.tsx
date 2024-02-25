import { useState, useEffect, useRef } from "react";
import shevron from "../img/chevron.svg";
import { useTypedSelector } from '../storeHooks/useTypedSelector';
import { useActions } from '../storeHooks/useActions';
import { useGetSegment } from "../hooks/useGetSegment";
import { useGetSliceSegments } from "../hooks/useGetSliceSegments";

const Pagination = () => {
        const { advanced, totalSplits, totalSegments } = useTypedSelector(state => state.main);
        const { ClearSegments, PushSegment } = useActions();
        const [pageSegment, setPageSegment] = useState(1);

        const sliceSegmentsHook = useGetSliceSegments();
        const segmentHook = useGetSegment();
        const breakSegmentsFor = useRef(false);
        const disableButs = useRef(false);

        useEffect(() => {
            const fetchData = async () => {
                if(totalSegments > 0) {
                    changePage(1, true);
                }
            }
            fetchData().catch(console.error);
        }, [totalSegments]);

        async function changePage(page: number, isAdvanced: boolean) {
            disableButs.current = true;
            if(isAdvanced) {
                breakSegmentsFor.current = true;
                setPageSegment(page);
                ClearSegments();
            }
            let start;
            let end;
            
            if (page === lastPage() && page !== 1 && page !== 2) {          
                end = remnant() || 10;
                start = 0;
            } else {
                end = isAdvanced ? totalSegments : totalSplits;
                end = end - 10 * (page - 1);
                start = end - 10;
                if (start < 0) {
                    start = 0;
                }
            }
            if(isAdvanced) {
                const hashes = await sliceSegmentsHook(start, end) as any[];
                breakSegmentsFor.current = false;
                disableButs.current = false;
                for(let i = 0; i < hashes.length; i++) {
                    if (breakSegmentsFor.current) {
                        breakSegmentsFor.current = false;
                        break;
                    }
                    const game = await segmentHook(hashes[i]);
                    if (breakSegmentsFor.current) {
                        breakSegmentsFor.current = false;
                        break;
                    }
                    PushSegment(game);
                    if (breakSegmentsFor.current) {
                        breakSegmentsFor.current = false;
                        break;
                    }
                }
            }
        }

        function currentPage() {
            return pageSegment
        }
    
        function lastPage() {
            const total = totalSegments
            let last = Math.trunc( total / 10 );
            if (remnant() > 0) {
                return last + 1;
            } else {
                return last;
            }
        }
    
        function remnant() {
            return totalSegments % 10;
        }
    
        function centralDigit() {
            const page = pageSegment;
            if(page === 1) {
                return 2;
            } else if (page === lastPage()) {
                return lastPage() - 1;
            } else {
                return pageSegment;
            }
        }
    
        return (
            <>
                {   
                    ((totalSplits > 10 && !advanced) || (totalSegments > 10 && advanced)) ?
                    <div className="pagination">
                        <button
                            onClick={() => {changePage(currentPage() - 1, advanced)}} 
                            disabled={currentPage() === 1 || disableButs.current} 
                            style={{borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px"}}
                            className={"pagination__cell " + (currentPage() === 1 ? "" : "pagination__cell_hover") }
                        >
                            <img style={{transform: "rotate(180deg)"}} src={shevron} alt="shev left" />
                        </button>
                        <button
                            className={"pagination__cell " + (currentPage() === 1 ? "pagination__cell_active" : "pagination__cell_hover") }
                            disabled={currentPage() === 1 || disableButs.current} 
                            onClick={() => {changePage(1, advanced)}} 
                        >
                            <div 
                                className={"pagination__text " + (currentPage() === 1 ? "pagination__text_active" : "") } 
                            >
                                1
                            </div>
                        </button>
                        {
                            currentPage() === 1 || currentPage() === 2 ? 
                            "" 
                            :
                            <div className="pagination__cell">
                                <div className="pagination__text">
                                    ...
                                </div>
                            </div>
                        }
                        { lastPage() === 2 ? 
                            ""    
                            :
                            <button 
                                    className={"pagination__cell " + (currentPage() === centralDigit() ? "pagination__cell_active" : "pagination__cell_hover") }
                                    disabled={currentPage() === centralDigit() || disableButs.current} 
                                    onClick={() => {changePage(centralDigit(), advanced)}} 
                            >
                                <div
                                    className={"pagination__text " + (currentPage() === centralDigit() ? "pagination__text_active" : "") } 
                                >
                                    {centralDigit()}
                                </div>
                            </button>
                        }
                        {
                            currentPage() === lastPage() || currentPage() === lastPage() - 1? 
                            "" 
                            :
                            <div className="pagination__cell">
                                <div className="pagination__text">
                                    ...
                                </div>
                            </div>
                        }
                        <button 
                            className={"pagination__cell " + (currentPage() === lastPage() ? "pagination__cell_active" : "pagination__cell_hover") }
                            onClick={() => changePage(lastPage(), advanced)}
                            disabled={currentPage() === lastPage() || disableButs.current} 
                        >
                            <div 
                                className={"pagination__text " + (currentPage() === lastPage() ? "pagination__text_active" : "") }
                            >
                                {lastPage()}
                            </div>
                        </button>
                        <button
                            disabled={currentPage() === lastPage() || disableButs.current} 
                            style={{borderTopRightRadius: "8px", borderBottomRightRadius: "8px"}}
                            onClick={() => {changePage(currentPage() + 1, advanced)}} 
                            className={"pagination__cell " + (currentPage() === lastPage() ? "" : "pagination__cell_hover") } 
                        >
                            <img src={shevron} alt="shev right" />
                        </button>
                    </div>
                : ""
                }
            </>
        ) 
        
          
}
export default Pagination;