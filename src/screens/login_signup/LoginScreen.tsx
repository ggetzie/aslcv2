import * as React from "react";
import {useState} from "react";
import {NavigationScreenComponent} from "react-navigation";
import {useDispatch} from "react-redux";
import {LoginDetails} from "../../constants/EnumsAndInterfaces/UserDataInterfaces";
import {TextInput, View} from "react-native";
import {LoadingModalComponent} from "../../components/general/LoadingModalComponent";
import {ButtonComponent} from "../../components/general/ButtonComponent";
import {loginUser} from "../../constants/backend_api_action";
import DataLoadingComponent from "../../components/DataLoadingComponent";

const LoginScreen: NavigationScreenComponent<any, any> = (props) => {
    const dispatch = useDispatch();
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function validateInputAndLogin() {
        if (usernameOrEmail.trim().length === 0) {
            alert("Username/Email cannot be empty");
            return;
        } else if (password.trim().length === 0) {
            alert("Password cannot be empty");
            return;
        }

        try {
            setLoading(true);
            let loginDetails: LoginDetails = {
                email: undefined,
                username: usernameOrEmail,
                password: password,
            };

            await dispatch(loginUser(loginDetails));
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
            <TextInput value={usernameOrEmail}
                       onChangeText={(text) => setUsernameOrEmail(text)}
                       placeholder="Username/Email"/>
            <TextInput value={password}
                       secureTextEntry={true}
                       onChangeText={(text) => setPassword(text)}
                       placeholder="Password"/>
            <ButtonComponent onPress={validateInputAndLogin} text={"Log In"}/>
            <ButtonComponent onPress={()=> props.navigation.navigate("SignupScreen")} text={"Signup"}/>
        </View>
    );


};

LoginScreen.navigationOptions = screenProps => ({
    title: '',
    headerLeft: () => null
});

export default LoginScreen;
