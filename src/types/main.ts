export enum Status {
    Connect,
    Loader,
    Guess,
    Won,
    Fail
}

export enum Currency {
    Split = "LGP",
    Ether = "ETH"
}

export interface MainState {
    notification: string;
    status: Status;
    currency: Currency;
    segmentGames: any[];
    splitGames: any[];
    ethBalance: number;
    splitBalance: number;
    maxEthPayout: number;
    maxSplitPayout: number;
    advanced: boolean;
    totalSplits: number;
    totalSegments: number;
}

export enum MainActionTypes {
    SET_NOTIFICATION = 'SET_NOTIFICATION',
    SET_STATUS = 'SET_STATUS',
    SET_CURRENCY = 'SET_CURRENCY',
    PUSH_SEGMENT = 'PUSH_SEGMENT',
    PUSH_SPLIT = 'PUSH_SPLIT',
    CLEAR_SEGMENTS = 'CLEAR_SEGMENTS',
    CLEAR_SPLITS = 'CLEAR_SPLITS',
    SET_ETH_BAL = 'SET_ETH_BAL',
    SET_SPLIT_BAL = 'SET_SPLIT_BAL',
    SET_ETH_PAYOUT = 'SET_ETH_PAYOUT',
    SET_SPLIT_PAYOUT = 'SET_SPLIT_PAYOUT',
    SET_ADVANCED = 'SET_ADVANCED',
    SET_TOTAL_SPLITS = 'SET_TOTAL_SPLITS',
    SET_TOTAL_SEGMENTS = 'SET_TOTAL_SEGMENTS'
} 


interface SetNotificationAction {
    type: MainActionTypes.SET_NOTIFICATION;
    payload: string;
}
interface SetStatusAction {
    type: MainActionTypes.SET_STATUS;
    payload: Status;
}
interface SetCurrencyAction {
    type: MainActionTypes.SET_CURRENCY;
    payload: Currency;
}
interface PushSegmentAction {
    type: MainActionTypes.PUSH_SEGMENT;
    payload: any;
}
interface PushSplitAction {
    type: MainActionTypes.PUSH_SPLIT;
    payload: any;
}
interface ClearSegmentsAction {
    type: MainActionTypes.CLEAR_SEGMENTS;
}
interface ClearSplitsAction {
    type: MainActionTypes.CLEAR_SPLITS;
}
interface SetEthBalAction {
    type: MainActionTypes.SET_ETH_BAL;
    payload: number;
}
interface SetSplitBalAction {
    type: MainActionTypes.SET_SPLIT_BAL;
    payload: number;
}
interface SetEthPayoutAction {
    type: MainActionTypes.SET_ETH_PAYOUT;
    payload: number;
}
interface SetSplitPayoutAction {
    type: MainActionTypes.SET_SPLIT_PAYOUT;
    payload: number;
}
interface SetAdvancedAction {
    type: MainActionTypes.SET_ADVANCED;
    payload: boolean;
}
interface SetTotalSplitsAction {
    type: MainActionTypes.SET_TOTAL_SPLITS;
    payload: number;
}
interface SetTotalSegmentsAction {
    type: MainActionTypes.SET_TOTAL_SEGMENTS;
    payload: number;
}

export type MainAction = 
    SetNotificationAction |
    SetStatusAction |
    SetCurrencyAction |
    PushSegmentAction |
    PushSplitAction |
    ClearSegmentsAction |
    ClearSplitsAction |
    SetEthBalAction |
    SetSplitBalAction |
    SetEthPayoutAction |
    SetSplitPayoutAction |
    SetAdvancedAction |
    SetTotalSplitsAction |
    SetTotalSegmentsAction;
