import * as React from "react";
import {NavigationScreenComponent} from "react-navigation";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {verticalScale} from "../../constants/nativeFunctions";
import {RowView} from "../../components/general/RowView";
import {Icon} from 'react-native-elements';
import {nativeColors} from "../../constants/colors";
import {SpatialArea} from "../../constants/EnumsAndInterfaces/SpatialAreaInterfaces";
import {useSelector} from "react-redux";

const ContextScreen: NavigationScreenComponent<any, any> = (props) => {

    // TODO: Investigate typescript error on reducer object
    // @ts-ignore
    const selectedArea: SpatialArea =  useSelector(({reducer}) => reducer.selectedSpatialArea);

    return (
        <View>
            <TouchableOpacity
                style={{width: "100%", padding: "4%"}}
                onPress={() => props.navigation.navigate("SpatialAreaSelectScreen")}>
                <RowView>
                    <Text style={Styles.spatialAreaText}>{"Spatial Area"}</Text>
                    <Text>{selectedArea ? 'Selected' : ""}</Text>
                    <Icon style={Styles.iconStyle} name="chevron-right" type="font-awesome" color={nativeColors.grey}/>
                </RowView>

            </TouchableOpacity>
        </View>
    )
};

ContextScreen.navigationOptions = screenProps => ({
    title: 'Context',
    headerLeft: () => null
});

const Styles = StyleSheet.create({
    spatialAreaText: {
        fontSize: verticalScale(18),
        fontWeight: "500"
    },
    iconStyle: {
        alignSelf: "center",
        width: verticalScale(20),
        height: verticalScale(20)
    }
});

export default ContextScreen;
