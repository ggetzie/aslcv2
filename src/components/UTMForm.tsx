import * as React from "react";
import {useState} from "react";
import {Picker, StyleSheet, TextInput, View, Text} from "react-native";
import {ButtonComponent} from "./general/ButtonComponent";
import {
    initSpatialArea,
    SpatialAreaQuery
} from "../constants/EnumsAndInterfaces/SpatialAreaInterfaces";
import Geolocation, {GeolocationConfiguration} from '@react-native-community/geolocation';
import {RowView} from "./general/RowView";
import {verticalScale} from "../constants/nativeFunctions";
import {TextInputWithClearComponent} from "./general/TextInputWithClearComponent";
import {nativeColors} from "../constants/colors";
import {LoadingModalComponent} from "./general/LoadingModalComponent";

let utmObj = require('utm-latlng');
let utm = new utmObj();

interface Props {
    form: SpatialAreaQuery;
    setForm: (form) => void;
}

export const UTMForm: React.FC<Props> = (props) => {
    const {form, setForm} = props;
    const [loading, setLoading] = useState<boolean>(false);

    const config: GeolocationConfiguration = {
        skipPermissionRequests: false,
        authorizationLevel: 'auto'
    };
    Geolocation.setRNConfiguration(config);

    async function setUTCFromPosition(locationInfo: any) {
        try {
            const lat = locationInfo.coords.latitude;
            const lng = locationInfo.coords.longitude;
            const UTM = utm.convertLatLngToUtm(lat, lng, 0);
            const newForm: SpatialAreaQuery = {
                utm_zone: UTM.ZoneNumber,
                area_utm_easting_meters: UTM.Easting,
                area_utm_northing_meters: UTM.Northing,
                utm_hemisphere: form.utm_hemisphere
            };
            setForm(newForm);
            setLoading(false);
            console.log("LocInfo: ", UTM);
        } catch (e) {
            setLoading(false);
        }
    }

    async function getPositionAndSetUTC() {
        setLoading(true);
        await Geolocation.getCurrentPosition(info => setUTCFromPosition(info), (error) => {
            setLoading(false);
                console.warn(error);
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            });
    }

    return (
        <View>
            <LoadingModalComponent showLoading={loading}/>
            <RowView style={{padding: "4%"}} >
                <Text style={{fontSize: verticalScale(18)}}>
                    Fill below OR
                </Text>
                <ButtonComponent
                    buttonStyle={{width: "60%", height: "auto"}}
                    onPress={() => getPositionAndSetUTC()}
                    textStyle={{padding: "4%"}}
                    text={"Use Current Location"}
                    rounded={true}
                />
            </RowView>
            <View style={{paddingHorizontal: "5%", marginTop: verticalScale(20)}}>
                <TextInputWithClearComponent value={form.utm_zone}
                                             onChangeText={(text) =>
                                                 setForm({
                                                     ...form,
                                                     utm_zone: Number(text)
                                                 })}
                                             numeric={true}
                                             placeHolder="UTM Zone Number"/>
                <TextInputWithClearComponent value={form.area_utm_northing_meters}
                                             onChangeText={(text) =>
                                                 setForm({
                                                     ...form,
                                                     area_utm_northing_meters: Number(text)
                                                 })}
                                             numeric={true}
                                             placeHolder="Northing (meters)"/>
                <TextInputWithClearComponent value={form.area_utm_easting_meters}
                                             onChangeText={(text) =>
                                                 setForm({
                                                     ...form,
                                                     area_utm_easting_meters: Number(text)
                                                 })}
                                             numeric={true}
                                             placeHolder="Easting (meters)"/>
                <RowView style={{paddingVertical: "0%"}}>
                    <Picker
                        style={Styles.selectInputStyle}
                        selectedValue={form.utm_hemisphere}
                        onValueChange={(value: string, pos) =>
                            setForm({...form, utm_hemisphere: value})}>
                        <Picker.Item label="N - North" value="N"/>
                        <Picker.Item label="S - South" value="S"/>
                    </Picker>
                    <Text style={Styles.selectLabelStyle}>
                        Hemisphere
                    </Text>
                </RowView>
            </View>

        </View>
    )
};

const Styles = StyleSheet.create({
    selectLabelStyle: {
        fontSize: verticalScale(16),
        color: nativeColors.grey,
        width: "50%"
    },
    selectInputStyle: {
        width: "50%"
    }
});
