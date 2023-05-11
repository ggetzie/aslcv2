import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {UserProfile} from '../../constants/EnumsAndInterfaces/UserDataInterfaces';
import {RowView} from '../../components/general/RowView';
import {verticalScale} from '../../constants/nativeFunctions';
import {SettingsStackParamList} from '../../../navigation';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import {AuthContext} from '../../../navigation/';
import {AslReducerState} from '../../../redux/reducer';

type Props = StackScreenProps<SettingsStackParamList, 'SettingsScreen'>;

const SettingsScreen = (props: Props) => {
  const userProfile: UserProfile = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.userProfile,
  );
  const {signOut} = useContext(AuthContext);

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
      <ButtonComponent
        onPress={signOut}
        text={'Logout'}
        rounded={true}
        buttonStyle={{width: '30%'}}
      />
    </View>
  );
};

export default SettingsScreen;
