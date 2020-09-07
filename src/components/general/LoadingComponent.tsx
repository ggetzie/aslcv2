import * as React from "react";
import {ActivityIndicator, View} from "react-native";

interface Props {
    containerStyle?: any;
}

export const LoadingComponent: React.FC<Props> = (props) => {
    return (
        <View
            style={[{
                backgroundColor: "black",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }, props.containerStyle]}>
            <ActivityIndicator/>
        </View>
    )
};
