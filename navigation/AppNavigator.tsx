import * as React from 'react';
import {createSwitchNavigator} from 'react-navigation';

import {LoginScreenNavigator, MainTabNavigator} from './MainTabNavigator';
import DataLoadingComponent from "../src/components/DataLoadingComponent";

export const rootNavigator = (signedIn = false) => {
    return createSwitchNavigator({
        DataLoading: DataLoadingComponent,
        Main: MainTabNavigator,
        Login: LoginScreenNavigator
    }, {
        initialRouteName: signedIn? 'DataLoading' : 'Login'
    });
};
