// For functions that make backend calls

import axios from "axios";
import {SpatialAreaQuery} from "./EnumsAndInterfaces/SpatialAreaInterfaces";
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

export async function getContext(id: string): Promise<Context> {
    const API = `api/context/${id}/`;
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

export async function getContexts(ids: string[]): Promise<Context[]> {
    try {
        const contexts: Context[] = [];
        for (let i of ids) {
            contexts.push(await getContext(i));
        }
        return Promise.resolve(contexts);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}

export async function updateContext(context): Promise<Context> {
    const API = `api/context/${context.id}/`;
    try {
        const headers = await getHeaders();
        if(context.spatial_area != null){
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
