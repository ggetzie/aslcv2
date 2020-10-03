import {UserProfileWithCredentials} from "../src/constants/EnumsAndInterfaces/UserDataInterfaces";
import {
    RESET_REDUCER_DATA,
    SET_SELECTED_SPATIAL_AREA,
    SET_USER_PROFILE_WITH_CREDENTIALS
} from "./reducerAction";
import {SpatialArea} from "../src/constants/EnumsAndInterfaces/SpatialAreaInterfaces";

export interface ReducerAction {
    type: string;
    payload: any;
}

interface ReducerState {
    selectedSpatialArea: SpatialArea;
    userProfileWithCredentials: UserProfileWithCredentials;
}

const initialState: ReducerState = {
    selectedSpatialArea: null,
    userProfileWithCredentials: null
};

export default function reducer(state = initialState, action: ReducerAction) {
    switch (action.type) {
        case SET_USER_PROFILE_WITH_CREDENTIALS:
            return {
                ...state,
                userProfileWithCredentials: action.payload
            };
        case  SET_SELECTED_SPATIAL_AREA:
            return {
              ...state,
              selectedSpatialArea: action.payload
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
