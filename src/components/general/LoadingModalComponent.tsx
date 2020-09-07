import * as React from "react";
import Modal from "react-native-modal";
import {View} from "react-native";
import {LoadingComponent} from "./LoadingComponent";

interface Props {
    showLoading: boolean;
}

export const LoadingModalComponent: React.FC<Props> = (props) => {
    return (
        <Modal isVisible={props.showLoading}
               style={{backgroundColor: "transparent", backfaceVisibility: "hidden"}}>
            <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
                <LoadingComponent containerStyle={{backgroundColor: "transparent"}}/>
            </View>
        </Modal>
    );
};
