import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';

const LoadingBar = ({message}: {message: string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <ProgressBar
        styleAttr="Horizontal"
        indeterminate={true}
        style={styles.bar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 16,
  },
  bar: {
    width: 200,
  },
});

export default LoadingBar;
