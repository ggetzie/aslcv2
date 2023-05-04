import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Button,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SpatialContext} from '../../constants/EnumsAndInterfaces/ContextInterfaces';
import {uploadContextPhoto} from '../../constants/backend_api';
import {horizontalScale, verticalScale} from '../../constants/nativeFunctions';
import {RowView} from '../../components/general/RowView';
import {
  getContextAreaStringForSelectedContext,
  validateDates,
} from '../../constants/utilityFunctions';
import {PaddingComponent} from '../../components/PaddingComponent';
import {Divider} from 'react-native-elements';
import {getContextTypes, updateContext} from '../../constants/backend_api';
import {LoadingModalComponent} from '../../components/general/LoadingModalComponent';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import ImagePicker, {
  ImagePickerOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {getContext} from '../../constants/backend_api_action';
import {mediaBaseURL} from '../../constants/Axios';
import {setCanSubmitContext} from '../../../redux/reducerAction';

import {ScreenColors} from '../../constants/EnumsAndInterfaces/AppState';
import UploadProgressModal from '../../components/UploadProgressModal';
import CameraModal from '../../components/CameraModal';
import ContextForm from '../../components/ContextForm';
import {AslReducerState} from '../../../redux/reducer';
import {defaultContextTypes} from '../../constants/EnumsAndInterfaces/ContextInterfaces';
import {ContextStackParamList} from '../../../navigation';
import HeaderBack from '../../components/HeaderBack';

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

  const selectedContextId: string = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedContextId,
  );
  const contextIdToContextMap: Map<string, SpatialContext> = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.contextIdToContextMap,
  );

  const canSubmit = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.canSubmitContext,
  );

  const [isPickingImage, setIsPickingImage] = useState<boolean>(false);
  const [spatialContext, setSpatialContext] = useState<SpatialContext>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [types, setTypes] = useState<string[]>(defaultContextTypes);
  const [uploadedPct, setUploadedPct] = useState<number>(0);
  const [showUploadProgress, setShowUploadProgress] = useState<boolean>(false);
  const tabNav = navigation.getParent();

  async function fetchData() {
    setLoading(true);
    await getContext(selectedContextId)(dispatch);
    setTypes(await getContextTypes());
    setLoading(false);
  }

  useEffect(() => {
    if (selectedContextId == null) {
      navigation.navigate('ContextListScreen');
    } else {
      fetchData();
    }
  }, [selectedContextId]);

  useEffect(() => {
    navigation.setOptions({
      title: getContextAreaStringForSelectedContext(),
      headerLeft: () => <HeaderBack navigation={navigation} />,
    });
  }, [navigation]);

  useEffect(() => {
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
    setSpatialContext(contextIdToContextMap.get(selectedContextId));
  }, [selectedContextId, contextIdToContextMap]);

  useEffect(() => {
    // when spatialContext changes, check if can submit
    if (spatialContext == null) {
      dispatch(setCanSubmitContext(false));
      return;
    }
    const datesAreValid = validateDates(
      spatialContext.opening_date,
      spatialContext.closing_date,
    );

    const oldContext = contextIdToContextMap.get(selectedContextId);
    const contextDataChanged =
      spatialContext.description != oldContext.description ||
      spatialContext.type != oldContext.type ||
      spatialContext.opening_date != oldContext.opening_date ||
      spatialContext.closing_date != oldContext.closing_date;

    const newCanSubmit = datesAreValid && contextDataChanged;
    dispatch(setCanSubmitContext(newCanSubmit));
  }, [spatialContext, contextIdToContextMap]);

  async function updateData() {
    setLoading(true);
    try {
      await updateContext(spatialContext);
      await getContext(selectedContextId)(dispatch);
    } catch (e) {
      console.log(e);
      alert('Error Updating Context');
    }
    setLoading(false);
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
                selectedContextId,
                ({loaded, total}) =>
                  setUploadedPct(Math.round((loaded * 100) / total)),
              );
              setShowUploadProgress(false);
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

  return spatialContext == null ||
    selectedContextId == null ||
    contextIdToContextMap.get(selectedContextId) == null ? (
    <ScrollView />
  ) : (
    <ScrollView style={styles.background}>
      <LoadingModalComponent showLoading={loading} />
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
              } else {
                await uploadImage(response);
              }
            },
          );
        }}
        onCancel={() => setIsPickingImage(false)}
      />
      <RowView style={{paddingTop: '2%', justifyContent: 'center'}}>
        <ButtonComponent
          buttonStyle={styles.refreshButton}
          onPress={() => fetchData()}
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
        openingDate={spatialContext.opening_date}
        onOpeningDateChange={(date) =>
          setSpatialContext({...spatialContext, opening_date: date})
        }
        closingDate={spatialContext.closing_date}
        onClosingDateChange={(date) =>
          setSpatialContext({...spatialContext, closing_date: date})
        }
        contextType={spatialContext.type}
        onContextTypeChange={(type) =>
          setSpatialContext({...spatialContext, type: type})
        }
        contextTypes={types}
        description={spatialContext.description}
        onDescriptionChange={(text) =>
          setSpatialContext({...spatialContext, description: text})
        }
        onSave={() => updateData()}
      />
      <Divider />
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
            {spatialContext.contextphoto_set == null
              ? 0
              : spatialContext.contextphoto_set.length}
          </Text>
        </RowView>
        <PaddingComponent vertical="2%" />
        {spatialContext.contextphoto_set && (
          <FlatList
            keyExtractor={(item) => item.thumbnail_url}
            data={spatialContext.contextphoto_set}
            renderItem={({item}) => (
              <Image
                style={styles.imageStyle}
                resizeMode="cover"
                source={{uri: mediaBaseURL + item.thumbnail_url}}
              />
            )}
            numColumns={3}
          />
        )}
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
