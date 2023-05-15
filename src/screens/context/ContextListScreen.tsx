import * as React from 'react';
import {useEffect, useState} from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {StackScreenProps} from '@react-navigation/stack';

import {RowView} from '../../components/general/RowView';
import {PaddingComponent} from '../../components/PaddingComponent';
import {LoadingComponent} from '../../components/general/LoadingComponent';
import {verticalScale} from '../../constants/nativeFunctions';
import {useDispatch, useSelector} from 'react-redux';
import {AslReducerState} from '../../../redux/reducer';
import {getContextsForArea} from '../../constants/backend_api';
import {createContext, getContexts} from '../../constants/backend_api_action';
import {ButtonComponent} from '../../components/general/ButtonComponent';
import {SpatialArea} from '../../constants/EnumsAndInterfaces/SpatialAreaInterfaces';
import {SpatialContext} from '../../constants/EnumsAndInterfaces/ContextInterfaces';
import {getSpatialArea} from '../../constants/backend_api';
import {setSelectedContextId} from '../../../redux/reducerAction';

import {ScreenColors} from '../../constants/EnumsAndInterfaces/AppState';
import {ContextStackParamList} from '../../../navigation';
import SpatialContextCell from '../../components/SpatialContextCell';
import LoadingBar from '../../components/LoadingBar';

enum ContextChoice {
  OPEN = 'OPEN',
  UNUSED = 'UNUSED',
  CLOSED = 'CLOSED',
  ALL = 'ALL',
}

const SpatialContextList = ({
  spatialContexts,
  onSelect,
}: {
  spatialContexts: SpatialContext[];
  onSelect: () => void;
}) => {
  if (spatialContexts.length === 0) {
    return <Text style={{padding: '5%'}}>No contexts available</Text>;
  }
  return (
    <>
      {spatialContexts.map((context) => (
        <SpatialContextCell
          key={context.id}
          spatialContext={context}
          onSelect={onSelect}
        />
      ))}
    </>
  );
};

const filterSpatialContextByChoice = (
  spatialContext: SpatialContext,
  choice: ContextChoice,
) => {
  switch (choice) {
    case ContextChoice.OPEN:
      return (
        spatialContext.opening_date !== null &&
        spatialContext.closing_date === null
      );
    case ContextChoice.UNUSED:
      return (
        spatialContext.opening_date === null &&
        spatialContext.closing_date === null
      );
    case ContextChoice.CLOSED:
      return spatialContext.closing_date !== null;
    case ContextChoice.ALL:
      return true;
  }
};

type Props = StackScreenProps<ContextStackParamList, 'ContextListScreen'>;

const ContextListScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();

  const [spatialContexts, setSpatialContexts] = useState<SpatialContext[]>([]);

  const selectedAreaId: string = useSelector(
    ({reducer}: {reducer: AslReducerState}) =>
      reducer.selectedSpatialArea ? reducer.selectedSpatialArea.id : null,
  );

  const selectedArea: SpatialArea = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedSpatialArea,
  );

  const [contextChoice, setContextChoice] = useState<ContextChoice>(
    ContextChoice.ALL,
  );
  const [loading, setLoading] = useState<boolean>(false);

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
    if (selectedAreaId == null) {
      return;
    }
    setLoading(true);
    console.log('loading contexts');
    getSpatialContexts().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    const title =
      selectedArea === null
        ? 'No Area Selected!'
        : `Area: ${selectedArea.utm_hemisphere}.${selectedArea.utm_zone}.${selectedArea.area_utm_easting_meters}.${selectedArea.area_utm_northing_meters}`;
    navigation.setOptions({
      title: title,
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.background}>
      <ButtonComponent
        buttonStyle={{width: '60%', height: 'auto', alignSelf: 'center'}}
        onPress={async () => {
          if (selectedArea == null) {
            return;
          }
          let contextId: string = await createContext(selectedArea)(dispatch);
          dispatch(setSelectedContextId(contextId));
          navigation.navigate('ContextDetailScreen');
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
        <LoadingBar message="Fetching spatial contexts from server..." />
      ) : (
        <SpatialContextList
          spatialContexts={spatialContexts.filter((context) =>
            filterSpatialContextByChoice(context, contextChoice),
          )}
          onSelect={() => {
            console.log('trying to navigate...');
            console.log(navigation);
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
