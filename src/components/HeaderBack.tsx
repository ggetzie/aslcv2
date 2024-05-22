import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {AslReducerState} from '../../redux/reducer';
import {LeftArrow, NoBack} from '../constants/imageAssets';
import {verticalScale} from '../constants/nativeFunctions';

const HeaderBack = ({navigation}) => {
  const canSubmitContext = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.canSubmitContext,
  );
  const imgSrc = canSubmitContext ? NoBack : LeftArrow;
  const onPress = canSubmitContext ? () => {} : () => navigation.goBack();
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={imgSrc} style={styles.image} />
    </TouchableOpacity>
  );
};

export default HeaderBack;

const styles = StyleSheet.create({
  image: {
    height: verticalScale(35),
    width: verticalScale(35),
    marginLeft: 5,
  },
  container: {
    padding: 5,
    backgroundColor: 'white',
  },
});
