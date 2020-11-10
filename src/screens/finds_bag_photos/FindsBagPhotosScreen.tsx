import * as React from "react";
import {NavigationScreenComponent} from "react-navigation";
import {Text, View} from "react-native";

const FindsBagPhotosScreen: NavigationScreenComponent<any, any> = (props) => {
    return (
        <View>
            <Text>
                Finds Bag Photos Screen goes here...
            </Text>
        </View>
    )
};

FindsBagPhotosScreen.navigationOptions = screenProps => ({
    title: 'Finds Bag Photos',
    headerLeft: () => null
});

export default FindsBagPhotosScreen;
