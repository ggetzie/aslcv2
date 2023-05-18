import {UserProfile} from '../src/constants/EnumsAndInterfaces/UserDataInterfaces';
import {
  INSERT_IN_CONTEXT_ID_TO_CONTEXT_MAP,
  INSERT_IN_SPATIAL_AREA_ID_TO_SPATIAL_AREA_MAP,
  RESET_REDUCER_DATA,
  SET_CAN_SUBMIT_CONTEXT as SET_CAN_SUBMIT_CONTEXT,
  SET_SELECTED_CONTEXT_ID,
  SET_SELECTED_SPATIAL_AREA_ID,
  SET_SELECTED_SPATIAL_AREA,
  SET_SELECTED_SPATIAL_CONTEXT,
  CLEAR_SPATIAL_AREA_AND_CONTEXT,
  SET_USER_PROFILE_WITH_CREDENTIALS,
  SET_USER_PROFILE,
  SET_HOST,
} from './reducerAction';
import {SpatialArea} from '../src/constants/EnumsAndInterfaces/SpatialAreaInterfaces';
import {SpatialContext} from '../src/constants/EnumsAndInterfaces/ContextInterfaces';

export interface ReducerAction<T> {
  type: string;
  payload: T;
}

export const HOSTS = {
  test: {
    baseURL: 'https://j20200007.kotsf.com/asl',
    mediaURL: 'https://j20200007.kotsf.com',
  },
  live: {
    baseURL: 'http://gpuserver.edu.hku.hk/asl',
    mediaURL: 'http://gpuserver.edu.hku.hk/asl',
  },
};

export type hostChoices = keyof typeof HOSTS;

export interface AslReducerState {
  canSubmitContext: boolean;
  selectedSpatialAreaId: string;
  selectedSpatialArea: SpatialArea | null;
  selectedContextId: string;
  selectedSpatialContext: SpatialContext | null;
  spatialAreaIdToSpatialAreaMap: Map<string, SpatialArea>;
  contextIdToContextMap: Map<string, SpatialContext>;
  userProfile: UserProfile | null;
  host: hostChoices;
}

const initialState: AslReducerState = {
  canSubmitContext: false,
  selectedSpatialAreaId: null,
  selectedSpatialArea: null,
  selectedContextId: null,
  selectedSpatialContext: null,
  spatialAreaIdToSpatialAreaMap: new Map(),
  contextIdToContextMap: new Map(),
  userProfile: null,
  host: 'test',
};

export default function reducer(
  state = initialState,
  action: ReducerAction<any>,
) {
  switch (action.type) {
    case SET_CAN_SUBMIT_CONTEXT:
      return {
        ...state,
        canSubmitContext: action.payload,
      };
    case SET_USER_PROFILE_WITH_CREDENTIALS:
      return {
        ...state,
        userProfileWithCredentials: action.payload,
      };
    case SET_SELECTED_SPATIAL_AREA_ID:
      return {
        ...state,
        selectedSpatialAreaId: action.payload,
      };
    case SET_SELECTED_CONTEXT_ID:
      return {
        ...state,
        selectedContextId: action.payload,
      };
    case INSERT_IN_SPATIAL_AREA_ID_TO_SPATIAL_AREA_MAP:
      const spatialArea: SpatialArea = action.payload;
      const spatialAreaIdToSpatialAreaMap = new Map(
        state.spatialAreaIdToSpatialAreaMap,
      );
      spatialAreaIdToSpatialAreaMap.set(spatialArea.id, spatialArea);
      return {
        ...state,
        spatialAreaIdToSpatialAreaMap: spatialAreaIdToSpatialAreaMap,
      };

    case INSERT_IN_CONTEXT_ID_TO_CONTEXT_MAP:
      const context: SpatialContext = action.payload;
      const contextIdToContextMap = new Map(state.contextIdToContextMap);
      contextIdToContextMap.set(context.id, context);
      return {
        ...state,
        contextIdToContextMap: contextIdToContextMap,
      };
    case SET_SELECTED_SPATIAL_AREA:
      return {
        ...state,
        selectedSpatialArea: action.payload,
      };
    case SET_SELECTED_SPATIAL_CONTEXT:
      return {
        ...state,
        selectedSpatialContext: action.payload,
      };
    case CLEAR_SPATIAL_AREA_AND_CONTEXT:
      return {
        ...state,
        selectedSpatialArea: null,
        selectedSpatialAreaId: null,
        selectedSpatialContext: null,
        selectedSpatialContextId: null,
      };
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case RESET_REDUCER_DATA:
      return {
        ...initialState,
      };
    case SET_HOST:
      return {
        ...state,
        host: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
}
