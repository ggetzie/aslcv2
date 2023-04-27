import React from 'react';
import {Alert} from 'react-native';

const ConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Yes', onPress: onConfirm},
    ],
    {cancelable: false},
  );
};

export default ConfirmAlert;
