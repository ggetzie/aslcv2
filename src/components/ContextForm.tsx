import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  Context,
  ContextFormData,
} from '../constants/EnumsAndInterfaces/ContextInterfaces';

const ContextForm = ({
  context,
  onFormChanged,
  onSave,
}: {
  context: Context;
  onFormChanged: () => void;
  onSave: () => void;
}) => {
  return (
    <View style={styles.container}>
      <Text>Context Form</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContextForm;
