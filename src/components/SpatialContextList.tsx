import React from 'react';
import {View, Text} from 'react-native';
import {SpatialContext} from '../constants/EnumsAndInterfaces/ContextInterfaces';
import SpatialContextCell from './SpatialContextCell';

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

export default SpatialContextList;
