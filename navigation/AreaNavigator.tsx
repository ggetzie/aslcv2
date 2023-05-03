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
      />
    </AreaStack.Navigator>
  );
};

// const AreaScreenStack = createStackNavigator(
//   {
//     SpatialAreaSelectScreen: SpatialAreaSelectScreen,
//     SelectFromListScreen: SelectFromListScreen,
//     // Other screens go here
//   },
//   {
//     navigationOptions: {
//       tabBarIcon: ({focused}) => (
//         <Image
//           style={[
//             styles.bottomImage,
//             {tintColor: focused ? nativeColors.iconBrown : nativeColors.grey},
//           ]}
//           resizeMode={'contain'}
//           source={HomeBottomNav}
//         />
//       ),
//       defaultNavigationOptions: defaultNavOptions,
//     },
//   },
// );

export default AreaNavigator;
