// For functions that make "dispatched" backend calls

import axios from "axios";


import {setUserProfileWithCredentials} from "../../redux/reducerAction";
import {StoredItems} from "./StoredItem";
import AsyncStorage from "@react-native-community/async-storage";
import {extractAndSaveJwt, getHeaders} from "./utilityFunctions";
import {LoginDetails} from "./EnumsAndInterfaces/UserDataInterfaces";

export function loginUser(loginDetails: LoginDetails) {
    return async function (dispatch) {
        let API = "login";
        try {
            let response = await axios.post(API, loginDetails);
            await extractAndSaveJwt(response);
            dispatch(setUserProfileWithCredentials(response.data));
            return Promise.resolve();
        } catch (error) {
            console.warn(error);
            return Promise.reject("Invalid Credentials!");
        }
    }
}

export function registerUser(loginDetails: LoginDetails) {
    return async function (dispatch) {
        const API = "users/register";
        try {
            await axios.post(API, loginDetails);
            return dispatch(loginUser(loginDetails));
        } catch (error) {
            console.warn(error);
            return Promise.reject(error);
        }
    }
}

export function refreshJwtToken() {
    return async function (dispatch) {
        const API: string = "users/refreshToken";
        try {
            const refreshToken: string = await AsyncStorage.getItem(StoredItems.REFRESH_TOKEN);
            const headers = await getHeaders();
            let response = await axios.post(API, {
                inputString: refreshToken
            }, {
                headers: {
                    ...headers
                }
            });
            await extractAndSaveJwt(response);
            dispatch(setUserProfileWithCredentials(response.data));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject("Invalid Credentials!");
        }
    }
}
