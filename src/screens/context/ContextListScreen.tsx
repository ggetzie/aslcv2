import * as React from "react";
import {useEffect, useState} from "react";
import {FlatList, NavigationScreenComponent, ScrollView} from "react-navigation";
import {Picker, Text, TouchableOpacity, View} from "react-native";
import {Context} from "../../constants/EnumsAndInterfaces/ContextInterfaces";
import {getContexts} from "../../constants/backend_api";
import {RowView} from "../../components/general/RowView";
import {Divider} from "react-native-elements";
import {PaddingComponent} from "../../components/PaddingComponent";
import {LoadingComponent} from "../../components/general/LoadingComponent";
import {verticalScale} from "../../constants/nativeFunctions";
import {getFormattedDate} from "../../constants/utilityFunctions";

enum ContextChoice {
    OPEN = "OPEN",
    UNUSED = "UNUSED",
    CLOSED = "CLOSED",
    ALL = "ALL"
}

const ContextListScreen: NavigationScreenComponent<any, any> = (props) => {
    const contextIds: string[] = props.navigation.getParam("contextIds");

    const [contexts, setContexts] = useState<Context[]>([]);
    const [filteredContexts, setFilteredContexts] = useState<Context[]>([]);
    const [contextChoice, setContextChoice] = useState<ContextChoice>(ContextChoice.ALL);
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchData() {
        setContexts(await getContexts(contextIds));
    }

    useEffect(() => {
        setLoading(true);
        fetchData().then(() => setLoading(false));
    }, [contextIds]);

    useEffect(() => {
        switch (contextChoice) {
            case ContextChoice.ALL:
                setFilteredContexts(contexts);
                break;
            case ContextChoice.OPEN:
                setFilteredContexts(contexts.filter((context: Context) => (context.opening_date != null && context.closing_date == null)));
                break;
            case ContextChoice.UNUSED:
                setFilteredContexts(contexts.filter((context: Context) => (context.opening_date == null && context.closing_date == null)));
                break;
            case ContextChoice.CLOSED:
                setFilteredContexts(contexts.filter((context: Context) => (context.opening_date != null && context.closing_date != null)));
                break;
            default:
                setFilteredContexts(contexts);
        }
    }, [contextChoice, contexts]);

    return (
        <ScrollView style={{padding: "5%"}}>
            <RowView>
                <Text style={{
                    fontSize: verticalScale(20),
                    width: "50%"
                }}>
                    Show
                </Text>
                <Picker
                    style={{
                        width: "50%",
                        paddingHorizontal: "5%"
                    }}
                    selectedValue={contextChoice}
                    onValueChange={(value: ContextChoice, pos) => setContextChoice(value)}>
                    <Picker.Item label="All" value={ContextChoice.ALL}/>
                    <Picker.Item label="Open" value={ContextChoice.OPEN}/>
                    <Picker.Item label="Unused" value={ContextChoice.UNUSED}/>
                    <Picker.Item label="Closed" value={ContextChoice.CLOSED}/>
                </Picker>
            </RowView>
            {loading && <LoadingComponent containerStyle={{margin: "auto"}}/>}
            <PaddingComponent/>
            {filteredContexts.length === 0 ?
                <Text style={{padding: "5%", alignSelf: "center"}}>
                    No Contexts available for current selection
                </Text> :
                <FlatList data={filteredContexts} renderItem={({item, index}) =>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("ContextDetailScreen", {
                            context: item
                        })}>
                        <View>
                            <RowView>
                                <Text style={{fontWeight: "bold"}}>
                                    Context Number
                                </Text>
                                <Text>
                                    {item.context_number}
                                </Text>
                            </RowView>
                            <PaddingComponent vertical="2%"/>
                            <RowView>
                                <Text style={{fontWeight: "bold"}}>
                                    Type
                                </Text>
                                <Text>
                                    {item.type == null ? "Unset" : item.type}
                                </Text>
                            </RowView>
                            <RowView>
                                <Text style={{fontWeight: "bold"}}>
                                    Opening Date
                                </Text>
                                <Text>
                                    {item.opening_date == null ? "Unset" : getFormattedDate(item.opening_date)}
                                </Text>
                            </RowView>
                            <RowView>
                                <Text style={{fontWeight: "bold"}}>
                                    Closing Date
                                </Text>
                                <Text>
                                    {item.closing_date == null ? "Unset" : getFormattedDate(item.closing_date)}
                                </Text>
                            </RowView>
                            <PaddingComponent vertical="2%"/>
                            <Divider/>
                            <PaddingComponent vertical="2%"/>
                        </View>
                    </TouchableOpacity>
                }/>}
        </ScrollView>
    );
}

ContextListScreen.navigationOptions = screenProps => ({
    title: 'Context List'
});

export default ContextListScreen;
