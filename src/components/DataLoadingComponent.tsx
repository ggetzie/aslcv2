import * as React from 'react';
import {useEffect} from 'react';
import {LoadingComponent} from './general/LoadingComponent';
import {useDispatch} from 'react-redux';
import {getJwtFromAsyncStorage} from '../constants/utilityFunctions';

if (typeof TextEncoder !== 'function') {
  const TextEncodingPolyfill = require('text-encoding');
  TextEncoder = TextEncodingPolyfill.TextEncoder;
  TextDecoder = TextEncodingPolyfill.TextDecoder;
}

// TODO: Investigate typescript error
// @ts-ignore
const DataLoadingComponent = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token: string = await getJwtFromAsyncStorage();
        if (token != null && token.trim().length !== 0) {
          props.navigation.navigate('AreaScreenStack');
        } else {
          throw new Error('Not Logged in');
        }
        //TODO: Implement Logic to verify correctness of existing token
        //
        // await dispatch(refreshJwtToken());
      } catch (error) {
        props.navigation.navigate('LoginScreen');
        return;
      }
    };
    fetchData();
  }, []);

  return <LoadingComponent />;
};

DataLoadingComponent.navigationOptions = (screenProps) => ({
  title: '',
  headerLeft: () => null,
});

export default DataLoadingComponent;
