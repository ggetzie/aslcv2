import {StackScreenProps} from '@react-navigation/stack';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Divider} from 'react-native-elements';
import ImagePicker, {
  ImagePickerOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {PaddingComponent} from '../../components/PaddingComponent';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import {LoadingModalComponent} from '../../components/general/LoadingModalComponent';
import {RowView} from '../../components/general/RowView';
import {SpatialContext} from '../../constants/EnumsAndInterfaces/ContextInterfaces';
import {
  getContextTypes,
  updateContext,
  uploadContextPhoto,
  getContextDetail,
} from '../../constants/backend_api';
import {horizontalScale, verticalScale} from '../../constants/nativeFunctions';
import {
  getSpatialString,
  validateDates,
} from '../../constants/utilityFunctions';

import {
  SET_CAN_SUBMIT_CONTEXT,
  SET_SELECTED_SPATIAL_CONTEXT,
  setCanSubmitContext,
} from '../../../redux/reducerAction';

import {ContextStackParamList} from '../../../navigation';
import {AslReducerState} from '../../../redux/reducer';
import CameraModal from '../../components/CameraModal';
import ContextForm from '../../components/ContextForm';
import HeaderBack from '../../components/HeaderBack';
import PhotoGrid from '../../components/PhotoGrid';
import UploadProgressModal from '../../components/UploadProgressModal';
import {ScreenColors} from '../../constants/EnumsAndInterfaces/AppState';
import {defaultContextTypes} from '../../constants/EnumsAndInterfaces/ContextInterfaces';

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

type Props = StackScreenProps<ContextStackParamList, 'ContextDetailScreen'>;

const ContextDetailScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();

  const selectedContext = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedSpatialContext,
  );

  const selectedArea = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedSpatialArea,
  );

  const spatialString = getSpatialString(selectedArea, selectedContext);

  const canSubmit = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.canSubmitContext,
  );

  const [isPickingImage, setIsPickingImage] = useState<boolean>(false);

  // copy context from redux to local state for editing
  const [editingContext, setEditingContext] =
    useState<SpatialContext>(selectedContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [types, setTypes] = useState<string[]>(defaultContextTypes);
  const [uploadedPct, setUploadedPct] = useState<number>(0);
  const [showUploadProgress, setShowUploadProgress] = useState<boolean>(false);

  const tabNav = navigation.getParent();

  function refreshContext() {
    if (selectedContext === null) {
      return;
    }
    setLoading(true);
    getContextDetail(selectedContext.id)
      .then((spatialContext) => {
        dispatch({type: SET_SELECTED_SPATIAL_CONTEXT, payload: spatialContext});
        setEditingContext(spatialContext);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (selectedContext == null) {
      navigation.navigate('ContextListScreen');
    }
  }, [selectedContext]);

  useEffect(() => {
    // set title
    navigation.setOptions({
      title: spatialString,
      headerLeft: () => <HeaderBack navigation={navigation} />,
    });
  }, [navigation, spatialString]);

  useEffect(() => {
    // prevent leaving the screen if there are changes
    // @ts-ignore
    const unsubscribe = tabNav.addListener('tabPress', (e) => {
      if (canSubmit) {
        // @ts-ignore
        e.preventDefault();
      }
    });
    return unsubscribe;
  }, [tabNav, canSubmit]);

  useEffect(() => {
    // when editingContext changes, check if can submit
    if (editingContext == null) {
      dispatch(setCanSubmitContext(false));
      return;
    }
    const datesAreValid = validateDates(
      editingContext.opening_date,
      editingContext.closing_date,
    );

    // compare the local editing context to the selected context from redux
    const contextDataChanged =
      editingContext.description != selectedContext.description ||
      editingContext.type != selectedContext.type ||
      editingContext.opening_date != selectedContext.opening_date ||
      editingContext.closing_date != selectedContext.closing_date;

    const newCanSubmit = datesAreValid && contextDataChanged;
    dispatch(setCanSubmitContext(newCanSubmit));
  }, [editingContext]);

  function updateData() {
    setLoading(true);
    updateContext(editingContext)
      .then(() => {
        // after successful update, update redux
        dispatch({type: SET_SELECTED_SPATIAL_CONTEXT, payload: editingContext});
        dispatch({type: SET_CAN_SUBMIT_CONTEXT, payload: false});
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        alert('Error Updating Context');
        setLoading(false);
      });
  }

  async function uploadImage(imagePickerResponse) {
    Alert.alert(
      'Context Photo Upload',
      'Confirm',
      [
        {
          text: 'Cancel',
          onPress: () => setShowUploadProgress(false),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setShowUploadProgress(true);
            const form: FormData = new FormData();
            try {
              form.append('photo', {
                uri: imagePickerResponse.uri,
                type: imagePickerResponse.type,
                name: imagePickerResponse.fileName,
              } as any);
              await uploadContextPhoto(
                form,
                selectedContext.id,
                ({loaded, total}) =>
                  setUploadedPct(Math.round((loaded * 100) / total)),
              );
              setShowUploadProgress(false);
              setLoading(true);
              setTimeout(refreshContext, 3000);
            } catch (e) {
              alert('Failed to upload Image');
              setShowUploadProgress(false);
            }
          },
        },
      ],
      {cancelable: false},
    );
  }
  if (editingContext === null || selectedContext === null) {
    return (
      <ScrollView>
        <Text>No context selected</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.background}>
      <LoadingModalComponent
        showLoading={loading}
        message="Refreshing context data from server..."
      />
      <UploadProgressModal
        isVisible={showUploadProgress}
        progress={uploadedPct}
        message={`Uploading Context photo...`}
      />
      <CameraModal
        isVisible={isPickingImage}
        onTakePhoto={() => {
          ImagePicker.launchCamera(
            imagePickerOptions,
            async (response: ImagePickerResponse) => {
              if (response.didCancel) {
                setIsPickingImage(false);
              } else if (response.error) {
                alert('Error selecting Image');
                console.log(response.error);
              } else {
                await uploadImage(response);
                setIsPickingImage(false);
              }
            },
          );
        }}
        onCancel={() => setIsPickingImage(false)}
      />
      <RowView style={{paddingTop: '2%', justifyContent: 'center'}}>
        <ButtonComponent
          buttonStyle={styles.refreshButton}
          onPress={refreshContext}
          textStyle={{padding: '4%'}}
          text={'Refresh'}
          rounded={true}
        />
      </RowView>
      {/* Form title */}
      <RowView>
        <Text style={styles.title}>Context Details</Text>
      </RowView>

      <ContextForm
        openingDate={editingContext.opening_date}
        onOpeningDateChange={(date) =>
          setEditingContext({...editingContext, opening_date: date})
        }
        closingDate={editingContext.closing_date}
        onClosingDateChange={(date) =>
          setEditingContext({...editingContext, closing_date: date})
        }
        contextType={editingContext.type}
        onContextTypeChange={(type) =>
          setEditingContext({...editingContext, type: type})
        }
        contextTypes={types}
        description={editingContext.description}
        onDescriptionChange={(text) =>
          setEditingContext({...editingContext, description: text})
        }
        onReset={() => setEditingContext(selectedContext)}
        onSave={() => updateData()}
      />
      <Divider />
      <View style={{paddingHorizontal: 10}}>
        {/* Begin Photo section */}
        <ButtonComponent
          buttonStyle={{width: '35%', height: 'auto', alignSelf: 'center'}}
          onPress={() => setIsPickingImage(true)}
          textStyle={{padding: '4%'}}
          text={'Add Photo'}
          rounded={true}
        />
        <PaddingComponent vertical="2%" />
        <RowView>
          <Text style={styles.labelStyle}>Total Context Photos</Text>
          <Text>
            {editingContext.contextphoto_set == null
              ? 0
              : editingContext.contextphoto_set.length}
          </Text>
        </RowView>
        <PaddingComponent vertical="2%" />
        <PhotoGrid photoList={editingContext.contextphoto_set} columns={3} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: verticalScale(16),
    color: 'black',
    width: 'auto',
  },
  imageStyle: {
    alignSelf: 'center',
    width: horizontalScale(100),
    height: horizontalScale(100),
    marginHorizontal: horizontalScale(5),
    marginBottom: verticalScale(5),
  },
  background: {
    backgroundColor: ScreenColors.CONTEXT_SCREEN,
  },
  title: {
    fontSize: verticalScale(20),
    fontWeight: 'bold',
    paddingHorizontal: '5%',
    paddingTop: '2%',
  },
  refreshButton: {
    width: '30%',
    height: 'auto',
    alignSelf: 'flex-end',
    margin: 'auto',
    marginHorizontal: '5%',
  },
});

export default ContextDetailScreen;
