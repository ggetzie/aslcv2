import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {PhotoDetails} from '../constants/EnumsAndInterfaces/ContextInterfaces';
import {horizontalScale, verticalScale} from '../constants/nativeFunctions';
// import {mediaBaseURL} from '../constants/Axios';
import {uniqueId} from 'underscore';
import {AslReducerState, HOSTS} from '../../redux/reducer';

const PhotoGrid = ({
  photoList,
  columns,
}: {
  photoList: PhotoDetails[];
  columns: number;
}) => {
  const mediaBaseURL = useSelector(
    ({reducer}: {reducer: AslReducerState}) => HOSTS[reducer.host].mediaURL,
  );
  if (photoList.length === 0) {
    return <Text>{'No photos available'}</Text>;
  }
  let rows = [];
  let buffer = [];
  for (let i = 0; i < photoList.length; i++) {
    buffer.push(
      <View style={styles.cell} key={photoList[i].thumbnail_url}>
        <Image
          source={{uri: mediaBaseURL + photoList[i].thumbnail_url}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>,
    );
    if (i % columns === columns - 1 || i === photoList.length - 1) {
      rows.push(
        <View key={uniqueId()} style={styles.row}>
          {buffer}
        </View>,
      );
      buffer = [];
    }
  }

  return <View style={styles.container}>{rows}</View>;
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
  },
  cell: {
    marginRight: 10,
  },
  image: {
    alignSelf: 'center',
    width: horizontalScale(100),
    height: horizontalScale(100),
    marginHorizontal: horizontalScale(5),
    marginBottom: verticalScale(5),
  },
  text: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PhotoGrid;
