import * as React from 'react';
import {useState} from 'react';
import {
  validateEmail,
  validatePassword,
  verticalScale,
} from '../../constants/nativeFunctions';
import {LoginDetails} from '../../constants/EnumsAndInterfaces/UserDataInterfaces';
import {registerUser} from '../../constants/backend_api_action';
import {LoadingModalComponent} from '../../components/general/LoadingModalComponent';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import {nativeColors} from '../../constants/colors';
import {PaddingComponent} from '../../components/PaddingComponent';

const SignupScreen = (props) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function validateInputAndRegister() {
    if (username.trim().length === 0) {
      alert('Username cannot be empty');
      return;
    } else if (email.trim().length === 0) {
      alert('Email Address cannot be empty');
      return;
    } else if (!validateEmail(email)) {
      alert('Email Address badly formatted');
      return;
    } else if (!validatePassword(password)) {
      alert(
        'Password must be 8 characters long and must consist of both letters and numbers',
      );
      return;
    }

    try {
      setLoading(true);
      let signupDetails: LoginDetails = {
        email: email,
        username: username,
        password: password,
      };
      await dispatch(registerUser(signupDetails));
      setLoading(false);
      props.navigation.navigate('DataLoadingComponent');
    } catch (e) {
      setLoading(false);
      alert(e);
    }
  }

  return (
    <View>
      <LoadingModalComponent showLoading={loading} />
      <View style={styles.container}>
        <Text style={styles.headerText}>Signup</Text>
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
          value={email}
          style={styles.textInputContainer}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
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
        onPress={validateInputAndRegister}
        text={'Signup'}
        rounded={true}
        buttonStyle={{width: '50%'}}
      />
      <ButtonComponent
        onPress={() => props.navigation.navigate('LoginScreen')}
        text={'Login'}
        rounded={true}
        buttonStyle={{
          width: '50%',
          backgroundColor: nativeColors.disabledGrey,
        }}
        textStyle={{color: 'black'}}
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
});

export default SignupScreen;
