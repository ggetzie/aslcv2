import * as React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {nativeColors} from '../../constants/colors';

export const LoadingModalComponent = ({
  showLoading,
  message,
}: {
  showLoading: boolean;
  message?: string;
}) => {
  return (
    <Modal visible={showLoading} transparent={true}>
      <View style={styles.container}>
        {message && <Text style={styles.message}>{message}</Text>}
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
