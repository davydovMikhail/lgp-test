import { MainAction, MainActionTypes, Status, Currency } from "../../types/main";

export function SetNotification(notification: string): MainAction {
    return {type: MainActionTypes.SET_NOTIFICATION, payload: notification}
}
export function SetStatus(status: Status): MainAction {
    return {type: MainActionTypes.SET_STATUS, payload: status}
}
export function SetCurrency(currency: Currency): MainAction {
    return {type: MainActionTypes.SET_CURRENCY, payload: currency}
}
export function PushSegment(segment: any): MainAction {
    return {type: MainActionTypes.PUSH_SEGMENT, payload: segment}
}
export function PushSplit(split: any): MainAction {
    return {type: MainActionTypes.PUSH_SPLIT, payload: split}
}
export function ClearSegments(): MainAction {
    return {type: MainActionTypes.CLEAR_SEGMENTS}
}
export function ClearSplits(): MainAction {
    return {type: MainActionTypes.CLEAR_SPLITS}
}
export function SetEthBal(bal: number): MainAction {
    return {type: MainActionTypes.SET_ETH_BAL, payload: bal}
}
export function SetSplitBal(bal: number): MainAction {
    return {type: MainActionTypes.SET_SPLIT_BAL, payload: bal}
}
export function SetEthPayout(payout: number): MainAction {
    return {type: MainActionTypes.SET_ETH_PAYOUT, payload: payout}
}
export function SetSplitPayout(payout: number): MainAction {
    return {type: MainActionTypes.SET_SPLIT_PAYOUT, payload: payout}
}
export function SetAdvanced(is: boolean): MainAction {
    return {type: MainActionTypes.SET_ADVANCED, payload: is}
}
export function SetTotalSplits(amount: number): MainAction {
    return {type: MainActionTypes.SET_TOTAL_SPLITS, payload: amount}
}
export function SetTotalSegments(amount: number): MainAction {
    return {type: MainActionTypes.SET_TOTAL_SEGMENTS, payload: amount}
}