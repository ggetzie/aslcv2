import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FindsBagPhotosScreen from '../src/screens/finds_bag_photos/FindsBagPhotosScreen';

const FindsStack = createStackNavigator();

const FindsNavigator = () => {
  return (
    <FindsStack.Navigator>
      <FindsStack.Screen
        name="FindsBagPhotosScreen"
        component={FindsBagPhotosScreen}
        options={{title: 'Finds Bag Photos'}}
      />
    </FindsStack.Navigator>
  );
};

export default FindsNavigator;
