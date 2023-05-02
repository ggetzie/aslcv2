import React from 'react';
import {ButtonComponent} from './general/ButtonComponent';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import {StoredItems} from '../constants/StoredItem';
import {resetReducerData} from '../../redux/reducerAction';

interface Props {
  navigation: any;
}

export const LogoutButton: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  async function logoutUser() {
    await Promise.all(
      Object.values(StoredItems).map(async (key: string) => {
        await AsyncStorage.removeItem(key);
      }),
    );
    props.navigation.navigate('LoginScreen');
    dispatch(resetReducerData());
  }
  return (
    <ButtonComponent
      onPress={logoutUser}
      text={'Logout'}
      rounded={true}
      buttonStyle={{width: '30%'}}
    />
  );
};
