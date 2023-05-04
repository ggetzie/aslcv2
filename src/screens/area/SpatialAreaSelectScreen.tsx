import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {StackScreenProps} from '@react-navigation/stack';
import {verticalScale} from '../../constants/nativeFunctions';
import {RowView} from '../../components/general/RowView';
import {
  initSpatialArea,
  SpatialArea,
  SpatialAreaQuery,
} from '../../constants/EnumsAndInterfaces/SpatialAreaInterfaces';

import {
  setSelectedContextId,
  setSelectedSpatialAreaId,
} from '../../../redux/reducerAction';
import {UTMForm} from '../../components/UTMForm';
import {LoadingComponent} from '../../components/general/LoadingComponent';
import {getFilteredSpatialAreaIdsList} from '../../constants/backend_api_action';
import {ScreenColors} from '../../constants/EnumsAndInterfaces/AppState';
import {AreaStackParamList} from '../../../navigation';

type Props = StackScreenProps<AreaStackParamList, 'SpatialAreaSelectScreen'>;

const SpatialAreaSelectScreen = (props: Props) => {
  const dispatch = useDispatch();

  const selectedAreaId: string = useSelector(
    ({reducer}: any) => reducer.selectedSpatialAreaId,
  );
  const spatialAreaIdToSpatialAreaMap: Map<string, SpatialArea> = useSelector(
    ({reducer}: any) => reducer.spatialAreaIdToSpatialAreaMap,
  );

  const [form, setForm] = useState<SpatialAreaQuery>(initSpatialArea());
  const [spatialAreaIds, setSpacialAreaIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    selectArea(null);
  }, []);

  useEffect(() => {
    fetchSpatialAreaList();
  }, [form]);

  async function fetchSpatialAreaList() {
    try {
      selectArea(null);
      setLoading(true);
      const newSpatialAreaIds = await getFilteredSpatialAreaIdsList(form)(
        dispatch,
      );
      setSpacialAreaIds(newSpatialAreaIds);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  function selectArea(id: string) {
    dispatch(setSelectedContextId(null));
    dispatch(setSelectedSpatialAreaId(id));
  }

  useEffect(() => {
    if (
      spatialAreaIds &&
      spatialAreaIds.length === 1 &&
      spatialAreaIdToSpatialAreaMap.has(spatialAreaIds[0])
    ) {
      selectArea(spatialAreaIds[0]);
    }
  }, [spatialAreaIdToSpatialAreaMap, spatialAreaIds]);

  function renderAreaItem(id, index) {
    const area: SpatialArea = spatialAreaIdToSpatialAreaMap.get(id);

    if (area == null) {
      return <LoadingComponent />;
    }

    return (
      <View style={{padding: '5%'}}>
        <TouchableOpacity
          onPress={() => {
            if (selectedAreaId && selectedAreaId === area.id) {
              selectArea(null);
            } else {
              selectArea(area.id);
            }
          }}>
          <RowView>
            <Text style={{marginRight: verticalScale(20), width: '20%'}}>
              {`Area ${index + 1}:`}
            </Text>
            <Text style={{width: '60%'}}>
              {`${area.utm_hemisphere}, Zone: ${area.utm_zone}, Northing: ${area.area_utm_northing_meters}, Easting: ${area.area_utm_easting_meters}`}
            </Text>
            {/* TODO: Investigate Icon styling issue (gets cut-off)*/}
            <Icon
              style={styles.iconStyle}
              name="check"
              type="font-awesome"
              color={
                selectedAreaId && selectedAreaId === area.id
                  ? 'black'
                  : 'transparent'
              }
            />
          </RowView>
          <Divider />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.background}>
      <UTMForm
        form={form}
        setForm={setForm}
        navigation={props.navigation}
        availableSpatialAreaIds={spatialAreaIds}
      />
      {loading ? (
        <View style={{width: '100%', height: verticalScale(50)}}>
          <LoadingComponent containerStyle={{margin: 'auto'}} />
        </View>
      ) : spatialAreaIds.length === 0 ? (
        <Text style={{padding: '5%'}}>
          No Area available for current selection
        </Text>
      ) : spatialAreaIds.length > 1 ? (
        <FlatList
          style={{
            marginTop: verticalScale(5),
          }}
          data={spatialAreaIds}
          extraData={spatialAreaIdToSpatialAreaMap}
          renderItem={({item, index}) => renderAreaItem(item, index)}
        />
      ) : null}
      {selectedAreaId &&
        (spatialAreaIdToSpatialAreaMap.has(selectedAreaId) ? (
          <View style={{padding: '5%'}}>
            <Text
              style={{
                marginRight: verticalScale(20),
                width: '100%',
                fontSize: verticalScale(20),
                fontWeight: 'bold',
              }}>
              {`Selected Area`}
            </Text>
            <Text
              style={{
                width: '100%',
                paddingVertical: verticalScale(5),
              }}>
              {`${
                spatialAreaIdToSpatialAreaMap.get(selectedAreaId).utm_hemisphere
              }, Zone: ${
                spatialAreaIdToSpatialAreaMap.get(selectedAreaId).utm_zone
              }, Northing: ${
                spatialAreaIdToSpatialAreaMap.get(selectedAreaId)
                  .area_utm_northing_meters
              }, Easting: ${
                spatialAreaIdToSpatialAreaMap.get(selectedAreaId)
                  .area_utm_easting_meters
              }`}
            </Text>
          </View>
        ) : (
          <LoadingComponent />
        ))}
    </ScrollView>
  );
};

SpatialAreaSelectScreen.navigationOptions = (screenProps) => ({
  title: 'Spatial Area',
  headerLeft: () => null,
});

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    display: 'flex',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInputStyle: {
    width: '80%',
  },
  iconStyle: {
    alignSelf: 'center',
    width: verticalScale(25),
    height: verticalScale(25),
  },

  background: {
    backgroundColor: ScreenColors.SELECTING_AREA,
  },
});

export default SpatialAreaSelectScreen;
