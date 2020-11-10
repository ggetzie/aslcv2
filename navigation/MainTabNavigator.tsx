import * as React from 'react';
import {Image, StyleSheet} from "react-native";
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {verticalScale} from "../src/constants/nativeFunctions";
import SignupScreen from "../src/screens/login_signup/SignupScreen";
import DataLoadingComponent from "../src/components/DataLoadingComponent";
import LoginScreen from "../src/screens/login_signup/LoginScreen";
import SettingsScreen from "../src/screens/settings/SettingsScreen";
import {nativeColors} from "../src/constants/colors";
import {ContextBottomNav, EndOfDigBottomNav, SettingsBottomNav} from "../src/constants/imageAssets";
import ContextScreen from "../src/screens/context/ContextScreen";
import FindsBagPhotosScreen from "../src/screens/finds_bag_photos/FindsBagPhotosScreen";
import SelectFromListScreen from "../src/screens/context/SelectFromListScreen";
import ContextListScreen from "../src/screens/context/ContextListScreen";
import ContextDetailScreen from "../src/screens/context/ContextDetailScreen";


function defaultNavOptions({navigation}) {
    return {
        headerStyle: {
            backgroundColor: nativeColors.lightBrown,
            margin: "auto",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
        },
        headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
            fontSize: verticalScale(18)
        }
    };
}

const SettingsScreenStack = createStackNavigator({
    SettingsScreen: SettingsScreen,
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.iconBrown}]} resizeMode={"contain"}
                             source={SettingsBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={SettingsBottomNav}/>
            ),
    },
    defaultNavigationOptions: defaultNavOptions
});

const ContextScreenStack = createStackNavigator({
    ContextScreen: ContextScreen,
    SelectFromListScreen: SelectFromListScreen,
    ContextListScreen: ContextListScreen,
    ContextDetailScreen: ContextDetailScreen
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.iconBrown}]} resizeMode={"contain"}
                             source={ContextBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={ContextBottomNav}/>
            ),
    },
    defaultNavigationOptions: defaultNavOptions
});

const FindsBagPhotosScreenStack = createStackNavigator({
    FindsBagPhotosScreen: FindsBagPhotosScreen,
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.iconBrown}]} resizeMode={"contain"}
                             source={EndOfDigBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={EndOfDigBottomNav}/>
            ),
    },
    defaultNavigationOptions: defaultNavOptions
});

// const PhotogrammetryScreenStack = createStackNavigator({
//     PhotogrammetryScreen: PhotogrammetryScreen,
//     // Other screens go here
// }, {
//     navigationOptions: {
//         tabBarIcon: ({focused}) =>
//             (focused
//                     ? <Image style={[styles.bottomImage, {tintColor: nativeColors.iconBrown}]} resizeMode={"contain"}
//                              source={PhotogrammetryBottomNav}/>
//                     : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
//                              source={PhotogrammetryBottomNav}/>
//             ),
//     },
//     defaultNavigationOptions:defaultNavOptions
// });



export const LoginScreenNavigator = createStackNavigator({
    LoginScreen: LoginScreen,
    SignupScreen: SignupScreen,
    DataLoadingComponent: DataLoadingComponent
}, {
    headerMode: 'none'
});

export const MainTabNavigator = createBottomTabNavigator({
    ContextScreenStack: ContextScreenStack,
    FindsBagPhotosScreen: FindsBagPhotosScreenStack,
    SettingsScreenStack: SettingsScreenStack
    // PhotogrammetryScreenStack: PhotogrammetryScreenStack
}, {
    initialRouteName: "ContextScreenStack",
    tabBarOptions: {
        showLabel: false,
        style: {
            backgroundColor: 'white',
            elevation: 0,
            shadowOpacity: 0,
            borderTopWidth: 0,
        }
    }
});

const styles = StyleSheet.create({
    bottomImage: {
        height: verticalScale(20),
        width: verticalScale(20),
    }
});
