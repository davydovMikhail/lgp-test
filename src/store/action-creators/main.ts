import { MainAction, MainActionTypes, Status } from "../../types/main";

export function SetAddress(address: string | null): MainAction {
    return {type: MainActionTypes.SET_ADDRESS, payload: address}
}
export function SetNotification(notification: string): MainAction {
    return {type: MainActionTypes.SET_NOTIFICATION, payload: notification}
}
export function SetStatus(status: Status): MainAction {
    return {type: MainActionTypes.SET_STATUS, payload: status}
}