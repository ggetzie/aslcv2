import React from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {ButtonComponent} from './general/ButtonComponent';

const CameraModal = ({
  isVisible,
  onTakePhoto,
  onCancel,
}: {
  isVisible: boolean;
  onTakePhoto: () => void;
  onCancel: () => void;
}) => {
  return (
    <Modal style={{justifyContent: 'flex-end'}} isVisible={isVisible}>
      <ButtonComponent
        buttonStyle={styles.modalButtonStyle}
        textStyle={{fontWeight: 'bold'}}
        onPress={onTakePhoto}
        text="Take Photo"
        rounded={true}
      />
      <ButtonComponent
        buttonStyle={styles.cancelButtonStyle}
        textStyle={{color: 'black'}}
        onPress={onCancel}
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
