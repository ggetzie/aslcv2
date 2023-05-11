import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SpatialAreaSelectScreen from '../src/screens/area/SpatialAreaSelectScreen';
import SelectFromListScreen from '../src/screens/area/SelectFromListScreen';

const AreaStack = createStackNavigator();

const AreaNavigator = () => {
  return (
    <AreaStack.Navigator>
      <AreaStack.Screen
        name="SpatialAreaSelectScreen"
        component={SpatialAreaSelectScreen}
        options={{title: 'Select a Spatial Area'}}
      />
      <AreaStack.Screen
        name="SelectFromListScreen"
        component={SelectFromListScreen}
        options={{title: 'Select'}}
      />
    </AreaStack.Navigator>
  );
};

export default AreaNavigator;
