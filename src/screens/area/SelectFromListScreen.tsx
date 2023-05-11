import * as React from 'react';

import {RowView} from '../../components/general/RowView';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {verticalScale} from '../../constants/nativeFunctions';
import {ScreenColors} from '../../constants/EnumsAndInterfaces/AppState';
import {StackScreenProps} from '@react-navigation/stack';
import {AreaStackParamList} from '../../../navigation';

type Props = StackScreenProps<AreaStackParamList, 'SelectFromListScreen'>;

const SelectFromListScreen = (props: Props) => {
  const {list, selectedIndex, onPress} = props.route.params;

  function renderItem(item, index: number) {
    return (
      <TouchableOpacity
        onPress={() => {
          onPress(item);
          props.navigation.goBack();
        }}>
        <RowView style={{width: '100%', padding: '5%'}}>
          <Text>{item}</Text>
          <Icon
            style={Styles.iconStyle}
            name="check"
            type="font-awesome"
            color={selectedIndex === index ? 'black' : 'transparent'}
          />
        </RowView>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView>
      <FlatList
        style={{
          marginTop: verticalScale(5),
        }}
        data={list}
        renderItem={({item, index}) => renderItem(item, index)}
      />
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    display: 'flex',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInputStyle: {
    width: '80%',
  },
  iconStyle: {
    alignSelf: 'center',
    width: verticalScale(25),
    height: verticalScale(25),
  },
  background: {
    backgroundColor: ScreenColors.SELECTING_AREA,
  },
});

export default SelectFromListScreen;
