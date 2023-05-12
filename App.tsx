import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import createStore from './redux/store';
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
