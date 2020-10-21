import * as React from "react";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {Icon} from 'react-native-elements';
import {nativeColors} from "../../constants/colors";
import {verticalScale} from "../../constants/nativeFunctions";

interface Props {
    value: string | number;
    containerStyle?: any;
    testInputStyle?: any;
    placeHolder?: string;
    numeric?: boolean;
    multiline?: boolean;
    onChangeText: (text: string) => void;
}

// TODO: Fix Conditional statement being interpreted s text
export const TextInputWithClearComponent: React.FC<Props> = (props) => {
    const numeric = !!props.numeric;
    return (
        <View style={[Styles.containerStyle, props.containerStyle ? props.containerStyle : {}]}>
            <TextInput
                multiline={!!props.multiline}
                value={props.value ? props.value.toString() : null}
                style={[Styles.textInputStyle, props.testInputStyle ? props.testInputStyle : {}]}
                placeholder={props.placeHolder}
                keyboardType={numeric ? "numeric" : "default"}
                onChangeText={props.onChangeText}
            />
            {props.value ? <TouchableOpacity onPress={() => props.onChangeText(null)}>
                {/* TODO: Investigate Icon styling issue (gets cut-off)*/}
                <Icon style={Styles.iconStyle} name="close" type="font-awesome"
                      color={nativeColors.grey}/>
            </TouchableOpacity> : null}
        </View>
    );
};

const Styles = StyleSheet.create({
    containerStyle: {
        flexDirection: "row",
        display: "flex",
        alignSelf: "flex-start",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    textInputStyle: {
        width: "80%"
    },
    iconStyle: {
        padding: "auto",
        alignSelf: "center",
        width: verticalScale(25),
        height: verticalScale(25)
    }
});
