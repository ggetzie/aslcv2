import React from 'react';
import {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  SpatialArea,
  UTM_Hemisphere,
  hemisphereList,
} from '../constants/EnumsAndInterfaces/SpatialAreaInterfaces';

import {RowView} from './general/RowView';
import {verticalScale} from '../constants/nativeFunctions';

export const UTMForm = ({
  hemisphere,
  onHemisphereChange,
  zone,
  zoneList,
  onZoneChange,
  easting,
  eastingList,
  onEastingChange,
  northing,
  northingList,
  onNorthingChange,
}: {
  hemisphere: UTM_Hemisphere;
  onHemisphereChange: (h: UTM_Hemisphere) => void;
  zone: number;
  zoneList: number[];
  onZoneChange: (z: number) => void;
  easting: number | null;
  eastingList: number[];
  onEastingChange: (e: number) => void;
  northing: number | null;
  northingList: number[];
  onNorthingChange: (n: number) => void;
}) => {
  const [spatialAreaList, setSpatialAreaList] = useState<SpatialArea[]>([]);

  return (
    <View>
      <View style={{paddingHorizontal: '5%', marginTop: verticalScale(0)}}>
        {/* Hemisphere Select */}
        <RowView style={{paddingVertical: '0%'}}>
          <Text style={styles.labelStyle}>Hemisphere</Text>
          <Picker
            style={styles.inputStyle}
            selectedValue={hemisphere}
            onValueChange={(value: UTM_Hemisphere, pos) =>
              onHemisphereChange(value)
            }>
            {hemisphereList.map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>
        </RowView>

        {/* Zone Select */}
        <RowView style={{paddingVertical: '0%'}}>
          <Text style={styles.labelStyle}>Zone: </Text>
          <Picker
            style={styles.inputStyle}
            selectedValue={zone}
            onValueChange={(value: number, pos: number) => onZoneChange(value)}>
            {zoneList.map((z) => (
              <Picker.Item key={z} label={z.toString()} value={z} />
            ))}
            <Picker.Item key={0} label=" " value={null} />
          </Picker>
        </RowView>
        {/* Easting Select*/}
        <RowView style={{paddingVertical: '0%'}}>
          <Text style={styles.labelStyle}>Easting (meters): </Text>
          <Picker
            style={styles.inputStyle}
            selectedValue={easting}
            onValueChange={(value: number, pos: number) =>
              onEastingChange(value)
            }>
            {eastingList.map((e) => (
              <Picker.Item key={e} label={e.toString()} value={e} />
            ))}
            <Picker.Item key={0} label=" " value={null} />
          </Picker>
        </RowView>
        {/* Northing Select*/}
        <RowView style={{paddingVertical: '0%'}}>
          <Text style={styles.labelStyle}>Northing (meters): </Text>
          <Picker
            style={styles.inputStyle}
            selectedValue={northing}
            onValueChange={(value: number, pos: number) =>
              onNorthingChange(value)
            }>
            {northingList.map((n) => (
              <Picker.Item key={n} label={n.toString()} value={n} />
            ))}
            <Picker.Item key={0} label=" " value={null} />
          </Picker>
        </RowView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: verticalScale(16),
    color: 'black',
    width: '50%',
  },
  inputStyle: {
    width: '50%',
    paddingHorizontal: '5%',
  },
  iconStyle: {
    alignSelf: 'center',
    width: verticalScale(25),
    height: verticalScale(25),
  },
});
