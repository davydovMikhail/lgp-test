import { MainState, MainAction, MainActionTypes, Status } from "../../types/main";

const initialState: MainState = {
    address: null,
    notification: "TRY YOUR LUCK!",
    status: Status.Guess
}

export const mainReducer = (state: MainState = initialState, action: MainAction): MainState => {
    switch (action.type) {
        case MainActionTypes.SET_ADDRESS:
            return {...state, address: action.payload}
        case MainActionTypes.SET_NOTIFICATION:
            return {...state, notification: action.payload}
        case MainActionTypes.SET_STATUS:
            return {...state, status: action.payload}
        default:
            return state
    }
}