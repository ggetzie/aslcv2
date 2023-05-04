import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
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

const getTabOptions = ({route}) => ({
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

    return (
      <View style={[styles.tabIconContainer, focused ? styles.focused : {}]}>
        <Image source={icon} resizeMode="contain" style={styles.tabIcon} />
      </View>
    );
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

  const canSubmitContext = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.canSubmitContext,
  );

  return (
    <MainTab.Navigator screenOptions={getTabOptions}>
      {isSignedIn ? (
        <>
          {!canSubmitContext && (
            <MainTab.Screen
              name="AreaNavigator"
              component={AreaNavigator}
              options={{headerShown: false, tabBarHideOnKeyboard: true}}
            />
          )}
          {selectedArea !== null && (
            <MainTab.Screen
              name="ContextNavigator"
              component={ContextNavigator}
              options={{headerShown: false}}
            />
          )}
          {selectedContext !== null && !canSubmitContext && (
            <MainTab.Screen
              name="FindsNavigator"
              component={FindsNavigator}
              options={{headerShown: false}}
            />
          )}
          {!canSubmitContext && (
            <MainTab.Screen
              name="SettingsNavigator"
              component={SettingsNavigator}
              options={{headerShown: false}}
            />
          )}
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

const styles = StyleSheet.create({
  tabIcon: {
    height: verticalScale(35),
    width: verticalScale(35),
  },
  tabIconContainer: {
    padding: 5,
    borderRadius: 5,
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
  },
  focused: {
    backgroundColor: nativeColors.highlight,
  },
});
