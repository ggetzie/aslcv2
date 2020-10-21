import * as React from "react";
import {useEffect, useState} from "react";
import {NavigationScreenComponent, ScrollView} from "react-navigation";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Context} from "../../constants/EnumsAndInterfaces/ContextInterfaces";
import {verticalScale} from "../../constants/nativeFunctions";
import {RowView} from "../../components/general/RowView";
import {TextInputWithClearComponent} from "../../components/general/TextInputWithClearComponent";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {getFormattedDate, reverseDateFormatting} from "../../constants/utilityFunctions";
import {PaddingComponent} from "../../components/PaddingComponent";
import {Divider} from "react-native-elements";
import {getContext, updateContext} from "../../constants/backend_api";
import {LoadingModalComponent} from "../../components/general/LoadingModalComponent";
import {ButtonComponent} from "../../components/general/ButtonComponent";
import ImagePicker, {ImagePickerOptions} from "react-native-image-picker";
import Modal from "react-native-modal";
import {isEqual} from "lodash";

enum DatePickState {
    OPENING_DATE = "OPENING_DATE",
    CLOSING_DATE = "CLOSING_DATE",
    CLOSED = "CLOSED"
}

const imagePickerOptions: ImagePickerOptions = {
    title: 'Select Photo',
    mediaType: "photo",
    cameraType: 'back',
    takePhotoButtonTitle: "Take Photo",
    allowsEditing: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const ContextDetailScreen: NavigationScreenComponent<any, any> = (props) => {

    const context: Context = props.navigation.getParam("context");

    const [datePickState, setDatePickState] = useState<DatePickState>(DatePickState.CLOSED);
    const [imagePickStage, setImagePickStage] = useState<boolean>(false);

    const [form, setForm] = useState<Context>(null);
    const [dbContext, setDBContext] = useState<Context>(context);
    const [canBeSubmitted, setCanBeSubmitted] = useState<boolean>(false);

    async function fetchData() {
        setForm(await getContext(context.id));
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (form && form.spatial_area != null) {
            delete form.spatial_area;
        }
        if (dbContext && dbContext.spatial_area != null) {
            delete dbContext.spatial_area;
        }
        if (!isEqual(form, dbContext)) {
            setCanBeSubmitted(true);
        } else {
            setCanBeSubmitted(false);
        }
    }, [form]);

    async function updateForm() {
        const updatedContext: Context = await updateContext(form);
        setDBContext(updatedContext);
        setForm(updatedContext);
    }

    return (
        form == null ? <LoadingModalComponent showLoading={true}/> :
            <ScrollView>
                <Modal style={{justifyContent: "flex-end"}}
                       isVisible={imagePickStage}
                >
                    <ButtonComponent buttonStyle={Styles.modalButtonStyle}
                                     textStyle={{fontWeight: "bold"}}
                                     onPress={() => {
                                         ImagePicker.launchImageLibrary(imagePickerOptions, (response) => console.log("Response: ", response));
                                         setImagePickStage(false);
                                     }} text="Select Photo"
                                     rounded={true}/>
                    <ButtonComponent buttonStyle={Styles.modalButtonStyle}
                                     textStyle={{fontWeight: "bold"}}
                                     onPress={() => {
                                         ImagePicker.launchCamera(imagePickerOptions, (response) => console.log("Response: ", response));
                                         setImagePickStage(false);
                                     }} text="Take Photo"
                                     rounded={true}/>
                    <ButtonComponent buttonStyle={Styles.cancelButtonStyle}
                                     textStyle={{color: "black"}}
                                     onPress={() => setImagePickStage(false)} text="Close"
                                     rounded={true}/>
                </Modal>
                <DateTimePickerModal
                    isVisible={datePickState !== DatePickState.CLOSED}
                    onConfirm={(date) => {
                        if (datePickState === DatePickState.OPENING_DATE) {
                            setForm({
                                ...form,
                                opening_date: reverseDateFormatting(date.toISOString())
                            });
                        } else if (datePickState === DatePickState.CLOSING_DATE) {
                            setForm({
                                ...form,
                                closing_date: reverseDateFormatting(date.toISOString())
                            });
                        }
                        setDatePickState(DatePickState.CLOSED);
                    }}
                    onCancel={() => setDatePickState(DatePickState.CLOSED)}
                    date={(datePickState === DatePickState.OPENING_DATE ?
                        (context.opening_date == null ? (new Date) : (new Date(context.opening_date))) :
                        (context.closing_date == null ? (new Date()) : (new Date(context.closing_date))))}
                    mode="datetime"
                />
                <RowView>
                    <Text style={{
                        fontSize: verticalScale(20),
                        fontWeight: "bold",
                        paddingHorizontal: "5%",
                        paddingTop: "5%"
                    }}>
                        Context Details
                    </Text>
                    {canBeSubmitted &&
                    <ButtonComponent
                        buttonStyle={{
                            width: "30%",
                            height: "auto",
                            alignSelf: "flex-end",
                            marginHorizontal: "5%"
                        }}
                        onPress={() => updateForm()}
                        textStyle={{padding: "4%"}}
                        text={"Update"}
                        rounded={true}
                    />}
                </RowView>


                <View style={{paddingHorizontal: "5%", paddingVertical: "0%"}}>

                    <RowView style={{paddingVertical: "0%"}}>
                        <Text style={Styles.labelStyle}>
                            Type
                        </Text>
                        <TextInputWithClearComponent value={form.type}
                                                     containerStyle={Styles.inputStyle}
                                                     onChangeText={(text) =>
                                                         setForm({
                                                             ...form,
                                                             type: text
                                                         })}
                                                     numeric={false}
                                                     placeHolder="Context Type"/>
                    </RowView>
                    <PaddingComponent vertical="2%"/>
                    <TouchableOpacity onPress={() => setDatePickState(DatePickState.OPENING_DATE)}>
                        <RowView>
                            <Text style={Styles.labelStyle}>
                                Opening Date
                            </Text>
                            <Text>
                                {getFormattedDate(form.opening_date)}
                            </Text>
                        </RowView>
                    </TouchableOpacity>
                    <PaddingComponent vertical="2%"/>
                    <TouchableOpacity onPress={() => setDatePickState(DatePickState.CLOSING_DATE)}>
                        <RowView>
                            <Text style={Styles.labelStyle}>
                                Closing Date
                            </Text>
                            <Text>
                                {getFormattedDate(form.closing_date)}
                            </Text>
                        </RowView>
                    </TouchableOpacity>
                    <PaddingComponent vertical="2%"/>
                    <Text style={Styles.labelStyle}>
                        Description
                    </Text>
                    <TextInputWithClearComponent value={form.description}
                                                 containerStyle={{width: "100%"}}
                                                 onChangeText={(text) =>
                                                     setForm({
                                                         ...form,
                                                         description: text
                                                     })}
                                                 numeric={false}
                                                 multiline={true}
                                                 placeHolder="Brief Description of Context"/>
                    <Divider/>
                    <PaddingComponent vertical="2%"/>
                    <Text style={Styles.labelStyle}>
                        Director Notes
                    </Text>
                    <TextInputWithClearComponent value={form.director_notes}
                                                 containerStyle={{width: "100%"}}
                                                 onChangeText={(text) =>
                                                     setForm({
                                                         ...form,
                                                         director_notes: text
                                                     })}
                                                 numeric={false}
                                                 multiline={true}
                                                 placeHolder="Notes"/>
                    <Divider/>
                    <PaddingComponent vertical="2%"/>
                    <TouchableOpacity onPress={() => null}>
                        <RowView>
                            <Text style={Styles.labelStyle}>
                                Total Photos
                            </Text>
                            <Text>
                                {form.objectphoto_set == null ? 0 : form.objectphoto_set.length}
                            </Text>
                        </RowView>
                    </TouchableOpacity>
                    <ButtonComponent
                        buttonStyle={{width: "35%", height: "auto", alignSelf: "center"}}
                        onPress={() => setImagePickStage(true)}
                        textStyle={{padding: "4%"}}
                        text={"Add Photo"}
                        rounded={true}
                    />

                </View>
            </ScrollView>
    );
}

const Styles = StyleSheet.create({
    labelStyle: {
        fontSize: verticalScale(16),
        color: "black",
        width: "50%"
    },
    inputStyle: {
        width: "50%"
    },
    iconStyle: {
        alignSelf: "center",
        width: verticalScale(25),
        height: verticalScale(25)
    },
    modalButtonStyle: {
        width: "60%",
    },
    cancelButtonStyle: {
        width: "60%",
        backgroundColor: "white"
    }
});

ContextDetailScreen.navigationOptions = screenProps => ({
    title: 'Context Details'
});

export default ContextDetailScreen;
