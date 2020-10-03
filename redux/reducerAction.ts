import {ReducerAction} from "./reducer";
import {UserProfileWithCredentials} from "../src/constants/EnumsAndInterfaces/UserDataInterfaces";
import {SpatialArea} from "../src/constants/EnumsAndInterfaces/SpatialAreaInterfaces";

export const RESET_REDUCER_DATA: string = "RESET_REDUCER_DATA";
export const SET_USER_PROFILE_WITH_CREDENTIALS: string = "SET_USER_PROFILE_WITH_CREDENTIALS";
export const SET_SELECTED_SPATIAL_AREA: string = "SET_SELECTED_SPATIAL_AREA";

export function setUserProfileWithCredentials(userProfileWithCredentials: UserProfileWithCredentials): ReducerAction {
    return {
        type: SET_USER_PROFILE_WITH_CREDENTIALS,
        payload: userProfileWithCredentials
    };
}

export function setSelectedSpatialArea(spatialArea: SpatialArea): ReducerAction {
    return {
        type: SET_SELECTED_SPATIAL_AREA,
        payload: spatialArea
    };
}

export function resetReducerData(): ReducerAction {
    return {
        type: RESET_REDUCER_DATA,
        payload: null
    };
}
