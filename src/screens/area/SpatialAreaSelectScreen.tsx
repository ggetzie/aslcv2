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
  UTM_Hemisphere,
} from '../../constants/EnumsAndInterfaces/SpatialAreaInterfaces';

import {
  setSelectedContextId,
  setSelectedSpatialAreaId,
} from '../../../redux/reducerAction';
import {UTMForm} from '../../components/UTMForm';
import {LoadingComponent} from '../../components/general/LoadingComponent';
import {getFilteredSpatialAreasList} from '../../constants/backend_api';
import {ScreenColors} from '../../constants/EnumsAndInterfaces/AppState';
import {AreaStackParamList} from '../../../navigation';
import {AslReducerState} from '../../../redux/reducer';
import {LoadingModalComponent} from '../../components/general/LoadingModalComponent';
import SpatialAreaCell from '../../components/SpatialAreaCell';
import {ButtonComponent} from '../../components/general/ButtonComponent';

type Props = StackScreenProps<AreaStackParamList, 'SpatialAreaSelectScreen'>;

function getZones(areas: SpatialArea[]) {
  const uniqueZones = new Set(areas.map((a) => a.utm_zone));
  return Array.from(uniqueZones).sort((a, b) => a - b);
}

function getEastings(areas: SpatialArea[]) {
  const uniqueEastings = new Set(areas.map((a) => a.area_utm_easting_meters));
  return Array.from(uniqueEastings).sort((a, b) => a - b);
}

function getNorthings(areas: SpatialArea[]) {
  const uniqueNorthings = new Set(areas.map((a) => a.area_utm_northing_meters));
  return Array.from(uniqueNorthings).sort((a, b) => a - b);
}

const SpatialAreaList = ({
  areas,
  onPress,
}: {
  areas: SpatialArea[];
  onPress: (id: string) => void;
}) => {
  return (
    <>
      {areas.map((area, index) => (
        <SpatialAreaCell
          key={area.id}
          area={area}
          index={index}
          onPress={onPress}
        />
      ))}
    </>
  );
};

const matchArea = (
  area: SpatialArea,
  hemisphere: UTM_Hemisphere,
  zone: number | null,
  easting: number | null,
  northing: number | null,
) => {
  return (
    area.utm_hemisphere === hemisphere &&
    (area.utm_zone === zone || !zone) &&
    (area.area_utm_easting_meters === easting || !easting) &&
    (area.area_utm_northing_meters === northing || !northing)
  );
};

const SpatialAreaSelectScreen = (props: Props) => {
  const dispatch = useDispatch();
  const [hemisphere, setHemisphere] = useState<UTM_Hemisphere>('N');
  const hemisphereList = ['N', 'S'];
  const [zone, setZone] = useState<number>(38);
  const [zoneList, setZoneList] = useState<number[]>([38]);
  const [easting, setEasting] = useState<number | null>(null);
  const [eastingList, setEastingList] = useState<number[]>([]);
  const [northing, setNorthing] = useState<number | null>(null);
  const [northingList, setNorthingList] = useState<number[]>([]);
  const [spatialAreaList, setSpatialAreaList] = useState<SpatialArea[]>([]);

  const selectedAreaId: string = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedSpatialAreaId,
  );
  const [loading, setLoading] = useState<boolean>(false);

  async function updateSpatialAreas() {
    try {
      const newSpatialAreas = await getFilteredSpatialAreasList({
        utm_hemisphere: hemisphere,
        utm_zone: zone,
        area_utm_easting_meters: easting,
        area_utm_northing_meters: northing,
      });
      return Promise.resolve(newSpatialAreas);
    } catch (e) {
      console.log(e);
      Promise.reject();
    }
  }

  useEffect(() => {
    selectArea(null);
  }, []);

  useEffect(() => {
    setLoading(true);
    updateSpatialAreas().then((newSpatialAreas) => {
      setSpatialAreaList(newSpatialAreas);
      setEastingList(getEastings(newSpatialAreas));
      setNorthingList(getNorthings(newSpatialAreas));
      setLoading(false);
    });
  }, []);

  function selectArea(id: string) {
    dispatch(setSelectedContextId(null));
    dispatch(setSelectedSpatialAreaId(id));
  }

  return (
    <ScrollView style={styles.background}>
      <LoadingModalComponent showLoading={loading} />
      <UTMForm
        hemisphere={hemisphere}
        onHemisphereChange={(h) => {
          setHemisphere(h);
          setZone(null);
          setZoneList(
            getZones(
              spatialAreaList.filter((area) => area.utm_hemisphere === h),
            ),
          );
          setEasting(null);
          setEastingList([]);
          setNorthing(null);
          setNorthingList([]);
        }}
        zone={zone}
        zoneList={zoneList}
        onZoneChange={(z) => {
          setZone(z);
          setEasting(null);
          setEastingList(
            getEastings(
              spatialAreaList.filter(
                (area) =>
                  area.utm_hemisphere === hemisphere && area.utm_zone === z,
              ),
            ),
          );
          setNorthing(null);
          setNorthingList([]);
        }}
        easting={easting}
        eastingList={eastingList}
        onEastingChange={(e) => {
          setEasting(e);
          setNorthing(null);
          setNorthingList(
            getNorthings(
              spatialAreaList.filter(
                (area) =>
                  area.utm_hemisphere === hemisphere &&
                  area.utm_zone === zone &&
                  area.area_utm_easting_meters === e,
              ),
            ),
          );
        }}
        northing={northing}
        northingList={northingList}
        onNorthingChange={(n) => setNorthing(n)}
      />
      <ButtonComponent
        text="Clear"
        onPress={() => {
          selectArea(null);
          setHemisphere('N');
          setZone(38);
          setEasting(null);
          setNorthing(null);
        }}
        rounded={true}
        buttonStyle={styles.clearButton}
      />
      {spatialAreaList.length === 0 ? (
        <Text style={{padding: '5%'}}>
          No Area available for current selection
        </Text>
      ) : (
        <SpatialAreaList
          areas={spatialAreaList.filter((area) =>
            matchArea(area, hemisphere, zone, easting, northing),
          )}
          onPress={(id) => {
            if (selectedAreaId === id) {
              selectArea(null);
            } else {
              selectArea(id);
            }
          }}
        />
      )}
    </ScrollView>
  );
};

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
  clearButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    width: '80%',
  },
});

export default SpatialAreaSelectScreen;
