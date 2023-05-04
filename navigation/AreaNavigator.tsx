import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SpatialAreaSelectScreen from '../src/screens/area/SpatialAreaSelectScreen';

const AreaStack = createStackNavigator();

const AreaNavigator = () => {
  return (
    <AreaStack.Navigator>
      <AreaStack.Screen
        name="SpatialAreaSelectScreen"
        component={SpatialAreaSelectScreen}
        options={{title: 'Select a Spatial Area'}}
      />
    </AreaStack.Navigator>
  );
};

export default AreaNavigator;
