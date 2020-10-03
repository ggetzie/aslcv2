import * as React from "react";
import {ActivityIndicator, View} from "react-native";
import {nativeColors} from "../../constants/colors";

interface Props {
    containerStyle?: any;
}

export const LoadingComponent: React.FC<Props> = (props) => {
    return (
        <View
            style={[{
                backgroundColor: "transparent",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }, props.containerStyle]}>
            <ActivityIndicator color={nativeColors.lightBrown} size='large'/>
        </View>
    )
};
