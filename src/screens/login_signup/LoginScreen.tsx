import React, {useState, useContext} from 'react';
import {useDispatch} from 'react-redux';
import {LoginDetails} from '../../constants/EnumsAndInterfaces/UserDataInterfaces';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../../../navigation';
import {LoadingModalComponent} from '../../components/general/LoadingModalComponent';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import {loginUser} from '../../constants/backend_api_action';
import {nativeColors} from '../../constants/colors';
import {verticalScale} from '../../constants/nativeFunctions';
import {PaddingComponent} from '../../components/PaddingComponent';
import {mediaBaseURL} from '../../constants/Axios';
import {AuthContext} from '../../../navigation/';

type Props = BottomTabScreenProps<MainTabParamList, 'Login'>;

const LoginScreen = (_: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const host = mediaBaseURL.replace('https://', '');

  const {signIn} = useContext(AuthContext);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.headerText}>Login</Text>
        <TextInput
          value={username}
          style={styles.textInputContainer}
          onChangeText={(text) => setUsername(text)}
          autoCapitalize={'none'}
          autoCorrect={false}
          placeholder="Username"
        />
        <PaddingComponent />
        <TextInput
          value={password}
          style={styles.textInputContainer}
          secureTextEntry={true}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
        />
      </View>
      <ButtonComponent
        onPress={() => signIn({username, password})}
        text={'Log In'}
        rounded={true}
        buttonStyle={{width: '50%'}}
        disabled={username === '' || password === ''}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Host: {host}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: 'black',
    fontSize: verticalScale(24),
    fontWeight: '500',
    padding: '10%',
  },
  container: {
    marginTop: verticalScale(150),
    width: '80%',
    alignSelf: 'center',
    padding: '10%',
    alignItems: 'center',
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: nativeColors.disabledGrey,
    width: '100%',
    padding: '5%',
  },
  info: {
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 20,
  },
});

export default LoginScreen;
