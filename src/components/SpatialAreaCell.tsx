import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {SpatialArea} from '../constants/EnumsAndInterfaces/SpatialAreaInterfaces';
import {RowView} from './general/RowView';
import {verticalScale} from '../constants/nativeFunctions';
import {AslReducerState} from '../../redux/reducer';

const SpatialAreaCell = ({
  area,
  index,
  onPress,
}: {
  area: SpatialArea;
  index: number;
  onPress: (id: string) => void;
}) => {
  const selectedAreaId = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedSpatialAreaId,
  );

  const areaStr = `${area.utm_hemisphere}.${area.utm_zone}.${area.area_utm_easting_meters}.${area.area_utm_northing_meters}`;

  return (
    <View style={{padding: '5%'}}>
      <TouchableOpacity onPress={() => onPress(area.id)}>
        <RowView>
          <View style={styles.areaContainer}>
            <Text style={styles.area}>{areaStr}</Text>
          </View>
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
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    alignSelf: 'center',
    width: verticalScale(25),
    height: verticalScale(25),
  },
  area: {
    fontSize: 20,
    textAlignVertical: 'center',
    width: '80%',
  },
  areaContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpatialAreaCell;
