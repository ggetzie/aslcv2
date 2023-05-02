import React from 'react';
import {useState} from 'react';
import {Picker, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ButtonComponent} from './general/ButtonComponent';
import {
  SpatialArea,
  SpatialAreaQuery,
} from '../constants/EnumsAndInterfaces/SpatialAreaInterfaces';
import Geolocation, {
  GeolocationConfiguration,
} from '@react-native-community/geolocation';
import {RowView} from './general/RowView';
import {verticalScale} from '../constants/nativeFunctions';
import {TextInputWithClearComponent} from './general/TextInputWithClearComponent';
import {nativeColors} from '../constants/colors';
import {LoadingModalComponent} from './general/LoadingModalComponent';
import {Icon} from 'react-native-elements';
import {getFilteredSpatialAreasList} from '../constants/backend_api';
import {useSelector} from 'react-redux';

let utmObj = require('utm-latlng');
let utm = new utmObj();

interface Props {
  form: SpatialAreaQuery;
  setForm: (form) => void;
  availableSpatialAreaIds: string[];
  navigation: any;
}

export const UTMForm: React.FC<Props> = (props) => {
  const {form, setForm} = props;
  const [loading, setLoading] = useState<boolean>(false);

  const spatialAreaIdToSpatialAreaMap: Map<string, SpatialArea> = useSelector(
    ({reducer}: any) => reducer.spatialAreaIdToSpatialAreaMap,
  );

  const config: GeolocationConfiguration = {
    skipPermissionRequests: false,
    authorizationLevel: 'auto',
  };
  Geolocation.setRNConfiguration(config);

  async function setUTCFromPosition(locationInfo: any) {
    try {
      const lat = locationInfo.coords.latitude;
      const lng = locationInfo.coords.longitude;
      const UTM = utm.convertLatLngToUtm(lat, lng, 0);
      const newForm: SpatialAreaQuery = {
        utm_zone: UTM.ZoneNumber,
        area_utm_easting_meters: UTM.Easting,
        area_utm_northing_meters: UTM.Northing,
        utm_hemisphere: form.utm_hemisphere,
      };
      setForm(newForm);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  async function getPositionAndSetUTC() {
    setLoading(true);
    await Geolocation.getCurrentPosition(
      (info) => setUTCFromPosition(info),
      (error) => {
        setLoading(false);
        console.warn(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  }

  async function getMetersList(isNorthing: boolean) {
    try {
      const newSpatialAreas = await getFilteredSpatialAreasList({
        ...form,
        area_utm_easting_meters: isNorthing
          ? form.area_utm_easting_meters
          : null,
        area_utm_northing_meters: isNorthing
          ? null
          : form.area_utm_northing_meters,
      });
      if (isNorthing) {
        return Promise.resolve(
          newSpatialAreas.map((area) => area.area_utm_northing_meters),
        );
      } else {
        return Promise.resolve(
          newSpatialAreas.map((area) => area.area_utm_easting_meters),
        );
      }
    } catch (e) {
      console.log(e);
      Promise.reject();
    }
  }

  return (
    <View>
      <LoadingModalComponent showLoading={loading} />
      <RowView style={{padding: '4%'}}>
        <Text style={{fontSize: verticalScale(18)}}>Fill below OR</Text>
        <ButtonComponent
          buttonStyle={{width: '60%', height: 'auto'}}
          onPress={() => getPositionAndSetUTC()}
          textStyle={{padding: '4%'}}
          text={'Use Current Location'}
          rounded={true}
        />
      </RowView>
      <View style={{paddingHorizontal: '5%', marginTop: verticalScale(0)}}>
        <RowView style={{paddingVertical: '0%'}}>
          <Picker
            style={Styles.inputStyle}
            selectedValue={form.utm_hemisphere}
            onValueChange={(value: string, pos) =>
              setForm({...form, utm_hemisphere: value})
            }>
            <Picker.Item label="N - North" value="N" />
            <Picker.Item label="S - South" value="S" />
          </Picker>
          <Text style={Styles.labelStyle}>Hemisphere</Text>
        </RowView>
        <RowView style={{paddingVertical: '0%'}}>
          <TextInputWithClearComponent
            value={form.utm_zone}
            containerStyle={Styles.inputStyle}
            onChangeText={(text) =>
              setForm({
                ...form,
                utm_zone: Number(text),
              })
            }
            numeric={true}
            placeHolder="UTM Zone Number"
          />
          <Text style={Styles.labelStyle}>UTM Zone</Text>
        </RowView>

        {/* Easting Select*/}
        <TouchableOpacity
          style={{width: '100%'}}
          onPress={async () => {
            const availableEastings = await getMetersList(false);
            const selectedEastingIndex = availableEastings.findIndex(
              (area) => area === props.form.area_utm_easting_meters,
            );

            props.navigation.navigate('SelectFromListScreen', {
              list: availableEastings,
              selectedIndex: selectedEastingIndex,
              onPress: (area) =>
                setForm({
                  ...form,
                  area_utm_easting_meters: area,
                }),
            });
          }}>
          <RowView style={{paddingVertical: '5%'}}>
            <Text>Select Easting (meters)</Text>
            <Text>{form.area_utm_easting_meters}</Text>
            <Icon
              style={Styles.iconStyle}
              name="chevron-right"
              type="font-awesome"
              color={nativeColors.grey}
            />
          </RowView>
        </TouchableOpacity>

        {/* Northing Select*/}
        <TouchableOpacity
          style={{width: '100%'}}
          onPress={async () => {
            const availableNorthings = await getMetersList(true);
            const selectedNorthingIndex = availableNorthings.findIndex(
              (area) => area === props.form.area_utm_northing_meters,
            );

            props.navigation.navigate('SelectFromListScreen', {
              list: availableNorthings,
              selectedIndex: selectedNorthingIndex,
              onPress: (area) =>
                setForm({
                  ...form,
                  area_utm_northing_meters: area,
                }),
            });
          }}>
          <RowView style={{paddingVertical: '5%'}}>
            <Text>Select Northing (meters)</Text>
            <Text>{form.area_utm_northing_meters}</Text>
            <Icon
              style={Styles.iconStyle}
              name="chevron-right"
              type="font-awesome"
              color={nativeColors.grey}
            />
          </RowView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  labelStyle: {
    fontSize: verticalScale(16),
    color: 'black',
    width: '30%',
  },
  inputStyle: {
    width: '70%',
    paddingHorizontal: '5%',
  },
  iconStyle: {
    alignSelf: 'center',
    width: verticalScale(25),
    height: verticalScale(25),
  },
});
