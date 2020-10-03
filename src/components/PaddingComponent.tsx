import * as React from "react";
import {View} from "react-native";

interface Props {
    vertical?: string;
    horizontal?: string;
}

export const PaddingComponent: React.FC<Props> = (props)=> {
    const vertical = props.vertical? props.vertical : "5%";
    const horizontal = props.horizontal ? props.horizontal : "5%";
    return <View style={{paddingVertical: vertical.toString(), paddingHorizontal: horizontal.toString()}}/>;
};
