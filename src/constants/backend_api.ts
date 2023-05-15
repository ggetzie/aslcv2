// For functions that make backend calls

import axios from 'axios';
import {
  SpatialArea,
  SpatialAreaQuery,
} from './EnumsAndInterfaces/SpatialAreaInterfaces';
import {getFilteredSpatialAreasQuery, getHeaders} from './utilityFunctions';
import {SpatialContext} from './EnumsAndInterfaces/ContextInterfaces';
import {API_ENDPOINTS} from './endpoints';

export async function getFilteredSpatialAreasList(
  spatialAreaQuery: SpatialAreaQuery,
) {
  const API = 'api/area/' + getFilteredSpatialAreasQuery(spatialAreaQuery);
  try {
    const headers = await getHeaders();
    const result = await axios.get(API, {
      headers: {
        ...headers,
      },
    });
    return Promise.resolve(result.data);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}
export async function getContextsForArea(area: SpatialArea) {
  const url = API_ENDPOINTS.Context_ListHZEN(
    area.utm_hemisphere,
    area.utm_zone,
    area.area_utm_easting_meters,
    area.area_utm_northing_meters,
  );
  try {
    const headers = await getHeaders();
    const result = await axios.get(url, {
      headers: {
        ...headers,
      },
    });
    return Promise.resolve(result.data);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}

export async function getSpatialArea(
  spatialAreaId: string,
): Promise<SpatialArea> {
  const url = API_ENDPOINTS.Area_DetailById(spatialAreaId);
  try {
    const headers = await getHeaders();
    const result = await axios.get(url, {
      headers: {
        ...headers,
      },
    });
    return Promise.resolve(result.data);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}

export async function createContext(
  spatial_area: string,
): Promise<SpatialContext> {
  const url = API_ENDPOINTS.Context_ListAll;
  try {
    const headers = await getHeaders();
    const result = await axios.post(
      url,
      {spatial_area: spatial_area},
      {
        headers: {
          ...headers,
        },
      },
    );
    return Promise.resolve(result.data);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}

export async function getContextTypes(): Promise<string[]> {
  const url = API_ENDPOINTS.Context_ListTypes;
  try {
    const headers = await getHeaders();
    const result = await axios.get(url, {
      headers: {
        ...headers,
      },
    });
    return Promise.resolve(result.data.map((obj) => obj.type));
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}

export async function updateContext(
  context: SpatialContext,
): Promise<SpatialContext> {
  const url = API_ENDPOINTS.Context_DetailById(context.id);
  try {
    const headers = await getHeaders();
    if (context.spatial_area != null) {
      delete context.spatial_area;
    }
    const result = await axios.put(url, context, {
      headers: {
        ...headers,
      },
    });
    return Promise.resolve(result.data);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}

export async function getContextDetail(id: string): Promise<SpatialContext> {
  const url = API_ENDPOINTS.Context_DetailById(id);
  try {
    const headers = await getHeaders();
    const result = await axios.get(url, {
      headers: {
        ...headers,
      },
    });
    return Promise.resolve(result.data);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}

export async function uploadContextPhoto(
  contextImage: any,
  contextID: string,
  onUploadProgress: ({loaded, total}: {loaded: number; total: number}) => void,
): Promise<boolean> {
  const url = API_ENDPOINTS.Context_PhotoUpload(contextID);
  try {
    const headers = await getHeaders();
    await axios.put(url, contextImage, {
      headers: {...headers, 'Content-Type': 'multipart/form-data'},
      onUploadProgress: onUploadProgress,
    });
    return Promise.resolve(true);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}

export async function uploadBagPhoto(
  contextBagPhoto: any,
  contextID: string,
  onUploadProgress: ({loaded, total}: {loaded: number; total: number}) => void,
): Promise<boolean> {
  const url = API_ENDPOINTS.Context_BagPhotoUpload(contextID);
  try {
    const headers = await getHeaders();
    await axios.put(url, contextBagPhoto, {
      headers: {...headers, 'Content-Type': 'multipart/form-data'},
      onUploadProgress: onUploadProgress,
    });
    return Promise.resolve(true);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
}
