import * as React from "react";
import {NavigationScreenComponent} from "react-navigation";
import {Text, View} from "react-native";

const ContextScreen: NavigationScreenComponent<any, any> = (props) => {
    return (
        <View>
            <Text>
                Context Screen goes here...
            </Text>
        </View>
    )
};

ContextScreen.navigationOptions = screenProps => ({
    title: 'Context',
    headerLeft: () => null
});

export default ContextScreen;
