import * as React from 'react';
import {Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {LogoutButton} from '../../components/LogoutButton';
import {useSelector} from 'react-redux';
import {UserProfileWithCredentials} from '../../constants/EnumsAndInterfaces/UserDataInterfaces';
import {RowView} from '../../components/general/RowView';
import {verticalScale} from '../../constants/nativeFunctions';
import {SettingsStackParamList} from '../../../navigation/MainTabNavigator';

type Props = StackScreenProps<SettingsStackParamList, 'SettingsScreen'>;

const SettingsScreen = (props: Props) => {
  const userProfile: UserProfileWithCredentials = useSelector(
    ({reducer}: any) => reducer.userProfileWithCredentials,
  );

  return (
    <View>
      <RowView style={{padding: '5%'}}>
        <Text style={{fontWeight: 'bold', fontSize: verticalScale(20)}}>
          Username
        </Text>
        {userProfile && userProfile.username && (
          <Text style={{fontSize: verticalScale(20)}}>
            {userProfile.username}
          </Text>
        )}
      </RowView>

      <LogoutButton navigation={props.navigation} />
    </View>
  );
};

SettingsScreen.navigationOptions = (screenProps) => ({
  title: 'Settings',
  headerLeft: () => null,
});

export default SettingsScreen;
