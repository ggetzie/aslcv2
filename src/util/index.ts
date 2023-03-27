import {uploadContextImage} from '../constants/backend_api';
import {Alert} from 'react-native';

async function uploadImage(response, setLoading, contextId) {
  setLoading(true);
  Alert.alert(
    'Context Photo Upload',
    'Confirm',
    [
      {
        text: 'Cancel',
        onPress: () => setLoading(false),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          const form: FormData = new FormData();
          try {
            form.append('photo', {
              uri: response.uri,
              type: response.type,
              name: response.fileName,
            } as any);
            await uploadContextImage(form, contextId);
            setLoading(false);
          } catch (e) {
            alert('Failed to upload Image');
            setLoading(false);
          }
        },
      },
    ],
    {cancelable: false},
  );
}

export {uploadImage};
