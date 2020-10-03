import * as React from "react";
import {useEffect, useState} from "react";
import {FlatList, NavigationScreenComponent, ScrollView} from "react-navigation";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {UTMForm} from "../../components/UTMForm";
import {
    initSpatialArea,
    SpatialArea,
    SpatialAreaQuery
} from "../../constants/EnumsAndInterfaces/SpatialAreaInterfaces";
import {getFilteredSpatialAreasList} from "../../constants/backend_api";
import {RowView} from "../../components/general/RowView";
import {LoadingComponent} from "../../components/general/LoadingComponent";
import {Divider, Icon} from "react-native-elements";
import {verticalScale} from "../../constants/nativeFunctions";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedSpatialArea} from "../../../redux/reducerAction";
import {nativeColors} from "../../constants/colors";

const SpatialAreaSelectScreen: NavigationScreenComponent<any, any> = (props) => {
    const dispatch  = useDispatch();

    // @ts-ignore
    const selectedArea: SpatialArea =  useSelector(({reducer}) => reducer.selectedSpatialArea);

    const [form, setForm] = useState<SpatialAreaQuery>(initSpatialArea());
    const [spatialAreas, setSpacialAreas] = useState<SpatialArea[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchSpatialAreaList();
    }, [form]);

    async function fetchSpatialAreaList() {
        try {
            setLoading(true);
            const newSpatialAreas = await getFilteredSpatialAreasList(form);
            setSpacialAreas(newSpatialAreas);
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
                    dispatch(setSelectedSpatialArea(item as SpatialArea));
                    props.navigation.goBack();
                }}>
                    <RowView>
                        <Text style={{marginRight: verticalScale(20), width: "20%"}}>
                            {`Area ${index + 1}:`}
                        </Text>
                        <Text style={{width: "60%"}}>
                            {`${item.utm_hemisphere}, Zone: ${item.utc_zone}, Northing: ${item.area_utm_easting_meters}, Easting: ${item.area_utm_northing_meters}`}
                        </Text>
                        <Icon style={Styles.iconStyle} name="check" type="font-awesome" color={(selectedArea && selectedArea.id === item.id) ? "black" : "transparent"}/>
                    </RowView>
                    <Divider/>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView>
            <UTMForm form={form} setForm={setForm}/>
            <Text style={{fontSize: verticalScale(20), fontWeight: "bold", padding: "5%"}}>Spatial
                Areas :</Text>
            {loading ?
                <View style={{width: "100%", height: verticalScale(50)}}>
                    <LoadingComponent containerStyle={{margin: "auto"}}/>
                </View> :
                spatialAreas.length === 0 ?
                    <Text style={{padding: "5%"}}>
                        No Areas available for above choices
                    </Text> :
                    <FlatList
                        style={{
                            marginTop: verticalScale(5)
                        }}
                        data={spatialAreas}
                        extraData={spatialAreas}
                        renderItem={({item, index}) =>
                            renderAreaItem(item, index)}/>}
        </ScrollView>
    )
};

SpatialAreaSelectScreen.navigationOptions = screenProps => ({
    title: 'Select Spatial Area'
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
        width: verticalScale(20),
        height: verticalScale(20)
    }
});

export default SpatialAreaSelectScreen;
