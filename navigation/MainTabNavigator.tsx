import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {useSelector} from 'react-redux';
import {verticalScale} from '../src/constants/nativeFunctions';
import SignupScreen from '../src/screens/login_signup/SignupScreen';
import DataLoadingComponent from '../src/components/DataLoadingComponent';
import LoginScreen from '../src/screens/login_signup/LoginScreen';
import SettingsScreen from '../src/screens/settings/SettingsScreen';
import {nativeColors} from '../src/constants/colors';
import {
  ContextBottomNav,
  FindBagPhotosBottomNav,
  HomeBottomNav,
  SettingsBottomNav,
} from '../src/constants/imageAssets';
import SpatialAreaSelectScreen from '../src/screens/area/SpatialAreaSelectScreen';
import FindsBagPhotosScreen from '../src/screens/finds_bag_photos/FindsBagPhotosScreen';
import SelectFromListScreen from '../src/screens/area/SelectFromListScreen';
import ContextListScreen from '../src/screens/context/ContextListScreen';
import ContextDetailScreen from '../src/screens/context/ContextDetailScreen';
import {StateDependentTabIcon} from '../src/components/StateDependentTabIcon';
import {
  AppState,
  getAppState,
} from '../src/constants/EnumsAndInterfaces/AppState';
import ConfirmAlert from '../src/components/ConfirmAlert';
import {ReducerState} from '../redux/reducer';

function defaultNavOptions({navigation}) {
  return {
    headerStyle: {
      margin: 'auto',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: 'black',
      fontSize: verticalScale(18),
    },
  };
}

const SettingsScreenStack = createStackNavigator(
  {
    SettingsScreen: SettingsScreen,
    // Other screens go here
  },
  {
    navigationOptions: {
      tabBarIcon: ({focused}) => (
        <Image
          style={[
            styles.bottomImage,
            {tintColor: focused ? nativeColors.iconBrown : nativeColors.grey},
          ]}
          resizeMode={'contain'}
          source={SettingsBottomNav}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  },
);

const AreaScreenStack = createStackNavigator(
  {
    SpatialAreaSelectScreen: SpatialAreaSelectScreen,
    SelectFromListScreen: SelectFromListScreen,
    // Other screens go here
  },
  {
    navigationOptions: {
      tabBarIcon: ({focused}) => (
        <Image
          style={[
            styles.bottomImage,
            {tintColor: focused ? nativeColors.iconBrown : nativeColors.grey},
          ]}
          resizeMode={'contain'}
          source={HomeBottomNav}
        />
      ),
      defaultNavigationOptions: defaultNavOptions,
    },
  },
);

const ContextScreenStack = createStackNavigator(
  {
    ContextListScreen: ContextListScreen,
    ContextDetailScreen: ContextDetailScreen,
  },
  {
    navigationOptions: {
      tabBarIcon: ({focused}) => {
        return (
          <StateDependentTabIcon
            focused={focused}
            icon={ContextBottomNav}
            showState={[AppState.SELECTING_CONTEXT, AppState.CONTEXT_SCREEN]}
          />
        );
      },
      tabBarOnPress: ({defaultHandler}) => {
        if (
          [AppState.SELECTING_CONTEXT, AppState.CONTEXT_SCREEN].includes(
            getAppState(),
          )
        ) {
          return defaultHandler();
        }
        return null;
      },
    },
    defaultNavigationOptions: defaultNavOptions,
  },
);

const FindsBagPhotosScreenStack = createStackNavigator(
  {
    FindsBagPhotosScreen: FindsBagPhotosScreen,
    // Other screens go here
  },
  {
    navigationOptions: {
      tabBarIcon: ({focused}) => (
        <StateDependentTabIcon
          focused={focused}
          icon={FindBagPhotosBottomNav}
          showState={[AppState.CONTEXT_SCREEN]}
        />
      ),
      tabBarOnPress: ({defaultHandler}) => {
        if (getAppState() == AppState.CONTEXT_SCREEN) {
          return defaultHandler();
        }
        return null;
      },
    },
    defaultNavigationOptions: defaultNavOptions,
  },
);

export const LoginScreenNavigator = createStackNavigator(
  {
    LoginScreen: LoginScreen,
    SignupScreen: SignupScreen,
    DataLoadingComponent: DataLoadingComponent,
  },
  {
    headerMode: 'none',
  },
);

export const MainTabNavigator = createBottomTabNavigator(
  {
    AreaScreenStack: AreaScreenStack,
    ContextScreenStack: ContextScreenStack,
    FindsBagPhotosScreen: FindsBagPhotosScreenStack,
    SettingsScreenStack: SettingsScreenStack,
  },
  {
    initialRouteName: 'AreaScreenStack',
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
      },
    },
  },
);

const styles = StyleSheet.create({
  bottomImage: {
    height: verticalScale(40),
    width: verticalScale(40),
  },
});
