import React from 'react';
import {useEffect, useState} from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {verticalScale} from '../constants/nativeFunctions';
import {nativeColors} from '../constants/colors';
import {useSelector} from 'react-redux';
import {AppState, getAppState} from '../constants/EnumsAndInterfaces/AppState';

interface Props {
  focused: boolean;
  showState: AppState[];
  icon: ImageSourcePropType;
}

export const StateDependentTabIcon: React.FC<Props> = (props) => {
  const selectedAreaId: string = useSelector(
    ({reducer}: any) => reducer.selectedSpatialAreaId,
  );
  const selectedContextId: string = useSelector(
    ({reducer}: any) => reducer.selectedContextId,
  );

  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(props.showState.includes(getAppState()));
  }, [selectedAreaId, selectedContextId]);

  if (!visible) {
    return <View></View>;
  }
  return props.focused ? (
    <Image
      style={[styles.bottomImage, {tintColor: nativeColors.iconBrown}]}
      resizeMode={'contain'}
      source={props.icon}
    />
  ) : (
    <Image
      style={[styles.bottomImage, {tintColor: nativeColors.grey}]}
      resizeMode={'contain'}
      source={props.icon}
    />
  );
};

const styles = StyleSheet.create({
  bottomImage: {
    height: verticalScale(40),
    width: verticalScale(40),
  },
});
