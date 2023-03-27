import * as React from 'react';
import {
  FlatList,
  NavigationScreenComponent,
  ScrollView,
} from 'react-navigation';
import {RowView} from '../../components/general/RowView';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {verticalScale} from '../../constants/nativeFunctions';
import {ScreenColors} from '../../constants/EnumsAndInterfaces/AppState';

const SelectFromListScreen: NavigationScreenComponent<any, any> = (props) => {
  const list: any[] = props.navigation.getParam('list');
  const selectedIndex: number = props.navigation.getParam('selectedIndex');
  const onPress = props.navigation.getParam('onPress');

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

SelectFromListScreen.navigationOptions = (props) => ({
  title: 'Select',
  headerRight: () => {
    const onPress = props.navigation.getParam('onPress');

    return (
      <TouchableOpacity
        onPress={() => {
          onPress(null);
          props.navigation.goBack();
        }}>
        <Text style={{marginHorizontal: verticalScale(10), color: 'white'}}>
          Clear
        </Text>
      </TouchableOpacity>
    );
  },
});

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
