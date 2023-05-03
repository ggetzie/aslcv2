import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {verticalScale} from '../src/constants/nativeFunctions';

import LoginScreen from '../src/screens/login_signup/LoginScreen';
import SettingsScreen from '../src/screens/settings/SettingsScreen';
import {nativeColors} from '../src/constants/colors';
import {
  ContextBottomNav,
  FindBagPhotosBottomNav,
  HomeBottomNav,
  SettingsBottomNav,
  LoginBottomNav,
} from '../src/constants/imageAssets';

import {StateDependentTabIcon} from '../src/components/StateDependentTabIcon';
import {
  AppState,
  getAppState,
} from '../src/constants/EnumsAndInterfaces/AppState';
import {AslReducerState} from '../redux/reducer';
import SettingsNavigator from './SettingsNavigator';
import AreaNavigator from './AreaNavigator';
import ContextNavigator from './ContextNavigator';
import FindsNavigator from './FindsNavigator';

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

const getTabIcon = ({route}) => ({
  tabBarIcon: ({focused, color, size}) => {
    let icon;
    if (route.name === 'Login') {
      icon = LoginBottomNav;
    } else if (route.name === 'AreaNavigator') {
      icon = HomeBottomNav;
    } else if (route.name === 'ContextNavigator') {
      icon = ContextBottomNav;
    } else if (route.name === 'FindsNavigator') {
      icon = FindBagPhotosBottomNav;
    } else if (route.name === 'SettingsNavigator') {
      icon = SettingsBottomNav;
    }
    return <Image source={icon} style={styles.bottomImage} />;
  },
  tabBarActiveTintColor: nativeColors.iconBrown,
  tabBarInactiveTintColor: nativeColors.grey,
  tabBarShowLabel: false,
});

const MainTab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  const isSignedIn = useSelector(
    ({reducer}: {reducer: AslReducerState}) =>
      reducer.userProfileWithCredentials !== null,
  );
  const selectedArea = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedSpatialAreaId,
  );
  const selectedContext = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedContextId,
  );

  return (
    <MainTab.Navigator screenOptions={getTabIcon}>
      {isSignedIn ? (
        <>
          <MainTab.Screen
            name="AreaNavigator"
            component={AreaNavigator}
            options={{headerShown: false}}
          />
          {selectedArea !== null && (
            <MainTab.Screen
              name="ContextNavigator"
              component={ContextNavigator}
              options={{headerShown: false}}
            />
          )}
          {selectedContext !== null && (
            <MainTab.Screen
              name="FindsNavigator"
              component={FindsNavigator}
              options={{headerShown: false}}
            />
          )}
          <MainTab.Screen
            name="SettingsNavigator"
            component={SettingsNavigator}
            options={{headerShown: false}}
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
