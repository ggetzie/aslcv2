import {UserProfileWithCredentials} from "../src/constants/EnumsAndInterfaces/UserDataInterfaces";
import {RESET_REDUCER_DATA, SET_USER_PROFILE_WITH_CREDENTIALS} from "./reducerAction";

export interface ReducerAction {
    type: string;
    payload: any;
}

interface ReducerState {
    userProfileWithCredentials: UserProfileWithCredentials;
}

const initialState: ReducerState = {
    userProfileWithCredentials: null
};

export default function reducer(state = initialState, action: ReducerAction) {
    switch (action.type) {
        case SET_USER_PROFILE_WITH_CREDENTIALS:
            return {
                ...state,
                userProfileWithCredentials: action.payload
            };
        case RESET_REDUCER_DATA:
            return {
                ...initialState
            };
        default:
            return {
                ...state
            };
    }
};