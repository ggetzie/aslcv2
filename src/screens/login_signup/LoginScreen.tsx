import AsyncStorage from '@react-native-community/async-storage';
import React, {useState, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {UserProfile} from '../../constants/EnumsAndInterfaces/UserDataInterfaces';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../../../navigation';
import LoadingModalComponent, {
  LoadingMessage,
} from '../../components/general/LoadingModalComponent';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import {nativeColors} from '../../constants/colors';
import {verticalScale} from '../../constants/nativeFunctions';
import {PaddingComponent} from '../../components/PaddingComponent';
import {AuthContext} from '../../../navigation/';
import {SET_USER_PROFILE} from '../../../redux/reducerAction';
import HostPicker from '../../components/HostPicker';

type Props = BottomTabScreenProps<MainTabParamList, 'Login'>;

const LoginScreen = (_: Props) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loadingMessage, setLoadingMessage] =
    useState<LoadingMessage>('hidden');

  const {signIn} = useContext(AuthContext);

  return (
    <View>
      <LoadingModalComponent message={loadingMessage} />
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
      <HostPicker />
      <ButtonComponent
        onPress={async () => {
          setLoadingMessage('loggingIn');
          const token = await signIn({username, password});
          if (token) {
            const userProfile: UserProfile = {
              username: username,
              authToken: token,
            };
            await AsyncStorage.setItem('authToken', userProfile.authToken);
            await AsyncStorage.setItem('username', userProfile.username);
            setLoadingMessage('hidden');
            dispatch({type: SET_USER_PROFILE, payload: userProfile});
          } else {
            setLoadingMessage('hidden');
            alert('Invalid username or password');
          }
        }}
        text={'Log In'}
        rounded={true}
        buttonStyle={{width: '50%'}}
        disabled={username === '' || password === ''}
      />
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
