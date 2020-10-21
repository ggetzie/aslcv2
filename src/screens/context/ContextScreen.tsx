import * as React from "react";
import {useEffect, useState} from "react";
import {FlatList, NavigationScreenComponent, ScrollView} from "react-navigation";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {verticalScale} from "../../constants/nativeFunctions";
import {RowView} from "../../components/general/RowView";
import {Divider, Icon} from 'react-native-elements';
import {
    initSpatialArea,
    SpatialArea,
    SpatialAreaQuery
} from "../../constants/EnumsAndInterfaces/SpatialAreaInterfaces";
import {useDispatch, useSelector} from "react-redux";
import {createContext, getFilteredSpatialAreasList} from "../../constants/backend_api";
import {setSelectedSpatialArea} from "../../../redux/reducerAction";
import {UTMForm} from "../../components/UTMForm";
import {LoadingComponent} from "../../components/general/LoadingComponent";
import {ButtonComponent} from "../../components/general/ButtonComponent";
import {nativeColors} from "../../constants/colors";

const ContextScreen: NavigationScreenComponent<any, any> = (props) => {
    const dispatch = useDispatch();

    // @ts-ignore
    const selectedArea: SpatialArea = useSelector(({reducer}) => reducer.selectedSpatialArea);

    const [form, setForm] = useState<SpatialAreaQuery>(initSpatialArea());
    const [spatialAreas, setSpacialAreas] = useState<SpatialArea[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setSelectedSpatialArea(null));
    }, []);

    useEffect(() => {
        fetchSpatialAreaList();
    }, [form]);

    async function fetchSpatialAreaList() {
        try {
            dispatch(setSelectedSpatialArea(null));
            setLoading(true);
            const newSpatialAreas = await getFilteredSpatialAreasList(form);
            setSpacialAreas(newSpatialAreas);
            if (newSpatialAreas && newSpatialAreas.length === 1) {
                dispatch(setSelectedSpatialArea(newSpatialAreas[0]));
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    function renderAreaItem(item, index) {
        return (
            <View style={{padding: "5%"}}>
                <TouchableOpacity onPress={() => {
                    if (selectedArea && selectedArea.id === item.id) {
                        dispatch(setSelectedSpatialArea(null));
                    } else {
                        dispatch(setSelectedSpatialArea(item as SpatialArea));
                    }
                }}>
                    <RowView>
                        <Text style={{marginRight: verticalScale(20), width: "20%"}}>
                            {`Area ${index + 1}:`}
                        </Text>
                        <Text style={{width: "60%"}}>
                            {`${item.utm_hemisphere}, Zone: ${item.utm_zone}, Northing: ${item.area_utm_northing_meters}, Easting: ${item.area_utm_easting_meters}`}
                        </Text>
                        {/* TODO: Investigate Icon styling issue (gets cut-off)*/}
                        <Icon style={Styles.iconStyle} name="check" type="font-awesome"
                              color={(selectedArea && selectedArea.id === item.id) ? "black" : "transparent"}/>
                    </RowView>
                    <Divider/>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView>
            <Text style={{
                fontSize: verticalScale(20),
                fontWeight: "bold",
                paddingHorizontal: "5%",
                paddingTop: "5%"
            }}>Select a spatial Area</Text>
            <UTMForm form={form} setForm={setForm} navigation={props.navigation}
                     availableSpatialAreas={spatialAreas}/>
            {loading ?
                <View style={{width: "100%", height: verticalScale(50)}}>
                    <LoadingComponent containerStyle={{margin: "auto"}}/>
                </View> : spatialAreas.length === 0 ?
                    <Text style={{padding: "5%"}}>
                        No Area available for current selection
                    </Text> : spatialAreas.length > 1 ?
                        <FlatList
                            style={{
                                marginTop: verticalScale(5)
                            }}
                            data={spatialAreas}
                            extraData={spatialAreas}
                            renderItem={({item, index}) =>
                                renderAreaItem(item, index)}/> : null
            }
            {selectedArea &&
            <View style={{padding: "5%"}}>
                <Text style={{
                    marginRight: verticalScale(20),
                    width: "100%",
                    fontSize: verticalScale(20),
                    fontWeight: "bold",
                }}>
                    {`Selected Area`}
                </Text>
                <Text style={{
                    width: "100%", paddingVertical: verticalScale(5)
                }}>
                    {`${selectedArea.utm_hemisphere}, Zone: ${selectedArea.utm_zone}, Northing: ${selectedArea.area_utm_northing_meters}, Easting: ${selectedArea.area_utm_easting_meters}`}
                </Text>
                <ButtonComponent
                    buttonStyle={{width: "60%", height: "auto", alignSelf: "center"}}
                    onPress={async () => props.navigation.navigate("ContextDetailScreen", {
                        context: await createContext(selectedArea.id)
                    })}
                    textStyle={{padding: "4%"}}
                    text={"Create Context"}
                    rounded={true}
                />
                <ButtonComponent
                    buttonStyle={{
                        width: "60%",
                        height: "auto",
                        alignSelf: "center",
                        backgroundColor: nativeColors.disabledGrey
                    }}
                    onPress={() => props.navigation.navigate("ContextListScreen", {
                        contextIds: selectedArea.spatialcontext_set.map((item) => item[0])
                    })}
                    textStyle={{padding: "4%", color: "black"}}
                    text={"View All Contexts"}
                    rounded={true}
                />
            </View>
            }
        </ScrollView>
    )
};

ContextScreen.navigationOptions = screenProps => ({
    title: 'Context',
    headerLeft: () => null
});

const Styles = StyleSheet.create({
    containerStyle: {
        flexDirection: "row",
        display: "flex",
        width: "80%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    textInputStyle: {
        width: "80%"
    },
    iconStyle: {
        alignSelf: "center",
        width: verticalScale(25),
        height: verticalScale(25)
    }
});

export default ContextScreen;
