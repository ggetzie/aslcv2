import * as React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {LoginDetails} from '../../constants/EnumsAndInterfaces/UserDataInterfaces';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../../../navigation/MainTabNavigator';
import {LoadingModalComponent} from '../../components/general/LoadingModalComponent';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import {loginUser} from '../../constants/backend_api_action';
import {nativeColors} from '../../constants/colors';
import {verticalScale} from '../../constants/nativeFunctions';
import {PaddingComponent} from '../../components/PaddingComponent';
import {mediaBaseURL} from '../../constants/Axios';

type Props = BottomTabNavigationProp<MainTabParamList, 'Login'>;

const LoginScreen = (_: Props) => {
  const dispatch = useDispatch();
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const host = mediaBaseURL.replace('https://', '');

  async function validateInputAndLogin() {
    if (usernameOrEmail.trim().length === 0) {
      alert('Username cannot be empty');
      return;
    } else if (password.trim().length === 0) {
      alert('Password cannot be empty');
      return;
    }

    try {
      setLoading(true);
      let loginDetails: LoginDetails = {
        email: undefined,
        username: usernameOrEmail,
        password: password,
      };

      dispatch(loginUser(loginDetails));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert(e);
    }
  }

  return (
    <View>
      <LoadingModalComponent showLoading={loading} />

      <View style={styles.container}>
        <Text style={styles.headerText}>Login</Text>
        <TextInput
          value={usernameOrEmail}
          style={styles.textInputContainer}
          onChangeText={(text) => setUsernameOrEmail(text)}
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
        onPress={validateInputAndLogin}
        text={'Log In'}
        rounded={true}
        buttonStyle={{width: '50%'}}
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
