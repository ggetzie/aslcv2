import React from 'react';
import {Modal, ActivityIndicator, View, Text, StyleSheet} from 'react-native';

import {ProgressBar} from '@react-native-community/progress-bar-android';

const UploadProgressModal = ({isVisible, progress, message}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          {progress !== 100 ? (
            <>
              <Text style={styles.progressText}>
                {message} {progress}%
              </Text>
              <ProgressBar
                styleAttr="Horizontal"
                style={{width: 200}}
                progress={progress / 100}
                indeterminate={false}
              />
            </>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default UploadProgressModal;
