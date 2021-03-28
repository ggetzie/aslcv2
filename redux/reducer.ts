import {UserProfileWithCredentials} from "../src/constants/EnumsAndInterfaces/UserDataInterfaces";
import {
    INSERT_IN_CONTEXT_ID_TO_CONTEXT_MAP,
    INSERT_IN_SPATIAL_AREA_ID_TO_SPATIAL_AREA_MAP,
    RESET_REDUCER_DATA,
    SET_CAN_CONTEST_BE_SUBMITTED,
    SET_SELECTED_CONTEXT_ID,
    SET_SELECTED_SPATIAL_AREA_ID,
    SET_USER_PROFILE_WITH_CREDENTIALS
} from "./reducerAction";
import {SpatialArea} from "../src/constants/EnumsAndInterfaces/SpatialAreaInterfaces";
import {Context} from "../src/constants/EnumsAndInterfaces/ContextInterfaces";

export interface ReducerAction<T> {
    type: string;
    payload: T;
}

interface ReducerState {
    canContextBeSubmitted: boolean;
    selectedSpatialAreaId: string;
    selectedContextId: string;
    spatialAreaIdToSpatialAreaMap: Map<string, SpatialArea>;
    contextIdToContextMap: Map<string, Context>;
    userProfileWithCredentials: UserProfileWithCredentials;
}

const initialState: ReducerState = {
    canContextBeSubmitted: false,
    selectedSpatialAreaId: null,
    selectedContextId: null,
    spatialAreaIdToSpatialAreaMap: new Map(),
    contextIdToContextMap: new Map(),
    userProfileWithCredentials: null
};

export default function reducer(state = initialState, action: ReducerAction<any>) {
    switch (action.type) {
        case SET_CAN_CONTEST_BE_SUBMITTED:
            return {
                ...state,
                canContextBeSubmitted: action.payload
            };
        case SET_USER_PROFILE_WITH_CREDENTIALS:
            return {
                ...state,
                userProfileWithCredentials: action.payload
            };
        case  SET_SELECTED_SPATIAL_AREA_ID:
            return {
                ...state,
                selectedSpatialAreaId: action.payload
            };
        case SET_SELECTED_CONTEXT_ID:
            return {
                ...state,
                selectedContextId: action.payload
            };
        case INSERT_IN_SPATIAL_AREA_ID_TO_SPATIAL_AREA_MAP:
            const spatialArea: SpatialArea = action.payload;
            const spatialAreaIdToSpatialAreaMap = new Map(state.spatialAreaIdToSpatialAreaMap);
            spatialAreaIdToSpatialAreaMap.set(spatialArea.id, spatialArea);
            return {
                ...state,
                spatialAreaIdToSpatialAreaMap: spatialAreaIdToSpatialAreaMap
            };

        case INSERT_IN_CONTEXT_ID_TO_CONTEXT_MAP:
            const context: Context = action.payload;
            const contextIdToContextMap = new Map(state.contextIdToContextMap);
            contextIdToContextMap.set(context.id, context);
            return {
                ...state,
                contextIdToContextMap: contextIdToContextMap
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
