import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

import ImagePicker, {
  ImagePickerOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

import {ButtonComponent} from './general/ButtonComponent';
import {uploadImage} from '../util';

const imagePickerOptions: ImagePickerOptions = {
  title: 'Select Photo',
  mediaType: 'photo',
  cameraType: 'back',
  takePhotoButtonTitle: 'Take Photo',
  allowsEditing: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const CameraModal = ({isVisible, setVisible, setLoading, contextId}) => {
  return (
    <Modal style={{justifyContent: 'flex-end'}} isVisible={isVisible}>
      <ButtonComponent
        buttonStyle={styles.modalButtonStyle}
        textStyle={{fontWeight: 'bold'}}
        onPress={() => {
          ImagePicker.launchCamera(
            imagePickerOptions,
            async (response: ImagePickerResponse) => {
              if (response.didCancel) {
                setVisible(false);
              } else if (response.error) {
                alert('Error selecting Image');
              } else {
                await uploadImage(response, setLoading, contextId);
              }
            },
          );
        }}
        text="Take Photo"
        rounded={true}
      />
      <ButtonComponent
        buttonStyle={styles.cancelButtonStyle}
        textStyle={{color: 'black'}}
        onPress={() => setVisible(false)}
        text="Close"
        rounded={true}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalButtonStyle: {
    width: '60%',
  },
  cancelButtonStyle: {
    width: '60%',
    backgroundColor: 'white',
  },
});

export default CameraModal;
