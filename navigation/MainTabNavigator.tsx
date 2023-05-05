import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import {verticalScale} from '../src/constants/nativeFunctions';

import LoginScreen from '../src/screens/login_signup/LoginScreen';
import {nativeColors} from '../src/constants/colors';
import {
  ContextBottomNav,
  FindBagPhotosBottomNav,
  HomeBottomNav,
  SettingsBottomNav,
  LoginBottomNav,
} from '../src/constants/imageAssets';

import {AslReducerState} from '../redux/reducer';
import SettingsNavigator from './SettingsNavigator';
import AreaNavigator from './AreaNavigator';
import ContextNavigator from './ContextNavigator';
import FindsNavigator from './FindsNavigator';
import {LoadingComponent} from '../src/components/general/LoadingComponent';
import {SET_USER_PROFILE} from '../redux/reducerAction';
import { LoginDetails } from '../src/constants/EnumsAndInterfaces/UserDataInterfaces';
import { API_ENDPOINTS } from '../src/constants/endpoints';

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
  const dispatch = useDispatch();
  const isSignedIn = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.userProfile !== null,
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
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <LoadingComponent />;
  }

  // check if we have saved user profile in async storage
  useEffect(() => {
    const bootstrapAsync = async () => {
      let authToken;
      let username;
      let userId;
      try {
        authToken = await AsyncStorage.getItem('authToken');
        username = await AsyncStorage.getItem('username');
        if (authToken !== null && username !== null && userId !== null) {
          dispatch({
            type: SET_USER_PROFILE,
            payload: {authToken: authToken, username: username},
          });
        } else {
          dispatch({type: SET_USER_PROFILE, payload: null});
        }
      } catch (e) {
        console.log(e);
      }
    };
    setLoading(true);
    bootstrapAsync().then(() => setLoading(false));
  }, []);

  const authContext = React.useMemo(() => ({
    signIn: async (loginDetails: LoginDetails) => {
      try {
        setLoading(true);
        let response = await axios.post(API_ENDPOINTS.Login, loginDetails);
        const userProfile = {authToken: response.data.token, username: loginDetails.username};
        await AsyncStorage.setItem('authToken', userProfile.authToken);
        await AsyncStorage.setItem('username', userProfile.username);
        dispatch({type: SET_USER_PROFILE, payload: userProfile});
        return Promise.resolve();
      } catch (error) {
        console.log(error);
        return Promise.reject("Invalid Credentials!");
      }
  }
  
}), []
  )

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
