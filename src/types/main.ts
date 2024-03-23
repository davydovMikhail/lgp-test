export enum Status {
    Connect,
    Loader,
    Guess,
    Won,
    Fail
}

export interface MainState {
    address: string | null;
    notification: string;
    status: Status;
}

export enum MainActionTypes {
    SET_ADDRESS = 'SET_ADDRESS',
    SET_NOTIFICATION = 'SET_NOTIFICATION',
    SET_STATUS = 'SET_STATUS'
} 

interface SetAddressAction {
    type: MainActionTypes.SET_ADDRESS;
    payload: string | null;
}
interface SetNotificationAction {
    type: MainActionTypes.SET_NOTIFICATION;
    payload: string;
}
interface SetStatusAction {
    type: MainActionTypes.SET_STATUS;
    payload: Status;
}

export type MainAction = 
    SetAddressAction |
    SetNotificationAction |
    SetStatusAction;
