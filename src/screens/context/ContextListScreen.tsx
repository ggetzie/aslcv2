import * as React from 'react';
import {useEffect, useState} from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {StackScreenProps} from '@react-navigation/stack';
import {RowView} from '../../components/general/RowView';
import {PaddingComponent} from '../../components/PaddingComponent';
import {verticalScale} from '../../constants/nativeFunctions';
import {useDispatch, useSelector} from 'react-redux';
import {AslReducerState} from '../../../redux/reducer';
import {getContextsForArea, createContext} from '../../constants/backend_api';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import {SpatialArea} from '../../constants/EnumsAndInterfaces/SpatialAreaInterfaces';
import {
  SpatialContext,
  ContextChoice,
} from '../../constants/EnumsAndInterfaces/ContextInterfaces';
import {ScreenColors} from '../../constants/EnumsAndInterfaces/AppState';
import {ContextStackParamList} from '../../../navigation';
import SpatialContextList from '../../components/SpatialContextList';
import LoadingBar from '../../components/LoadingBar';
import {
  getSpatialString,
  filterSpatialContextByChoice,
} from '../../constants/utilityFunctions';

const LOADING_MESSAGES = {
  loading: 'Fetching spatial contexts from server...',
  creating: 'Creating spatial context...',
};

type Props = StackScreenProps<ContextStackParamList, 'ContextListScreen'>;

const ContextListScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();

  const [spatialContexts, setSpatialContexts] = useState<SpatialContext[]>([]);

  const selectedArea: SpatialArea = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedSpatialArea,
  );

  const spatialString = getSpatialString(selectedArea, null);

  const [contextChoice, setContextChoice] = useState<ContextChoice>(
    ContextChoice.ALL,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    LOADING_MESSAGES.loading,
  );

  async function getSpatialContexts() {
    const newSpatialContexts = await getContextsForArea(selectedArea);
    setSpatialContexts(
      newSpatialContexts.sort(
        (a: SpatialContext, b: SpatialContext) =>
          b.context_number - a.context_number,
      ),
    );
  }

  useEffect(() => {
    if (selectedArea == null) {
      return;
    }
    setLoading(true);
    setLoadingMessage(LOADING_MESSAGES.loading);
    getSpatialContexts().then(() => setLoading(false));
  }, [selectedArea]);

  useEffect(() => {
    // set title
    navigation.setOptions({
      title: `Area: ${spatialString}`,
    });
  }, [navigation, spatialString]);

  return (
    <ScrollView style={styles.background}>
      <ButtonComponent
        buttonStyle={{width: '60%', height: 'auto', alignSelf: 'center'}}
        onPress={async () => {
          if (selectedArea == null) {
            return;
          }
          setLoading(true);
          setLoadingMessage(LOADING_MESSAGES.creating);
          try {
            const newSpatialContext: SpatialContext = await createContext(
              selectedArea,
            );
            console.log('created new spatial context', newSpatialContext);
            setSpatialContexts([newSpatialContext, ...spatialContexts]);
            setLoading(false);
          } catch (e) {
            console.log('error creating spatial context', e);
            setLoading(false);
          }
        }}
        textStyle={{padding: '4%'}}
        text={'Create Context'}
        rounded={true}
      />
      <RowView>
        <Text
          style={{
            fontSize: verticalScale(20),
            width: '50%',
          }}>
          Show
        </Text>
        <Picker
          style={{
            width: '50%',
            paddingHorizontal: '5%',
          }}
          selectedValue={contextChoice}
          onValueChange={(value: ContextChoice, pos) =>
            setContextChoice(value)
          }>
          <Picker.Item label="All" value={ContextChoice.ALL} />
          <Picker.Item label="Open" value={ContextChoice.OPEN} />
          <Picker.Item label="Unused" value={ContextChoice.UNUSED} />
          <Picker.Item label="Closed" value={ContextChoice.CLOSED} />
        </Picker>
      </RowView>
      <PaddingComponent />
      {loading ? (
        <LoadingBar message={loadingMessage} />
      ) : (
        <SpatialContextList
          spatialContexts={spatialContexts.filter((context) =>
            filterSpatialContextByChoice(context, contextChoice),
          )}
          onSelect={() => {
            navigation.navigate('ContextDetailScreen');
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: ScreenColors.SELECTING_CONTEXT,
    padding: '5%',
  },
});
export default ContextListScreen;
