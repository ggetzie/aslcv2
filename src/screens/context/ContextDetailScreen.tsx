import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  FlatList,
  NavigationScreenComponent,
  ScrollView,
} from 'react-navigation';
import {
  Alert,
  Image,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Context} from '../../constants/EnumsAndInterfaces/ContextInterfaces';
import {horizontalScale, verticalScale} from '../../constants/nativeFunctions';
import {RowView} from '../../components/general/RowView';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  getContextAreaStringForSelectedContext,
  getDateFromISO,
  isNotEmptyOrNull,
  isNotEmptyOrNullBatch,
  renderDate,
} from '../../constants/utilityFunctions';
import {PaddingComponent} from '../../components/PaddingComponent';
import {Divider} from 'react-native-elements';
import {
  getContextTypes,
  updateContext,
  uploadContextImage,
} from '../../constants/backend_api';
import {LoadingModalComponent} from '../../components/general/LoadingModalComponent';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import ImagePicker, {
  ImagePickerOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import {isEqual} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {getContext} from '../../constants/backend_api_action';
import {TextInputComponent} from '../../components/general/TextInputComponent';
import moment from 'moment';
import {baseURL} from '../../constants/Axios';
import {HeaderBackButton} from 'react-navigation-stack';
import {
  setCanContestBeSubmitted,
  setSelectedContextId,
} from '../../../redux/reducerAction';

enum DatePickState {
  OPENING_DATE = 'OPENING_DATE',
  CLOSING_DATE = 'CLOSING_DATE',
  CLOSED = 'CLOSED',
}

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

const ContextDetailScreen: NavigationScreenComponent<any, any> = (props) => {
  const dispatch = useDispatch();

  const selectedContextId: string = useSelector(
    ({reducer}: any) => reducer.selectedContextId,
  );
  const contextIdToContextMap: Map<string, Context> = useSelector(
    ({reducer}: any) => reducer.contextIdToContextMap,
  );
  const canBeSubmitted: boolean = useSelector(
    ({reducer}: any) => reducer.canContextBeSubmitted,
  );

  const [datePickState, setDatePickState] = useState<DatePickState>(
    DatePickState.CLOSED,
  );
  const [imagePickStage, setImagePickStage] = useState<boolean>(false);

  const [form, setForm] = useState<Context>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [types, setTypes] = useState<string[]>(null);

  async function fetchData() {
    setLoading(true);
    await getContext(selectedContextId)(dispatch);
    setTypes(await getContextTypes());
    setLoading(false);
  }

  useEffect(() => {
    if (selectedContextId == null) {
      props.navigation.navigate('ContextListScreen');
    } else {
      fetchData();
    }
  }, [selectedContextId]);

  useEffect(() => {
    setForm(contextIdToContextMap.get(selectedContextId));
  }, [selectedContextId, contextIdToContextMap]);

  useEffect(() => {
    if (form == null) {
      dispatch(setCanContestBeSubmitted(false));
      return;
    }
    if (isNotEmptyOrNullBatch(form.closing_date, form.opening_date)) {
      const openingDate = moment(form.opening_date, 'YYYY-MM-DD');
      const closingDate = moment(form.closing_date, 'YYYY-MM-DD');
      const currentDate = moment(new Date(), 'YYYY-MM-DD');
      const diff1 = openingDate.diff(closingDate, 'days');
      const diff2 = openingDate.diff(currentDate, 'days');
      if (diff1 > 0) {
        alert('Closing Date should be greater than opening date');
        setForm({...form, opening_date: null, closing_date: null});
      }
      if (diff2 >= 7) {
        alert('Warning: Opening date is more than a week in the future!');
      }
    }
    const dbContext = contextIdToContextMap.get(selectedContextId);
    if (form && form.spatial_area != null) {
      delete form.spatial_area;
    }
    if (dbContext && dbContext.spatial_area != null) {
      delete dbContext.spatial_area;
    }
    if (!isEqual(form, dbContext)) {
      if (
        isNotEmptyOrNull(form.closing_date) &&
        !isNotEmptyOrNull(form.opening_date)
      ) {
        dispatch(setCanContestBeSubmitted(false));
      } else {
        dispatch(setCanContestBeSubmitted(true));
      }
    } else {
      dispatch(setCanContestBeSubmitted(false));
    }
  }, [form, contextIdToContextMap]);

  useEffect(() => {
    props.navigation.addListener('beforeRemove', (e) => {
      if (!canBeSubmitted) {
        return;
      }
      e.preventDefault();
      Alert.alert(
        'Save Edits',
        'Are you sure you want to continue without saving?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              dispatch(setSelectedContextId(null));
              props.navigation.goBack();
            },
          },
        ],
        {cancelable: false},
      );
    });
  }, [props.navigation, canBeSubmitted]);

  async function updateData() {
    setLoading(true);
    try {
      await updateContext(form);
      await getContext(selectedContextId)(dispatch);
    } catch (e) {
      console.log(e);
      alert('Error Updating Context');
    }
    setLoading(false);
  }

  async function uploadImage(response) {
    setLoading(true);
    Alert.alert(
      'Image Upload',
      'Confirm Image Selection',
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
              await uploadContextImage(form, selectedContextId);
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

  return form == null ||
    selectedContextId == null ||
    contextIdToContextMap.get(selectedContextId) == null ? (
    <ScrollView />
  ) : (
    <ScrollView>
      <LoadingModalComponent showLoading={loading} />
      <Modal style={{justifyContent: 'flex-end'}} isVisible={imagePickStage}>
        <ButtonComponent
          buttonStyle={Styles.modalButtonStyle}
          textStyle={{fontWeight: 'bold'}}
          onPress={async () => {
            ImagePicker.launchImageLibrary(
              imagePickerOptions,
              async (response: ImagePickerResponse) => {
                setImagePickStage(false);
                if (response.didCancel) {
                } else if (response.error) {
                  alert('Error selecting Image');
                } else {
                  await uploadImage(response);
                }
              },
            );
          }}
          text="Select Photo"
          rounded={true}
        />
        <ButtonComponent
          buttonStyle={Styles.modalButtonStyle}
          textStyle={{fontWeight: 'bold'}}
          onPress={() => {
            ImagePicker.launchCamera(
              imagePickerOptions,
              async (response: ImagePickerResponse) => {
                if (response.didCancel) {
                  setImagePickStage(false);
                } else if (response.error) {
                  alert('Error selecting Image');
                } else {
                  await uploadImage(response);
                }
              },
            );
          }}
          text="Take Photo"
          rounded={true}
        />
        <ButtonComponent
          buttonStyle={Styles.cancelButtonStyle}
          textStyle={{color: 'black'}}
          onPress={() => setImagePickStage(false)}
          text="Close"
          rounded={true}
        />
      </Modal>
      <DateTimePickerModal
        isVisible={datePickState !== DatePickState.CLOSED}
        onConfirm={(date) => {
          setDatePickState(DatePickState.CLOSED);
          if (datePickState === DatePickState.OPENING_DATE) {
            setForm({
              ...form,
              opening_date: getDateFromISO(date.toISOString()),
            });
          } else if (datePickState === DatePickState.CLOSING_DATE) {
            setForm({
              ...form,
              closing_date: getDateFromISO(date.toISOString()),
            });
          }
        }}
        onCancel={() => setDatePickState(DatePickState.CLOSED)}
        date={
          datePickState === DatePickState.OPENING_DATE
            ? contextIdToContextMap.get(selectedContextId).opening_date == null
              ? new Date()
              : new Date(
                  contextIdToContextMap.get(selectedContextId).opening_date,
                )
            : contextIdToContextMap.get(selectedContextId).closing_date == null
            ? new Date()
            : new Date(
                contextIdToContextMap.get(selectedContextId).closing_date,
              )
        }
        mode="date"
      />
      <RowView style={{paddingTop: '2%', justifyContent: 'center'}}>
        <ButtonComponent
          buttonStyle={{
            width: '30%',
            height: 'auto',
            alignSelf: 'flex-end',
            margin: 'auto',
            marginHorizontal: '5%',
          }}
          onPress={() => fetchData()}
          textStyle={{padding: '4%'}}
          text={'Refresh'}
          rounded={true}
        />
      </RowView>
      <RowView>
        <Text
          style={{
            fontSize: verticalScale(20),
            fontWeight: 'bold',
            paddingHorizontal: '5%',
            paddingTop: '2%',
          }}>
          Context Details
        </Text>
        {canBeSubmitted && (
          <ButtonComponent
            buttonStyle={{
              width: '30%',
              height: 'auto',
              alignSelf: 'flex-end',
              marginHorizontal: '5%',
            }}
            onPress={() => updateData()}
            textStyle={{padding: '4%'}}
            text={'Update'}
            rounded={true}
          />
        )}
      </RowView>

      <View style={{paddingHorizontal: '5%', paddingVertical: '0%'}}>
        <RowView style={{paddingVertical: '0%'}}>
          <Text style={Styles.labelStyle}>Type</Text>

          <Picker
            style={Styles.inputStyle}
            selectedValue={form.type}
            onValueChange={(value: string, pos) =>
              setForm({...form, type: value})
            }>
            {types &&
              types
                .map((type) => <Picker.Item label={type} value={type} />)
                .concat(<Picker.Item label={'Select'} value={null} />)}
          </Picker>
        </RowView>
        <PaddingComponent vertical="2%" />
        <RowView>
          <TouchableOpacity
            onPress={() => setDatePickState(DatePickState.OPENING_DATE)}>
            <Text style={Styles.labelStyle}>Opening Date</Text>
            <Text>{renderDate(form.opening_date)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDatePickState(DatePickState.CLOSING_DATE)}>
            <Text style={Styles.labelStyle}>Closing Date</Text>
            <Text>{renderDate(form.closing_date)}</Text>
          </TouchableOpacity>
        </RowView>

        <PaddingComponent vertical="2%" />
        <Text style={Styles.labelStyle}>Description</Text>
        <TextInputComponent
          value={form.description}
          containerStyle={{width: '100%'}}
          onChangeText={(text) =>
            setForm({
              ...form,
              description: text,
            })
          }
          numeric={false}
          multiline={true}
          placeHolder="Brief Description of Context"
        />
        <Divider />
        <Divider />
        <ButtonComponent
          buttonStyle={{width: '35%', height: 'auto', alignSelf: 'center'}}
          onPress={() => setImagePickStage(true)}
          textStyle={{padding: '4%'}}
          text={'Add Photo'}
          rounded={true}
        />
        <PaddingComponent vertical="2%" />
        <RowView>
          <Text style={Styles.labelStyle}>Total Context Photos</Text>
          <Text>
            {form.contextphoto_set == null ? 0 : form.contextphoto_set.length}
          </Text>
        </RowView>
        <PaddingComponent vertical="2%" />
        {form.contextphoto_set && (
          <FlatList
            keyExtractor={(item) => item.thumbnail_url}
            data={form.contextphoto_set}
            renderItem={({item}) => (
              <Image
                style={Styles.imageStyle}
                resizeMode="cover"
                source={{uri: baseURL + item.thumbnail_url}}
              />
            )}
            numColumns={3}
          />
        )}
      </View>
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  labelStyle: {
    fontSize: verticalScale(16),
    color: 'black',
    width: 'auto',
  },
  inputStyle: {
    width: '50%',
  },
  iconStyle: {
    alignSelf: 'center',
    width: verticalScale(25),
    height: verticalScale(25),
  },
  imageStyle: {
    alignSelf: 'center',
    width: horizontalScale(100),
    height: horizontalScale(100),
    marginHorizontal: horizontalScale(5),
  },
  modalButtonStyle: {
    width: '60%',
  },
  cancelButtonStyle: {
    width: '60%',
    backgroundColor: 'white',
  },
});

ContextDetailScreen.navigationOptions = (screenProps) => ({
  title: 'Context: ' + getContextAreaStringForSelectedContext(),
  headerLeft: () => {
    const dispatch = useDispatch();
    const canBeSubmitted: boolean = useSelector(
      ({reducer}: any) => reducer.canContextBeSubmitted,
    );
    return (
      <HeaderBackButton
        onPress={() => {
          if (canBeSubmitted === true) {
            Alert.alert(
              'Save Edits',
              'Are you sure you want to continue without saving?',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: async () => {
                    dispatch(setSelectedContextId(null));
                    screenProps.navigation.goBack();
                  },
                },
              ],
              {cancelable: false},
            );
          } else {
            dispatch(setSelectedContextId(null));
            screenProps.navigation.goBack();
          }
        }}
      />
    );
  },
});

export default ContextDetailScreen;
