import * as React from "react";
import {useEffect, useState} from "react";
import {FlatList, NavigationScreenComponent, ScrollView} from "react-navigation";
import {Picker, Text, TouchableOpacity, View} from "react-native";
import {Context} from "../../constants/EnumsAndInterfaces/ContextInterfaces";
import {RowView} from "../../components/general/RowView";
import {Divider} from "react-native-elements";
import {PaddingComponent} from "../../components/PaddingComponent";
import {LoadingComponent} from "../../components/general/LoadingComponent";
import {verticalScale} from "../../constants/nativeFunctions";
import {renderDate} from "../../constants/utilityFunctions";
import {useDispatch, useSelector} from "react-redux";
import {createContext, getContexts} from "../../constants/backend_api_action";
import {ButtonComponent} from "../../components/general/ButtonComponent";
import {SpatialArea} from "../../constants/EnumsAndInterfaces/SpatialAreaInterfaces";
import {getSpatialArea} from "../../constants/backend_api";
import {setSelectedContextId} from "../../../redux/reducerAction";

enum ContextChoice {
    OPEN = "OPEN",
    UNUSED = "UNUSED",
    CLOSED = "CLOSED",
    ALL = "ALL"
}

const ContextListScreen: NavigationScreenComponent<any, any> = (props) => {
    const dispatch = useDispatch();

    const [contextIds, setContextIds] = useState<string[]>(props.navigation.getParam("contextIds"));

    const selectedAreaId: string = useSelector(({reducer}: any) => reducer.selectedSpatialAreaId);
    const contextIdToContextMap: Map<string, Context> = useSelector(({reducer}: any) => reducer.contextIdToContextMap);
    const spatialAreaIdToSpatialAreaMap: Map<string, SpatialArea> = useSelector(({reducer}: any) => reducer.spatialAreaIdToSpatialAreaMap);

    const [filteredContextIds, setFilteredContextIds] = useState<string[]>(contextIds);
    const [contextChoice, setContextChoice] = useState<ContextChoice>(ContextChoice.ALL);
    const [allLoaded, setAllLoaded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function updateIds() {
        setLoading(true);
        const area: SpatialArea = await getSpatialArea(selectedAreaId);
        setContextIds(area.spatialcontext_set.map((item) => item[0]));
        setLoading(false);
    }

    useEffect(() => {
        updateIds();
    }, []);

    useEffect(() => {
        setLoading(true);
        getContexts(contextIds)(dispatch);
        setLoading(false);
    }, [contextIds]);

    useEffect(() => {
        const all: boolean = contextIds.reduce((prev: boolean, id: string) => prev && contextIdToContextMap.has(id), true);
        setAllLoaded(all);
        if (all) {
            const availableContexts: Context[] = [];
            for (let i of contextIds) {
                if (contextIdToContextMap.has(i)) {
                    availableContexts.push(contextIdToContextMap.get(i));
                }
            }
            availableContexts.sort((contextA: Context, contexB: Context) => {
                if (contextA.context_number > contexB.context_number) return -1;
                if (contextA.context_number < contexB.context_number) return 1;
                return 0;
            });
            switch (contextChoice) {
                case ContextChoice.ALL:
                    setFilteredContextIds(availableContexts.map((context: Context) => context.id));
                    break;
                case ContextChoice.OPEN:
                    setFilteredContextIds(availableContexts.filter((context: Context) => (context.opening_date != null && context.closing_date == null)).map((context: Context) => context.id));
                    break;
                case ContextChoice.UNUSED:
                    setFilteredContextIds(availableContexts.filter((context: Context) => (context.opening_date == null && context.closing_date == null)).map((context: Context) => context.id));
                    break;
                case ContextChoice.CLOSED:
                    setFilteredContextIds(availableContexts.filter((context: Context) => (context.opening_date != null && context.closing_date != null)).map((context: Context) => context.id));
                    break;
                default:
                    setFilteredContextIds(availableContexts.map((context: Context) => context.id));
            }
        }
    }, [contextChoice, contextIds, contextIdToContextMap]);

    return (
        <ScrollView style={{padding: "5%"}}>
            <ButtonComponent
                buttonStyle={{width: "60%", height: "auto", alignSelf: "center"}}
                onPress={async () => {
                    const selectedArea: SpatialArea = spatialAreaIdToSpatialAreaMap.get(selectedAreaId);
                    if (selectedArea == null) {
                        return
                    }
                    let contextId: string = await createContext(selectedArea)(dispatch);
                    props.navigation.navigate("ContextDetailScreen", {
                        contextId: contextId,
                        contextString: props.navigation.getParam("areaString") + "." + contextId
                    });
                }
                }
                textStyle={{padding: "4%"}}
                text={"Create Context"}
                rounded={true}
            />
            {allLoaded && <RowView>
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
            </RowView>}
            {loading && <LoadingComponent containerStyle={{margin: "auto"}}/>}
            <PaddingComponent/>
            {filteredContextIds.length === 0 ?
                <Text style={{padding: "5%", alignSelf: "center"}}>
                    No Contexts available for current selection
                </Text> :
                <FlatList data={filteredContextIds} extraData={contextIdToContextMap}
                          renderItem={({item, index}) => {
                              const context = contextIdToContextMap.get(item);
                              if (context == null) {
                                  return <LoadingComponent/>;
                              }
                              return (<TouchableOpacity
                                  onPress={() => {
                                      dispatch(setSelectedContextId(item));
                                      props.navigation.navigate("ContextDetailScreen", {
                                          contextId: item,
                                          contextString: props.navigation.getParam("areaString") + "." + context.context_number
                                      });
                                  }}>
                                  <View>
                                      <RowView>
                                          <Text style={{fontWeight: "bold"}}>
                                              Context Number
                                          </Text>
                                          <Text>
                                              {context.context_number}
                                          </Text>
                                      </RowView>
                                      <PaddingComponent vertical="2%"/>
                                      <RowView>
                                          <Text style={{fontWeight: "bold"}}>
                                              Type
                                          </Text>
                                          <Text>
                                              {context.type == null ? "Unset" : context.type}
                                          </Text>
                                      </RowView>
                                      <RowView>
                                          <Text style={{fontWeight: "bold"}}>
                                              Opening Date
                                          </Text>
                                          {/*<Text>*/}
                                          {/*    {context.opening_date == null ? "Unset" : getFormattedDate(context.opening_date)}*/}
                                          {/*</Text>*/}
                                          <Text>
                                              {renderDate(context.opening_date)}
                                          </Text>
                                      </RowView>
                                      <RowView>
                                          <Text style={{fontWeight: "bold"}}>
                                              Closing Date
                                          </Text>
                                          {/*<Text>*/}
                                          {/*    {context.closing_date == null ? "Unset" : getFormattedDate(context.closing_date)}*/}
                                          {/*</Text>*/}
                                          <Text>
                                              {renderDate(context.closing_date)}
                                          </Text>
                                      </RowView>
                                      <PaddingComponent vertical="2%"/>
                                      <Divider/>
                                      <PaddingComponent vertical="2%"/>
                                  </View>
                              </TouchableOpacity>);
                          }
                          }/>}
        </ScrollView>
    );
}

ContextListScreen.navigationOptions = screenProps => ({
    title: "Context List: " + (screenProps.navigation.getParam("areaString"))
});

export default ContextListScreen;
