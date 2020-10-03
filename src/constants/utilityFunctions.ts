import moment from "moment-timezone";
import AsyncStorage from "@react-native-community/async-storage";
import {StoredItems} from "./StoredItem";
import {AxiosResponse} from "axios";
import {SpatialAreaQuery} from "./EnumsAndInterfaces/SpatialAreaInterfaces";


export async function getJwtFromAsyncStorage(): Promise<string> {
    return await AsyncStorage.getItem(StoredItems.JWT_TOKEN);
}

export async function getHeaders(lastModifiedDate?: number) {
    const jwt = await getJwtFromAsyncStorage();
    return {
        'Authorization': jwt,
        'If-Modified-Since': moment(lastModifiedDate == null ? 0 : lastModifiedDate + 1000).tz('GMT').format("ddd, DD MMM YYYY  HH:mm:ss z")
    };
}

export async function extractAndSaveJwt(response: AxiosResponse) {
    const jwtToken = "TOKEN " + response.data.token;

    //TODO: Implement RefreshToken on backend
    const refreshToken = response.data.token;
    await AsyncStorage.setItem(StoredItems.JWT_TOKEN, jwtToken);
    await AsyncStorage.setItem(StoredItems.REFRESH_TOKEN, refreshToken);
}

export function getFilteredSpatialAreasQuery(spatialAreaQuery: SpatialAreaQuery): string {
    if (spatialAreaQuery == null) {
        return '';
    }
    const params: string[] = [];

    if (spatialAreaQuery.utm_zone) {
        params.push(`utm_zone=${spatialAreaQuery.utm_zone}`);
    }
    if (spatialAreaQuery.utm_hemisphere) {
        params.push(`utm_hemisphere=${spatialAreaQuery.utm_hemisphere}`);
    }
    if (spatialAreaQuery.area_utm_easting_meters) {
        params.push(`area_utm_easting_meters=${spatialAreaQuery.area_utm_easting_meters}`);
    }
    if (spatialAreaQuery.area_utm_northing_meters) {
        params.push(`area_utm_northing_meters=${spatialAreaQuery.area_utm_northing_meters}`);
    }
    const paramString = params.join('&');

    if (isNotEmptyOrNull(paramString)) {
        return ("?" + paramString);
    } else {
        return '';
    }
}

export function isNotEmptyOrNull(val: string) {
    return val != null && val != "" && val.trim() != "";
}

export function isNotEmptyOrNullBatch(...args: string[]) {
    let safe = true;
    args.forEach((str) => {
        if (!isNotEmptyOrNull(str)) {
            safe = false;
        }
    });
    return safe;
}


