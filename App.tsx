import React, {useState, useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import createStore from './redux/store';
import {getJwtFromAsyncStorage} from './src/constants/utilityFunctions';
import {LoadingComponent} from './src/components/general/LoadingComponent';
import {MainTabNavigator} from './navigation/MainTabNavigator';
import {setIsSignedIn} from './redux/reducerAction';

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const setToken = async () => {
    console.disableYellowBox = true;
    const token: string = await getJwtFromAsyncStorage();
    if (token != null && token.trim().length !== 0) {
      try {
        setIsSignedIn(true);
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    }
  };

  useEffect(() => {
    setToken();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

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
