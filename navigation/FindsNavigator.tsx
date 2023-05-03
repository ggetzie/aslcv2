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
      />
    </FindsStack.Navigator>
  );
};
// const FindsBagPhotosScreenStack = createStackNavigator(
//   {
//     FindsBagPhotosScreen: FindsBagPhotosScreen,
//     // Other screens go here
//   },
//   {
//     navigationOptions: {
//       tabBarIcon: ({focused}) => (
//         <StateDependentTabIcon
//           focused={focused}
//           icon={FindBagPhotosBottomNav}
//           showState={[AppState.CONTEXT_SCREEN]}
//         />
//       ),
//       tabBarOnPress: ({defaultHandler}) => {
//         if (getAppState() == AppState.CONTEXT_SCREEN) {
//           return defaultHandler();
//         }
//         return null;
//       },
//     },
//     defaultNavigationOptions: defaultNavOptions,
//   },
// );

export default FindsNavigator;
