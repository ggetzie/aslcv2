import {ReducerAction} from "./reducer";
import {UserProfileWithCredentials} from "../src/constants/EnumsAndInterfaces/UserDataInterfaces";

export const RESET_REDUCER_DATA: string = "RESET_REDUCER_DATA";
export const SET_USER_PROFILE_WITH_CREDENTIALS: string = "SET_USER_PROFILE_WITH_CREDENTIALS";

export function setUserProfileWithCredentials(userProfileWithCredentials: UserProfileWithCredentials): ReducerAction {
    return {
        type: SET_USER_PROFILE_WITH_CREDENTIALS,
        payload: userProfileWithCredentials
    };
}

export function resetReducerData(): ReducerAction {
    return {
        type: RESET_REDUCER_DATA,
        payload: null
    };
}
