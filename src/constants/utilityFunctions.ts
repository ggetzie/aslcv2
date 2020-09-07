import moment from "moment-timezone";
import AsyncStorage from "@react-native-community/async-storage";
import {StoredItems} from "./StoredItem";
import {AxiosResponse} from "axios";


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
    const jwtToken = response.headers["authorization"];
    const refreshToken = response.headers["refresh token"];
    await AsyncStorage.setItem(StoredItems.JWT_TOKEN, jwtToken);
    await AsyncStorage.setItem(StoredItems.REFRESH_TOKEN, refreshToken);
}
