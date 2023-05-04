import React, {useState} from 'react';
import {View, Text, StyleSheet, Picker, TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useSelector} from 'react-redux';
import {verticalScale} from '../constants/nativeFunctions';
import {RowView} from './general/RowView';
import {TextInputComponent} from './general/TextInputComponent';
import {ButtonComponent} from './general/ButtonComponent';
import {AslReducerState} from '../../redux/reducer';

const OpeningDatePicker = DateTimePicker;
const ClosingDatePicker = DateTimePicker;

const YYYY_MM_DD = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const ContextForm = ({
  openingDate,
  onOpeningDateChange,
  closingDate,
  onClosingDateChange,
  contextType,
  onContextTypeChange,
  description,
  onDescriptionChange,
  contextTypes,
  onReset,
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
  contextTypes: string[];
  onReset: () => void;
  onSave: () => void;
}) => {
  const canSubmitGlobal: boolean = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.canSubmitContext,
  );

  const [openingVisible, setOpeningVisible] = useState(false);
  const [closingVisible, setClosingVisible] = useState(false);

  return (
    <View style={styles.container}>
      <OpeningDatePicker
        isVisible={openingVisible}
        onConfirm={(date) => {
          onOpeningDateChange(YYYY_MM_DD(date));
          setOpeningVisible(false);
        }}
        onCancel={() => setOpeningVisible(false)}
      />
      <ClosingDatePicker
        isVisible={closingVisible}
        onConfirm={(date) => {
          onClosingDateChange(YYYY_MM_DD(date));
          setClosingVisible(false);
        }}
        onCancel={() => setClosingVisible(false)}
      />

      {/* Context type */}
      <RowView style={styles.formRow}>
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
      <RowView style={styles.formRow}>
        <TouchableOpacity
          onPress={() => setOpeningVisible(true)}
          style={styles.inputStyle}>
          <Text style={styles.labelStyle}>Opening Date:</Text>
          <Text>{openingDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setClosingVisible(true)}
          style={styles.inputStyle}>
          <Text style={styles.labelStyle}>Closing Date:</Text>
          <Text>{closingDate}</Text>
        </TouchableOpacity>
      </RowView>
      <View style={styles.formCol}>
        <Text style={[styles.labelStyle, {paddingHorizontal: 10}]}>
          Description:
        </Text>
        <TextInputComponent
          value={description}
          containerStyle={{width: '100%', paddingHorizontal: 10}}
          onChangeText={(text) => onDescriptionChange(text)}
          numeric={false}
          multiline={true}
          placeHolder="Brief Description of Context"
        />
      </View>
      {canSubmitGlobal && (
        <>
          <Text style={styles.warning}>
            Context data has changed. Submit or reset form to leave this screen.
          </Text>
          <RowView>
            <ButtonComponent
              buttonStyle={styles.submitButton}
              onPress={() => onReset()}
              textStyle={{padding: '4%'}}
              text={'Reset'}
              rounded={true}
            />
            <ButtonComponent
              buttonStyle={styles.submitButton}
              onPress={() => onSave()}
              textStyle={{padding: '4%'}}
              text={'Update'}
              rounded={true}
            />
          </RowView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 15,
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
  formRow: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  formCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  warning: {
    color: 'red',
    fontSize: verticalScale(10),
    textAlign: 'center',
    width: '100%',
  },
});

export default ContextForm;
