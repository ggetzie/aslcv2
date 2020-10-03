// For functions that make backend calls

import axios from "axios";
import {SpatialAreaQuery} from "./EnumsAndInterfaces/SpatialAreaInterfaces";
import {getFilteredSpatialAreasQuery, getHeaders} from "./utilityFunctions";


export async function getFilteredSpatialAreasList(spacialAreaQuery: SpatialAreaQuery) {
    const API = "api/area/" + getFilteredSpatialAreasQuery(spacialAreaQuery);
    console.log("API: ", API);
    try {
        const headers = await getHeaders();
        const result = await axios.get(API, {
            headers: {
                ...headers
            }
        });
        console.log("Result Aya: ", result.data);
        return Promise.resolve(result.data);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
}
