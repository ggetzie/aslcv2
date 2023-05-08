import React, {useState, useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import createStore from './redux/store';
import {getJwtFromAsyncStorage} from './src/constants/utilityFunctions';
import {LoadingComponent} from './src/components/general/LoadingComponent';
import {MainTabNavigator} from './navigation/MainTabNavigator';

const App = () => {
  return (
    <Provider store={createStore}>
      {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
