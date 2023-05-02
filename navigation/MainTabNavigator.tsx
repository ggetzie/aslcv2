import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
import {AslReducerState} from '../redux/reducer';

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

const SettingsStack = createStackNavigator();
export type SettingsStackParamList = {
  SettingsScreen: undefined;
};

const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
    </SettingsStack.Navigator>
  );
};

// const SettingsScreenStack = createStackNavigator(
//   {
//     SettingsScreen: SettingsScreen,
//     // Other screens go here
//   },
//   {
//     navigationOptions: {
//       tabBarIcon: ({focused}) => (
//         <Image
//           style={[
//             styles.bottomImage,
//             {tintColor: focused ? nativeColors.iconBrown : nativeColors.grey},
//           ]}
//           resizeMode={'contain'}
//           source={SettingsBottomNav}
//         />
//       ),
//     },
//     defaultNavigationOptions: defaultNavOptions,
//   },
// );

const AreaStack = createStackNavigator();

export type AreaStackParamList = {
  SpatialAreaSelectScreen: undefined;
  SelectFromListScreen: undefined;
};

const AreaNavigator = () => {
  return (
    <AreaStack.Navigator>
      <AreaStack.Screen
        name="SpatialAreaSelectScreen"
        component={SpatialAreaSelectScreen}
      />
      <AreaStack.Screen
        name="SelectFromListScreen"
        component={SelectFromListScreen}
      />
    </AreaStack.Navigator>
  );
};

// const AreaScreenStack = createStackNavigator(
//   {
//     SpatialAreaSelectScreen: SpatialAreaSelectScreen,
//     SelectFromListScreen: SelectFromListScreen,
//     // Other screens go here
//   },
//   {
//     navigationOptions: {
//       tabBarIcon: ({focused}) => (
//         <Image
//           style={[
//             styles.bottomImage,
//             {tintColor: focused ? nativeColors.iconBrown : nativeColors.grey},
//           ]}
//           resizeMode={'contain'}
//           source={HomeBottomNav}
//         />
//       ),
//       defaultNavigationOptions: defaultNavOptions,
//     },
//   },
// );

const ContextStack = createStackNavigator();

export type ContextStackParamList = {
  ContextListScreen: undefined;
  ContextDetailScreen: undefined;
};

const ContextNavigator = () => {
  return (
    <ContextStack.Navigator>
      <ContextStack.Screen
        name="ContextListScreen"
        component={ContextListScreen}
      />
      <ContextStack.Screen
        name="ContextDetailScreen"
        component={ContextDetailScreen}
      />
    </ContextStack.Navigator>
  );
};

// const ContextScreenStack = createStackNavigator(
//   {
//     ContextListScreen: ContextListScreen,
//     ContextDetailScreen: ContextDetailScreen,
//   },
//   {
//     navigationOptions: {
//       tabBarIcon: ({focused}) => {
//         return (
//           <StateDependentTabIcon
//             focused={focused}
//             icon={ContextBottomNav}
//             showState={[AppState.SELECTING_CONTEXT, AppState.CONTEXT_SCREEN]}
//           />
//         );
//       },
//       tabBarOnPress: ({defaultHandler}) => {
//         if (
//           [AppState.SELECTING_CONTEXT, AppState.CONTEXT_SCREEN].includes(
//             getAppState(),
//           )
//         ) {
//           return defaultHandler();
//         }
//         return null;
//       },
//     },
//     defaultNavigationOptions: defaultNavOptions,
//   },
// );
const FindsStack = createStackNavigator();
export type FindsStackParamList = {
  FindsBagPhotosScreen: undefined;
};

const FindsNavigator = () => {
  return (
    <FindsStack.Navigator>
      <FindsStack.Screen
        name="FindsBagPhotosScreen"
        component={FindsBagPhotosScreen}
      />
    </FindsStack.Navigator>
  );
};
// const FindsBagPhotosScreenStack = createStackNavigator(
//   {
//     FindsBagPhotosScreen: FindsBagPhotosScreen,
//     // Other screens go here
//   },
//   {
//     navigationOptions: {
//       tabBarIcon: ({focused}) => (
//         <StateDependentTabIcon
//           focused={focused}
//           icon={FindBagPhotosBottomNav}
//           showState={[AppState.CONTEXT_SCREEN]}
//         />
//       ),
//       tabBarOnPress: ({defaultHandler}) => {
//         if (getAppState() == AppState.CONTEXT_SCREEN) {
//           return defaultHandler();
//         }
//         return null;
//       },
//     },
//     defaultNavigationOptions: defaultNavOptions,
//   },
// );

// export const LoginScreenNavigator = createStackNavigator(
//   {
//     LoginScreen: LoginScreen,
//     SignupScreen: SignupScreen,
//     DataLoadingComponent: DataLoadingComponent,
//   },
//   {
//     headerMode: 'none',
//   },
// );

const MainTab = createBottomTabNavigator();

export type MainTabParamList = {
  AreaNavigator: undefined;
  ContextNavigator: undefined;
  FindsNavigator: undefined;
  SettingsNavigator: undefined;
  Login: undefined;
};

export const MainTabNavigator = () => {
  const isSignedIn = useSelector((state: AslReducerState) => state.isSignedIn);
  const selectedArea = useSelector(
    (state: AslReducerState) => state.selectedSpatialAreaId,
  );
  const selectedContext = useSelector(
    (state: AslReducerState) => state.selectedContextId,
  );
  return (
    <MainTab.Navigator
      initialRouteName={isSignedIn ? 'AreaNavigator' : 'Login'}
      tabBarOptions={{
        showLabel: false,
        style: styles.tabBar,
      }}>
      {isSignedIn ? (
        <>
          <MainTab.Screen name="AreaNavigator" component={AreaNavigator} />
          {selectedArea !== null && (
            <MainTab.Screen
              name="ContextNavigator"
              component={ContextNavigator}
            />
          )}
          {selectedContext !== null && (
            <MainTab.Screen name="FindsNavigator" component={FindsNavigator} />
          )}
          <MainTab.Screen
            name="SettingsNavigator"
            component={SettingsNavigator}
          />
        </>
      ) : (
        <MainTab.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
      )}
    </MainTab.Navigator>
  );
};
// export const MainTabNavigator = createBottomTabNavigator(
//   {
//     AreaScreenStack: AreaScreenStack,
//     ContextScreenStack: ContextScreenStack,
//     FindsBagPhotosScreen: FindsBagPhotosScreenStack,
//     SettingsScreenStack: SettingsScreenStack,
//   },
//   {
//     initialRouteName: 'AreaScreenStack',
//     tabBarOptions: {
//       showLabel: false,
//       style: {
//         backgroundColor: 'white',
//         elevation: 0,
//         shadowOpacity: 0,
//         borderTopWidth: 0,
//       },
//     },
//   },
// );

const styles = StyleSheet.create({
  bottomImage: {
    height: verticalScale(40),
    width: verticalScale(40),
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
  },
});
