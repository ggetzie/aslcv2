import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {Divider} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {renderDate} from '../constants/utilityFunctions';
import {SpatialContext} from '../constants/EnumsAndInterfaces/ContextInterfaces';
import {RowView} from './general/RowView';
import {PaddingComponent} from './PaddingComponent';
import {AslReducerState} from '../../redux/reducer';
import {
  SET_SELECTED_SPATIAL_CONTEXT,
  SET_SELECTED_CONTEXT_ID,
} from '../../redux/reducerAction';

const SpatialContextCell = ({
  spatialContext,
}: {
  spatialContext: SpatialContext;
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const selectedSpatialContext = useSelector(
    ({reducer}: {reducer: AslReducerState}) => reducer.selectedSpatialContext,
  );
  const isSelected =
    selectedSpatialContext === null
      ? false
      : selectedSpatialContext.id === spatialContext.id;
  return (
    <TouchableOpacity
      onPress={() => {
        if (isSelected) {
          dispatch({type: SET_SELECTED_CONTEXT_ID, payload: null});
          dispatch({type: SET_SELECTED_SPATIAL_CONTEXT, payload: null});
        } else {
          dispatch({
            type: SET_SELECTED_SPATIAL_CONTEXT,
            payload: spatialContext,
          });
          dispatch({type: SET_SELECTED_CONTEXT_ID, payload: spatialContext.id});
          // @ts-ignore
          navigation.navigate('ContextDetailScreen');
        }
      }}>
      <View>
        <RowView>
          <Text style={{fontWeight: 'bold'}}>Context Number</Text>
          <Text>{spatialContext.context_number}</Text>
        </RowView>
        <PaddingComponent vertical="2%" />
        <RowView>
          <Text style={{fontWeight: 'bold'}}>Type</Text>
          <Text>
            {spatialContext.type == null ? 'Unset' : spatialContext.type}
          </Text>
        </RowView>
        <RowView>
          <Text style={{fontWeight: 'bold'}}>Opening Date</Text>
          <Text>
            {spatialContext.opening_date == null
              ? 'Unset'
              : spatialContext.opening_date}
          </Text>
        </RowView>
        <RowView>
          <Text style={{fontWeight: 'bold'}}>Closing Date</Text>
          <Text>
            {spatialContext.closing_date == null
              ? 'Unset'
              : spatialContext.closing_date}
          </Text>
          <Text>{renderDate(spatialContext.closing_date)}</Text>
        </RowView>
        <PaddingComponent vertical="2%" />
        <Divider />
        <PaddingComponent vertical="2%" />
      </View>
    </TouchableOpacity>
  );
};

export default SpatialContextCell;
