import * as React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet} from 'react-native';
import {nativeColors} from '../../constants/colors';

export const LoadingModalComponent = ({
  showLoading,
}: {
  showLoading: boolean;
}) => {
  return (
    <Modal visible={showLoading} transparent={true}>
      <View style={styles.container}>
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
});
