// For functions that make backend calls

import axios from "axios";
import {SpatialArea, SpatialAreaQuery} from "./EnumsAndInterfaces/SpatialAreaInterfaces";
import {getFilteredSpatialAreasQuery, getHeaders} from "./utilityFunctions";
import {Context} from "./EnumsAndInterfaces/ContextInterfaces";


export async function getFilteredSpatialAreasList(spacialAreaQuery: SpatialAreaQuery) {
    const API = "api/area/" + getFilteredSpatialAreasQuery(spacialAreaQuery);
    try {
        const headers = await getHeaders();
        const result = await axios.get(API, {
            headers: {
                ...headers
            }
        });
        return Promise.resolve(result.data);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}

export async function getSpatialArea(spacialAreaId: string): Promise<SpatialArea> {
    const API = `api/area/${spacialAreaId}/`;
    try {
        const headers = await getHeaders();
        const result = await axios.get(API, {
            headers: {
                ...headers
            }
        });
        return Promise.resolve(result.data);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}

export async function createContext(spatial_area: string): Promise<Context> {
    const API = "api/context/";
    try {
        const headers = await getHeaders();
        const result = await axios.post(API, {spatial_area: spatial_area}, {
            headers: {
                ...headers
            }
        });
        return Promise.resolve(result.data);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}

export async function getContextTypes(): Promise<string[]> {
    const API = `api/context/types/`;
    try {
        const headers = await getHeaders();
        const result = await axios.get(API, {
            headers: {
                ...headers
            }
        });
        return Promise.resolve(result.data.map((obj)=> obj.type));
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}

export async function updateContext(context: Context): Promise<Context> {
    const API = `api/context/${context.id}/`;
    try {
        const headers = await getHeaders();
        if (context.spatial_area != null) {
            delete context.spatial_area;
        }
        const result = await axios.put(API, context, {
            headers: {
                ...headers
            }
        });
        return Promise.resolve(result.data);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}

export async function uploadContextImage(contextImage: any, contextId: string): Promise<boolean> {
    const API = `api/context/${contextId}/photo/`;
    try {
        const headers = await getHeaders();
         await axios.put(API, contextImage, {headers: {...headers, 'Content-Type': 'multipart/form-data'}});
        return Promise.resolve(true);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}

export async function uploadContextBagPhotoImage(contextBagPhoto: any, contextId: string): Promise<boolean> {
    const API = `api/context/${contextId}/bagphoto/`;
    try {
        const headers = await getHeaders();
         await axios.put(API, contextBagPhoto, {headers: {...headers, 'Content-Type': 'multipart/form-data'}});
        return Promise.resolve(true);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}

export async function uploadBagPhoto(contextImage: any, contextId: string, ): Promise<boolean> {
    const API = `api/context/${contextId}/bagphoto/`;
    try {
        const headers = await getHeaders();
         await axios.put(API, contextImage, {headers: {...headers, 'Content-Type': 'multipart/form-data'}});
        return Promise.resolve(true);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}
