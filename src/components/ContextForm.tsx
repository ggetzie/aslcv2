import React, {useState} from 'react';
import {View, Text, StyleSheet, Picker, TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  SpatialContext,
  ContextFormData,
  defaultContextTypes,
} from '../constants/EnumsAndInterfaces/ContextInterfaces';
import {verticalScale} from '../constants/nativeFunctions';
import {RowView} from './general/RowView';
import {TextInputComponent} from './general/TextInputComponent';
import {ButtonComponent} from './general/ButtonComponent';
import {validateDates, renderDate} from '../constants/utilityFunctions';

const OpeningDatePicker = DateTimePicker;
const ClosingDatePicker = DateTimePicker;

const contextTypes = defaultContextTypes;

const ContextForm = ({
  openingDate,
  onOpeningDateChange,
  closingDate,
  onClosingDateChange,
  contextType,
  onContextTypeChange,
  description,
  onDescriptionChange,
  canSubmit,
  onSave,
}: {
  openingDate: string;
  onOpeningDateChange: (date: string) => void;
  closingDate: string;
  onClosingDateChange: (date: string) => void;
  contextType: string;
  onContextTypeChange: (type: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  canSubmit: boolean;
  onSave: () => void;
}) => {
  const [openingVisible, setOpeningVisible] = useState(false);
  const [closingVisible, setClosingVisible] = useState(false);

  return (
    <View style={styles.container}>
      <OpeningDatePicker
        isVisible={openingVisible}
        onConfirm={(date) => {
          onOpeningDateChange(date.toISOString());
          setOpeningVisible(false);
        }}
        onCancel={() => setOpeningVisible(false)}
      />
      <ClosingDatePicker
        isVisible={closingVisible}
        onConfirm={(date) => {
          onClosingDateChange(date.toISOString());
          setClosingVisible(false);
        }}
        onCancel={() => setClosingVisible(false)}
      />

      {/* Context type */}
      <RowView style={{paddingVertical: '0%'}}>
        <Text style={styles.labelStyle}>Type</Text>

        <Picker
          style={styles.inputStyle}
          selectedValue={contextType}
          onValueChange={(value: string, pos) => onContextTypeChange(value)}>
          {contextTypes
            .map((type) => <Picker.Item label={type} value={type} />)
            .concat(<Picker.Item label={'Select'} value={null} />)}
        </Picker>
      </RowView>

      {/* Opening and closing dates */}
      <RowView>
        <TouchableOpacity onPress={() => setOpeningVisible(true)}>
          <Text style={styles.labelStyle}>Opening Date</Text>
          <Text>{renderDate(openingDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setClosingVisible(true)}>
          <Text style={styles.labelStyle}>Closing Date</Text>
          <Text>{renderDate(closingDate)}</Text>
        </TouchableOpacity>
      </RowView>
      <Text style={styles.labelStyle}>Description</Text>
      <TextInputComponent
        value={description}
        containerStyle={{width: '100%'}}
        onChangeText={(text) => onDescriptionChange(text)}
        numeric={false}
        multiline={true}
        placeHolder="Brief Description of Context"
      />
      <ButtonComponent
        buttonStyle={styles.submitButton}
        onPress={() => onSave()}
        textStyle={{padding: '4%'}}
        text={'Update'}
        rounded={true}
        disabled={!canSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    fontSize: verticalScale(16),
    color: 'black',
    width: 'auto',
  },
  inputStyle: {
    width: '50%',
  },
  submitButton: {
    width: '30%',
    height: 'auto',
    alignSelf: 'flex-end',
    marginHorizontal: '5%',
  },
});

export default ContextForm;
