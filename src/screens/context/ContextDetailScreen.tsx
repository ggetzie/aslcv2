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
import LoadingModalComponent, {
  LoadingMessage,
} from '../../components/general/LoadingModalComponent';
import {RowView} from '../../components/general/RowView';
import {
  SpatialContext,
  defaultContextTypes,
} from '../../constants/EnumsAndInterfaces/ContextInterfaces';
import {
  getContextDetail,
  getContextTypes,
  updateContext,
  uploadContextPhoto,
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

  // copy mutable context data from redux to local state for editing
  const [openingDate, setOpeningDate] = useState<string | null>(
    selectedContext !== null ? selectedContext.opening_date : null,
  );
  const [closingDate, setClosingDate] = useState<string | null>(
    selectedContext !== null ? selectedContext.closing_date : null,
  );
  const [contextType, setContextType] = useState<string>(
    selectedContext !== null ? selectedContext.type : defaultContextTypes[0],
  );
  const [description, setDescription] = useState<string>(
    selectedContext !== null ? selectedContext.description : '',
  );

  const [loadingMessage, setLoadingMessage] =
    useState<LoadingMessage>('hidden');
  const [uploadedPct, setUploadedPct] = useState<number>(0);
  const [showUploadProgress, setShowUploadProgress] = useState<boolean>(false);

  const tabNav = navigation.getParent();

  function setMutableContext(spatialContext: SpatialContext) {
    setOpeningDate(spatialContext.opening_date);
    setClosingDate(spatialContext.closing_date);
    setContextType(spatialContext.type);
    setDescription(spatialContext.description);
  }

  function refreshContext() {
    if (selectedContext === null) {
      return;
    }
    setLoadingMessage('refreshingContext');
    getContextDetail(selectedContext.id)
      .then((spatialContext) => {
        dispatch({type: SET_SELECTED_SPATIAL_CONTEXT, payload: spatialContext});
        setMutableContext(spatialContext);
        setLoadingMessage('hidden');
      })
      .catch((error) => {
        console.log(error);
        setLoadingMessage('hidden');
      });
  }

  useEffect(() => {
    // update context types on first load
    getContextTypes()
      .then((newContextTypes) => {
        console.log('got new context types: ', newContextTypes);
        dispatch({type: 'SET_CONTEXT_TYPES', payload: newContextTypes});
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
    if (selectedContext == null) {
      dispatch(setCanSubmitContext(false));
      return;
    }
    const datesAreValid = validateDates(openingDate, closingDate);

    // compare the local editing context to the selected context from redux
    const contextDataChanged =
      description != selectedContext.description ||
      contextType != selectedContext.type ||
      openingDate != selectedContext.opening_date ||
      closingDate != selectedContext.closing_date;

    const newCanSubmit = datesAreValid && contextDataChanged;
    dispatch(setCanSubmitContext(newCanSubmit));
  }, [description, contextType, openingDate, closingDate, selectedContext]);

  function updateData() {
    setLoadingMessage('savingContext');
    const newContext = {
      ...selectedContext,
      description: description,
      type: contextType,
      opening_date: openingDate,
      closing_date: closingDate,
    };
    updateContext(newContext)
      .then(() => {
        // after successful update, update redux
        dispatch({type: SET_SELECTED_SPATIAL_CONTEXT, payload: newContext});
        dispatch({type: SET_CAN_SUBMIT_CONTEXT, payload: false});
        setLoadingMessage('hidden');
      })
      .catch((e) => {
        console.log(e);
        alert('Error Updating Context');
        setLoadingMessage('hidden');
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
              setLoadingMessage('refreshingContext');
              setTimeout(refreshContext, 3000);
            } catch (e) {
              alert('Failed to upload Image');
              setShowUploadProgress(false);
              setLoadingMessage('hidden');
            }
          },
        },
      ],
      {cancelable: false},
    );
  }
  if (selectedContext === null) {
    return (
      <ScrollView>
        <Text>No context selected</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.background}>
      <LoadingModalComponent message={loadingMessage} />
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
        openingDate={openingDate}
        onOpeningDateChange={(date) => setOpeningDate(date)}
        closingDate={closingDate}
        onClosingDateChange={(date) => setClosingDate(date)}
        contextType={contextType}
        onContextTypeChange={(cType) => setContextType(cType)}
        description={description}
        onDescriptionChange={(text) => setDescription(text)}
        onReset={() => {
          setDescription(selectedContext.description);
          setContextType(selectedContext.type);
          setOpeningDate(selectedContext.opening_date);
          setClosingDate(selectedContext.closing_date);
        }}
        onSave={updateData}
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
            {selectedContext.contextphoto_set == null
              ? 0
              : selectedContext.contextphoto_set.length}
          </Text>
        </RowView>
        <PaddingComponent vertical="2%" />
        <PhotoGrid photoList={selectedContext.contextphoto_set} columns={3} />
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
