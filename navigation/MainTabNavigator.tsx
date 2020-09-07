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


const HomeScreenStack = createStackNavigator({
    HomeScreen: HomeScreen,
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.tintedBrown}]} resizeMode={"contain"}
                             source={HomeBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={HomeBottomNav}/>
            ),
    },
    defaultNavigationOptions: ({navigation}) => {
        return {
            headerStyle: {
                backgroundColor: '#000000',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
                fontSize: verticalScale(18)
            },

            // headerLeft: () => <BackButtonComponent navigation={navigation} showWhite={true}/>
        };
    }
});

const ContextScreenStack = createStackNavigator({
    ContextScreen: ContextScreen,
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.tintedBrown}]} resizeMode={"contain"}
                             source={ContextBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={ContextBottomNav}/>
            ),
    },
    defaultNavigationOptions: ({navigation}) => {
        return {
            headerStyle: {
                backgroundColor: '#000000',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
                fontSize: verticalScale(18)
            },

            // headerLeft: () => <BackButtonComponent navigation={navigation} showWhite={true}/>
        };
    }
});

const EndOfDigScreenStack = createStackNavigator({
    EndOfDigScreen: EndOfDigScreen,
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.tintedBrown}]} resizeMode={"contain"}
                             source={EndOfDigBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={EndOfDigBottomNav}/>
            ),
    },
    defaultNavigationOptions: ({navigation}) => {
        return {
            headerStyle: {
                backgroundColor: '#000000',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
                fontSize: verticalScale(18)
            },

            // headerLeft: () => <BackButtonComponent navigation={navigation} showWhite={true}/>
        };
    }
});

const PhotogrammetryScreenStack = createStackNavigator({
    PhotogrammetryScreen: PhotogrammetryScreen,
    // Other screens go here
}, {
    navigationOptions: {
        tabBarIcon: ({focused}) =>
            (focused
                    ? <Image style={[styles.bottomImage, {tintColor: nativeColors.tintedBrown}]} resizeMode={"contain"}
                             source={PhotogrammetryBottomNav}/>
                    : <Image style={[styles.bottomImage, {tintColor: nativeColors.grey}]} resizeMode={"contain"}
                             source={PhotogrammetryBottomNav}/>
            ),
    },
    defaultNavigationOptions: ({navigation}) => {
        return {
            headerStyle: {
                backgroundColor: '#000000',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
                fontSize: verticalScale(18)
            },

            // headerLeft: () => <BackButtonComponent navigation={navigation} showWhite={true}/>
        };
    }
});



export const LoginScreenNavigator = createStackNavigator({
    LoginScreen: LoginScreen,
    SignupScreen: SignupScreen,
    DataLoadingComponent: DataLoadingComponent
}, {
    defaultNavigationOptions: ({navigation}) => {
        return {
            headerStyle: {
                backgroundColor: '#000000',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
                fontSize: verticalScale(18)
            },

            // TODO: Investigate necessity
            // headerLeft: () => <BackButtonComponent navigation={navigation} showWhite={true}/>
        }
    }
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
