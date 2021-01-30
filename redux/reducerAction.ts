import {ReducerAction} from "./reducer";
import {UserProfileWithCredentials} from "../src/constants/EnumsAndInterfaces/UserDataInterfaces";
import {SpatialArea} from "../src/constants/EnumsAndInterfaces/SpatialAreaInterfaces";
import {Context} from "../src/constants/EnumsAndInterfaces/ContextInterfaces";

export const RESET_REDUCER_DATA: string = "RESET_REDUCER_DATA";
export const SET_USER_PROFILE_WITH_CREDENTIALS: string = "SET_USER_PROFILE_WITH_CREDENTIALS";
export const SET_SELECTED_SPATIAL_AREA_ID: string = "SET_SELECTED_SPATIAL_AREA_ID";
export const SET_SELECTED_CONTEXT_ID: string = "SET_SELECTED_CONTEXT_ID";

export const INSERT_IN_SPATIAL_AREA_ID_TO_SPATIAL_AREA_MAP = "INSERT_IN_SPATIAL_AREA_ID_TO_SPATIAL_AREA_MAP";
export const INSERT_IN_CONTEXT_ID_TO_CONTEXT_MAP = "INSERT_IN_CONTEXT_ID_TO_CONTEXT_MAP";

export function setUserProfileWithCredentials(userProfileWithCredentials: UserProfileWithCredentials): ReducerAction<UserProfileWithCredentials> {
    return {
        type: SET_USER_PROFILE_WITH_CREDENTIALS,
        payload: userProfileWithCredentials
    };
}

export function setSelectedSpatialAreaId(spatialAreaId: string): ReducerAction<string> {
    return {
        type: SET_SELECTED_SPATIAL_AREA_ID,
        payload: spatialAreaId
    };
}

export function setSelectedContextId(contextId: string): ReducerAction<string> {
    return {
        type: SET_SELECTED_CONTEXT_ID,
        payload: contextId
    };
}

export function insertInSpatialAreaIdToSpatialAreaMap(spatialArea: SpatialArea): ReducerAction<SpatialArea> {
    return {
        type: INSERT_IN_SPATIAL_AREA_ID_TO_SPATIAL_AREA_MAP,
        payload: spatialArea
    };
}

export function insertInContextIdToContextMap(context: Context): ReducerAction<Context> {
    return {
        type: INSERT_IN_CONTEXT_ID_TO_CONTEXT_MAP,
        payload: context
    };
}

export function resetReducerData(): ReducerAction<null> {
    return {
        type: RESET_REDUCER_DATA,
        payload: null
    };
}
