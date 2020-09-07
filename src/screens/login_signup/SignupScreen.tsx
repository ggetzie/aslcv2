import * as React from "react";
import {useState} from "react";
import {NavigationScreenComponent} from "react-navigation";
import {validateEmail, validatePassword} from "../../constants/nativeFunctions";
import {LoginDetails} from "../../constants/EnumsAndInterfaces/UserDataInterfaces";
import {registerUser} from "../../constants/backend_api_action";
import {LoadingModalComponent} from "../../components/general/LoadingModalComponent";
import {TextInput, View} from "react-native";
import {useDispatch} from "react-redux";
import {ButtonComponent} from "../../components/general/ButtonComponent";


const SignupScreen: NavigationScreenComponent<any, any> = (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function validateInputAndRegister() {
        if (username.trim().length === 0) {
            alert("Username cannot be empty");
            return;
        } else if (email.trim().length === 0) {
            alert("Email Address cannot be empty");
            return;
        } else if (!validateEmail(email)) {
            alert("Email Address badly formatted");
            return;
        } else if (!validatePassword(password)) {
            alert("Password must be 8 characters long and must consist of both letters and numbers");
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
            props.navigation.navigate("DataLoadingComponent");

        } catch (e) {
            setLoading(false);
            alert(e);
        }
    }

    return (
        <View>
            <LoadingModalComponent showLoading={loading}/>
            <TextInput value={username}
                       onChangeText={(text) => setUsername(text)}
                       placeholder="Username"/>
            <TextInput value={email}
                       onChangeText={(text) => setEmail(text)}
                       placeholder="Email"/>
            <TextInput value={password}
                       secureTextEntry={true}
                       onChangeText={(text) => setPassword(text)}
                       placeholder="Password"/>
            <ButtonComponent onPress={validateInputAndRegister} text={"Signup"}/>
            <ButtonComponent onPress={() => props.navigation.navigate("SignupScreen")}
                             text={"Login"}/>
        </View>
    );
};

SignupScreen.navigationOptions = screenProps => ({
    title: '',
    headerLeft: () => null
});

export default SignupScreen;
