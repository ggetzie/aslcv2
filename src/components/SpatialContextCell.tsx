import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {Divider} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {renderDate} from '../constants/utilityFunctions';
import {SpatialContext} from '../constants/EnumsAndInterfaces/ContextInterfaces';
import {RowView} from './general/RowView';
import {PaddingComponent} from './PaddingComponent';
import {AslReducerState} from '../../redux/reducer';
import {SET_SELECTED_SPATIAL_CONTEXT} from '../../redux/reducerAction';

const SpatialContextCell = ({
  spatialContext,
  onSelect,
}: {
  spatialContext: SpatialContext;
  onSelect: () => void;
}) => {
  const dispatch = useDispatch();
  const selectedSpatialContextId = useSelector(
    ({reducer}: {reducer: AslReducerState}) =>
      reducer.selectedSpatialContext ? reducer.selectedSpatialContext.id : '',
  );
  const isSelected = selectedSpatialContextId === spatialContext.id;
  return (
    <TouchableOpacity
      onPress={() => {
        if (isSelected) {
          dispatch({type: SET_SELECTED_SPATIAL_CONTEXT, payload: null});
        } else {
          dispatch({
            type: SET_SELECTED_SPATIAL_CONTEXT,
            payload: spatialContext,
          });
          onSelect();
        }
      }}>
      <View style={isSelected ? styles.selected : {}}>
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

const styles = StyleSheet.create({
  selected: {
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 10,
  },
});

export default SpatialContextCell;
