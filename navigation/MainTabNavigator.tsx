import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import axios from 'axios';
import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {verticalScale} from '../src/constants/nativeFunctions';
import {nativeColors} from '../src/constants/colors';
import {
  ContextBottomNav,
  FindBagPhotosBottomNav,
  HomeBottomNav,
  LoginBottomNav,
  SettingsBottomNav,
} from '../src/constants/imageAssets';
import LoginScreen from '../src/screens/login_signup/LoginScreen';

import {AuthContext} from '.';
import {AslReducerState, HOSTS} from '../redux/reducer';
import {SET_USER_PROFILE, SET_HOST} from '../redux/reducerAction';
import {LoginDetails} from '../src/constants/EnumsAndInterfaces/UserDataInterfaces';
import {API_ENDPOINTS} from '../src/constants/endpoints';
import AreaNavigator from './AreaNavigator';
import ContextNavigator from './ContextNavigator';
import FindsNavigator from './FindsNavigator';
import SettingsNavigator from './SettingsNavigator';

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
  const areaSelected = useSelector(
    ({reducer}: {reducer: AslReducerState}) =>
      reducer.selectedSpatialArea !== null,
  );
  const contextSelected = useSelector(
    ({reducer}: {reducer: AslReducerState}) =>
      reducer.selectedSpatialContext !== null,
  );
  const canSubmitContext = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.canSubmitContext,
  );

  // check if we have saved user profile and host in async storage
  useEffect(() => {
    const bootstrapAsync = async () => {
      let authToken;
      let username;
      let host;
      try {
        authToken = await AsyncStorage.getItem('authToken');
        username = await AsyncStorage.getItem('username');
        host = await AsyncStorage.getItem('host');
        if (host !== null) {
          dispatch({type: SET_HOST, payload: host});
          axios.defaults.baseURL = HOSTS[host].baseURL;
        }
        if (authToken !== null && username !== null) {
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
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (loginDetails: LoginDetails): Promise<string> => {
        try {
          let response = await axios.post(API_ENDPOINTS.Login, loginDetails);
          const token = response.data.token;
          return token;
        } catch (error) {
          console.log(error);
          return '';
        }
      },
      signOut: async () => {
        console.log('handle signing out from server here');
        return 'signed out';
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
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
            {areaSelected && (
              <MainTab.Screen
                name="ContextNavigator"
                component={ContextNavigator}
                options={{headerShown: false}}
              />
            )}
            {contextSelected && !canSubmitContext && (
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
    </AuthContext.Provider>
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
