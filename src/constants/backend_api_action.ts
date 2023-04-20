// For functions that make "dispatched" backend calls

import axios from 'axios';

import {
  insertInContextIdToContextMap,
  insertInSpatialAreaIdToSpatialAreaMap,
  setUserProfileWithCredentials,
} from '../../redux/reducerAction';
import {StoredItems} from './StoredItem';
import AsyncStorage from '@react-native-community/async-storage';
import {
  extractAndSaveJwt,
  getFilteredSpatialAreasQuery,
  getHeaders,
} from './utilityFunctions';
import {LoginDetails} from './EnumsAndInterfaces/UserDataInterfaces';
import {
  SpatialArea,
  SpatialAreaQuery,
} from './EnumsAndInterfaces/SpatialAreaInterfaces';
import {SpatialContext} from './EnumsAndInterfaces/ContextInterfaces';

export function loginUser(loginDetails: LoginDetails) {
  return async function (dispatch) {
    let API = 'auth-token/';
    try {
      let response = await axios.post(API, loginDetails);
      await extractAndSaveJwt(response);
      console.log('Response Data: ', response.data.token);

      dispatch(setUserProfileWithCredentials({id: null, ...loginDetails}));
      return Promise.resolve();
    } catch (error) {
      console.warn(error);
      return Promise.reject('Invalid Credentials!');
    }
  };
}

export function registerUser(loginDetails: LoginDetails) {
  return async function (dispatch) {
    const API = 'users/register';
    try {
      await axios.post(API, loginDetails);
      return dispatch(loginUser(loginDetails));
    } catch (error) {
      console.warn(error);
      return Promise.reject(error);
    }
  };
}

export function refreshJwtToken() {
  return async function (dispatch) {
    const API: string = 'users/refreshToken';
    try {
      const refreshToken: string = await AsyncStorage.getItem(
        StoredItems.REFRESH_TOKEN,
      );
      const headers = await getHeaders();
      let response = await axios.post(
        API,
        {
          inputString: refreshToken,
        },
        {
          headers: {
            ...headers,
          },
        },
      );
      await extractAndSaveJwt(response);
      dispatch(setUserProfileWithCredentials(response.data));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('Invalid Credentials!');
    }
  };
}

export function getFilteredSpatialAreaIdsList(
  spacialAreaQuery: SpatialAreaQuery,
) {
  return async function (dispatch) {
    const API = 'api/area/' + getFilteredSpatialAreasQuery(spacialAreaQuery);
    try {
      const headers = await getHeaders();
      const result = await axios.get(API, {
        headers: {
          ...headers,
        },
      });
      for (let area of result.data) {
        dispatch(insertInSpatialAreaIdToSpatialAreaMap(area));
      }
      return Promise.resolve(result.data.map((area) => area.id));
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  };
}

export function createContext(spatialArea: SpatialArea) {
  return async function (dispatch): Promise<string> {
    const API = 'api/context/';
    try {
      const headers = await getHeaders();
      const result = await axios.post(API, spatialArea, {
        headers: {
          ...headers,
        },
      });
      dispatch(insertInContextIdToContextMap(result.data));
      return Promise.resolve(result.data.id);
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  };
}

export function getContext(id: string) {
  return async function (dispatch): Promise<string> {
    const API = `api/context/${id}/`;
    try {
      const headers = await getHeaders();
      const result = await axios.get(API, {
        headers: {
          ...headers,
        },
      });
      dispatch(insertInContextIdToContextMap(result.data));
      return Promise.resolve(result.data.id);
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  };
}

export function getContexts(ids: string[]) {
  return async function (dispatch): Promise<any> {
    try {
      for (let i of ids) {
        getContext(i)(dispatch);
      }
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  };
}

export async function updateContext(context: SpatialContext) {
  return async function (dispatch): Promise<any> {
    const API = `api/context/${context.id}/`;
    try {
      const headers = await getHeaders();
      if (context.spatial_area != null) {
        delete context.spatial_area;
      }
      const result = await axios.put(API, context, {
        headers: {
          ...headers,
        },
      });
      dispatch(insertInContextIdToContextMap(result.data));
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  };
}
