import * as React from 'react';
import {Text, View} from 'react-native';

const PhotogrammetryScreen = (props) => {
  return (
    <View>
      <Text>Photogrammetry Screen goes here...</Text>
    </View>
  );
};

PhotogrammetryScreen.navigationOptions = (screenProps) => ({
  title: 'Photogrammetry',
  headerLeft: () => null,
});

export default PhotogrammetryScreen;
