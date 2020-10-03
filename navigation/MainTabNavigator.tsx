import * as React from 'react';
import {Image, StyleSheet} from "react-native";
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {verticalScale} from "../src/constants/nativeFunctions";
import SignupScreen from "../src/screens/login_signup/SignupScreen";
import DataLoadingComponent from "../src/components/DataLoadingComponent";
import LoginScreen from "../src/screens/login_signup/LoginScreen";
import HomeScreen from "../src/screens/home/HomeScreen";
import {nativeColors} from "../src/constants/colors";
import {
    ContextBottomNav,
    EndOfDigBottomNav,
    HomeBottomNav,
    PhotogrammetryBottomNav
} from "../src/constants/imageAssets";
import ContextScreen from "../src/screens/context/ContextScreen";
import EndOfDigScreen from "../src/screens/end_of_dig/EndOfDigScreen";
import PhotogrammetryScreen from "../src/screens/photogrammetry/PhotogrammetryScreen";
import SpatialAreaSelectScreen from "../src/screens/context/SpatialAreaSelectScreen";



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

const HomeScreenStack = createStackNavigator({
    HomeScreen: HomeScreen,
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.iconBrown}]} resizeMode={"contain"}
                             source={HomeBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={HomeBottomNav}/>
            ),
    },
    defaultNavigationOptions: defaultNavOptions
});

const ContextScreenStack = createStackNavigator({
    ContextScreen: ContextScreen,
    SpatialAreaSelectScreen: SpatialAreaSelectScreen
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

const EndOfDigScreenStack = createStackNavigator({
    EndOfDigScreen: EndOfDigScreen,
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

const PhotogrammetryScreenStack = createStackNavigator({
    PhotogrammetryScreen: PhotogrammetryScreen,
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.iconBrown}]} resizeMode={"contain"}
                             source={PhotogrammetryBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={PhotogrammetryBottomNav}/>
            ),
    },
    defaultNavigationOptions:defaultNavOptions
});



export const LoginScreenNavigator = createStackNavigator({
    LoginScreen: LoginScreen,
    SignupScreen: SignupScreen,
    DataLoadingComponent: DataLoadingComponent
}, {
    headerMode: 'none'
});

export const MainTabNavigator = createBottomTabNavigator({
    HomeScreenStack: HomeScreenStack,
    ContextScreenStack: ContextScreenStack,
    EndOfDigScreenStack: EndOfDigScreenStack,
    PhotogrammetryScreenStack: PhotogrammetryScreenStack
}, {
    initialRouteName: "HomeScreenStack",
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
