import * as React from "react";
import {useEffect, useState} from "react";
import {FlatList, NavigationScreenComponent, ScrollView} from "react-navigation";
import {Alert, Image, Picker, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {uploadContextBagPhotoImage} from "../../constants/backend_api";
import {getContext} from "../../constants/backend_api_action";
import {Context, renderSource, Source} from "../../constants/EnumsAndInterfaces/ContextInterfaces";
import {LoadingModalComponent} from "../../components/general/LoadingModalComponent";
import {ButtonComponent} from "../../components/general/ButtonComponent";
import ImagePicker, {ImagePickerOptions, ImagePickerResponse} from "react-native-image-picker";
import Modal from "react-native-modal";
import {horizontalScale, verticalScale} from "../../constants/nativeFunctions";
import {baseURL} from "../../constants/Axios";
import {PaddingComponent} from "../../components/PaddingComponent";
import {enumToArray, getContextStringFromContext} from "../../constants/utilityFunctions";
import {RowView} from "../../components/general/RowView";
import {Divider} from "react-native-elements";
import {HeaderBackButton} from "react-navigation-stack";
import ContextListScreen from "../context/ContextListScreen";


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

const FindsBagPhotosScreen: NavigationScreenComponent<any, any> = (props) => {
    const dispatch = useDispatch();

    const selectedContextId: string = useSelector(({reducer}: any) => reducer.selectedContextId);
    const contextIdToContextMap: Map<string, Context> = useSelector(({reducer}: any) => reducer.contextIdToContextMap);
    const [imagePickStage, setImagePickStage] = useState<boolean>(false);
    const [context, setContext] = useState<Context>(null);
    const [source, setSource] = useState<Source>(Source.D);


    const [loading, setLoading] = useState<boolean>(false);

    

    async function fetchData() {
        setLoading(true);
        await getContext(selectedContextId)(dispatch);
        setLoading(false);
    }

    useEffect(() => {
        if (selectedContextId == null) {
            return;
        }
        fetchData();
    }, [selectedContextId]);

    useEffect(() => {
        if (contextIdToContextMap.has(selectedContextId)) {
            setContext(contextIdToContextMap.get(selectedContextId));
        }
    }, [contextIdToContextMap, selectedContextId]);

    console.log(context);

    const field_photos = context.bagphoto_set.filter((photo) => {
        return photo.thumbnail_url.includes("bag_field")
    });

    const drying_photos = context.bagphoto_set.filter((photo) => {
        return photo.thumbnail_url.includes("bag_dry")
    });    

    if (selectedContextId == null) {
        return (<ScrollView>
            <Text>
                Please Select a context first
            </Text>
        </ScrollView>);
    }


    async function uploadImage(response) {
        setLoading(true);
        Alert.alert(
            "Image Upload",
            "Confirm Image Selection",
            [
                {
                    text: "Cancel",
                    onPress: () => setLoading(false),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        const form: FormData = new FormData();
                        try {
                            form.append("photo", {
                                uri: response.uri,
                                type: response.type,
                                name: response.fileName
                            } as any);
                            form.append("source", source);
                            await uploadContextBagPhotoImage(form, selectedContextId);
                            getContext(selectedContextId)(dispatch);
                            setLoading(false);
                        } catch (e) {
                            alert("Failed to upload Image");
                            setLoading(false);
                        }
                    }
                }
            ],
            {cancelable: false}
        );
    }


    return (
        <ScrollView>
            <LoadingModalComponent showLoading={loading}/>
            {context && <View>
                <Modal style={{justifyContent: "flex-end"}}
                       isVisible={imagePickStage}>
                    <ButtonComponent buttonStyle={Styles.modalButtonStyle}
                                     textStyle={{fontWeight: "bold"}}
                                     onPress={async () => {
                                         ImagePicker.launchImageLibrary(imagePickerOptions, async (response: ImagePickerResponse) => {
                                             setImagePickStage(false);
                                             if (response.didCancel) {
                                             } else if (response.error) {
                                                 alert("Error selecting Image");
                                             } else {
                                                 await uploadImage(response);
                                             }
                                         });
                                     }}
                                     text="Select Photo"
                                     rounded={true}/>
                    <ButtonComponent buttonStyle={Styles.modalButtonStyle}
                                     textStyle={{fontWeight: "bold"}}
                                     onPress={() => {
                                         ImagePicker.launchCamera(imagePickerOptions, async (response: ImagePickerResponse) => {
                                             if (response.didCancel) {
                                                 setImagePickStage(false);
                                             } else if (response.error) {
                                                 alert("Error selecting Image");
                                             } else {
                                                 await uploadImage(response);
                                             }
                                         });
                                     }}
                                     text="Take Photo"
                                     rounded={true}/>
                    <ButtonComponent buttonStyle={Styles.cancelButtonStyle}
                                     textStyle={{color: "black"}}
                                     onPress={() => setImagePickStage(false)} text="Close"
                                     rounded={true}/>
                </Modal>
                <Text style={{
                    fontSize: verticalScale(20),
                    fontWeight: "bold",
                    paddingHorizontal: "5%",
                    paddingTop: "5%"
                }}>
                    {"Context: " + getContextStringFromContext(context)}
                </Text>
                <PaddingComponent vertical="2%"/>
                <View style={{paddingHorizontal: "5%", paddingVertical: "0%"}}>
                    <Divider/>
                    <PaddingComponent vertical="2%"/>
                    <RowView style={{paddingVertical: "0%"}}>
                        <Text style={Styles.labelStyle}>
                            Source
                        </Text>
                        <Picker
                            style={Styles.inputStyle}
                            selectedValue={source}
                            onValueChange={(value: Source, pos) => setSource(value)}>
                            {enumToArray<Source>(Source).map((source: Source) =>
                                <Picker.Item label={renderSource(source)} value={source}/>
                            )}
                        </Picker>
                    </RowView>
                    <ButtonComponent
                        buttonStyle={{width: "35%", height: "auto", alignSelf: "center"}}
                        onPress={() => setImagePickStage(true)}
                        textStyle={{padding: "4%"}}
                        text={"Add Photo"}
                        rounded={true}
                    />
                    <PaddingComponent vertical="2%"/>
                    <Divider/>
                    <PaddingComponent vertical="2%"/>
                    <RowView>
                        <Text style={Styles.labelStyle}>
                            Total Bag Photos
                        </Text>
                        <Text>
                            {context.bagphoto_set == null ? 0 : context.bagphoto_set.length}
                        </Text>
                    </RowView>
                    <PaddingComponent vertical="2%"/>
                    
                    {field_photos.length > 0 && 
                    <React.Fragment>
                        <Text style={{
                            fontSize: verticalScale(20),
                            fontWeight: "bold",
                            paddingTop: "5%"
                        }}>
                            Field Photos
                        </Text>
                        <FlatList
                            keyExtractor={(item) => item.thumbnail_url}
                            data={field_photos}
                            renderItem={({item}) =>
                                <Image
                                    style={Styles.imageStyle}
                                    resizeMode="cover"
                                    source={{uri: (baseURL + item.thumbnail_url)}}/>}
                            numColumns={3}
                        />
                        <PaddingComponent vertical="2%"/>
                    </React.Fragment>}

                    
                    
                    {drying_photos.length > 0 && 
                    <React.Fragment>
                        <Text style={{
                            fontSize: verticalScale(20),
                            fontWeight: "bold",
                            paddingTop: "5%"
                        }}>
                            Drying Photos
                        </Text>
                        <FlatList
                            keyExtractor={(item) => item.thumbnail_url}
                            data={drying_photos}
                            renderItem={({item}) =>
                                <Image
                                    style={Styles.imageStyle}
                                    resizeMode="cover"
                                    source={{uri: (baseURL + item.thumbnail_url)}}/>}
                            numColumns={3}
                        />
                    </React.Fragment>}
                </View>
            </View>}
        </ScrollView>
    )
};

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
    imageStyle: {
        alignSelf: "center",
        width: horizontalScale(100),
        height: horizontalScale(100),
        marginHorizontal: horizontalScale(5)
    },
    modalButtonStyle: {
        width: "60%",
    },
    cancelButtonStyle: {
        width: "60%",
        backgroundColor: "white"
    }
});

FindsBagPhotosScreen.navigationOptions = screenProps => ({
    title: 'Finds Bag Photos',
    headerLeft: () => <HeaderBackButton onPress={() => {
        screenProps.navigation.navigate("ContextScreenStack");
    }}/>
});

export default FindsBagPhotosScreen;
