import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import axios from 'axios';
import {View, StyleSheet, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useSelector, useDispatch} from 'react-redux';

import {HOSTS} from '../../redux/reducer';
import {getDomain} from '../constants/utilityFunctions';
import {AslReducerState} from '../../redux/reducer';
import {SET_HOST} from '../../redux/reducerAction';

const HostPicker = () => {
  const dispatch = useDispatch();
  const currentHost = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.host,
  );
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Server</Text>
      <Picker
        style={{minWidth: 270}}
        selectedValue={currentHost}
        onValueChange={async (newHost) => {
          axios.defaults.baseURL = HOSTS[newHost].baseURL;
          dispatch({type: SET_HOST, payload: newHost});
          await AsyncStorage.setItem('host', newHost);
        }}>
        {Object.keys(HOSTS).map((host) => (
          <Picker.Item
            label={host + ': ' + getDomain(HOSTS[host].baseURL)}
            value={host}
            key={host}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 16,
  },
});

export default HostPicker;
