import React from 'react';
import {ProgressBarAndroid, View, Text, StyleSheet} from 'react-native';

const LoadingBar = ({message}: {message: string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <ProgressBarAndroid
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
