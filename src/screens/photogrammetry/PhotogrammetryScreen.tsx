import * as React from "react";
import {NavigationScreenComponent} from "react-navigation";
import {Text, View} from "react-native";

const PhotogrammetryScreen: NavigationScreenComponent<any, any> = (props) => {
    return (
        <View>
            <Text>
                Photogrammetry Screen goes here...
            </Text>
        </View>
    )
};

PhotogrammetryScreen.navigationOptions = screenProps => ({
    title: 'Context',
    headerLeft: () => null
});

export default PhotogrammetryScreen;
