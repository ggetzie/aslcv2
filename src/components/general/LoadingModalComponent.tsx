import * as React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {nativeColors} from '../../constants/colors';

// collect all possible loading messages in one place
const LOADING_MESSAGES = {
  hidden: '',
  refreshingContext: 'Refreshing context data from server...',
  savingContext: 'Saving context changes...',
  loggingIn: 'Logging in...',
  loggingOut: 'Logging out...',
};

export type LoadingMessage = keyof typeof LOADING_MESSAGES;

const LoadingModalComponent = ({message}: {message: LoadingMessage}) => {
  return (
    <Modal visible={message !== 'hidden'} transparent={true}>
      <View style={styles.container}>
        <Text style={styles.message}>{LOADING_MESSAGES[message]}</Text>
        <ActivityIndicator color={nativeColors.lightBrown} size="large" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff77',
  },
  message: {
    fontSize: 20,
    marginBottom: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
});

export {LOADING_MESSAGES};
export default LoadingModalComponent;
