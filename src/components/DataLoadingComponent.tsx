import * as React from "react";
import {
    NavigationParams,
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationState
} from "react-navigation";
import {UserProfileWithCredentials} from "../constants/EnumsAndInterfaces/UserDataInterfaces";
import {LoadingComponent} from "./general/LoadingComponent";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {refreshJwtToken} from "../constants/backend_api_action";
import {getJwtFromAsyncStorage} from "../constants/utilityFunctions";

if (typeof TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding');
    TextEncoder = TextEncodingPolyfill.TextEncoder;
    TextDecoder = TextEncodingPolyfill.TextDecoder;
}



// TODO: Investigate typescript error
// @ts-ignore
const DataLoadingComponent: NavigationScreenComponent<any> = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token: string = await getJwtFromAsyncStorage();
                if(token != null && token.trim().length !== 0){
                    props.navigation.navigate("HomeScreen");
                } else {
                    throw new Error("Not Logged in");
                }
                //TODO: Implement Logic to verify correctness of existing token
                //
                // await dispatch(refreshJwtToken());
            } catch (error) {
                props.navigation.navigate("LoginScreen");
                return;
            }
        };
        fetchData();
    }, []);

    return <LoadingComponent/>;
};

DataLoadingComponent.navigationOptions = screenProps => ({
    title: '',
    headerLeft: () => null
});

export default DataLoadingComponent;
