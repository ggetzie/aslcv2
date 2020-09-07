import * as React from "react";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle
} from "react-native";
import {verticalScale} from "../../constants/nativeFunctions";
import {nativeColors} from "../../constants/colors";

interface Props {
    onPress: () => void;
    text: string;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: any;
    disabled?: boolean;
    loading?: boolean;
    rounded?: boolean;
}

export const ButtonComponent: React.FC<Props> = (props) => {
    const rounded = !!props.rounded;
    const disabled = !!props.disabled;
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[styles.buttonStyle, props.buttonStyle, {borderRadius: (rounded ? verticalScale(20) : 0)}]}
            onPress={props.onPress}>
            {props.loading ? <ActivityIndicator/>
                : <Text style={[styles.textStyle, props.textStyle]}>{props.text}</Text>}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    buttonStyle: {
        width: "100%",
        backgroundColor: nativeColors.tintedBrown,
        alignSelf: "center",
        height: verticalScale(40),
        alignItems: "center",
        justifyContent: "center",
        marginVertical: verticalScale(15)
    },
    textStyle: {
        fontSize: verticalScale(18),
        fontWeight: "500"
    }
});
