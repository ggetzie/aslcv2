import * as React from "react";
import {NavigationScreenComponent} from "react-navigation";
import {Text, View} from "react-native";

const EndOfDigScreen: NavigationScreenComponent<any, any> = (props) => {
    return (
        <View>
            <Text>
                End Of Dig Screen goes here...
            </Text>
        </View>
    )
};

EndOfDigScreen.navigationOptions = screenProps => ({
    title: 'End of Dig',
    headerLeft: () => null
});

export default EndOfDigScreen;
