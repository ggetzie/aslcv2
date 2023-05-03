import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ContextListScreen from '../src/screens/context/ContextListScreen';
import ContextDetailScreen from '../src/screens/context/ContextDetailScreen';

const ContextStack = createStackNavigator();

const ContextNavigator = () => {
  return (
    <ContextStack.Navigator>
      <ContextStack.Screen
        name="ContextListScreen"
        component={ContextListScreen}
      />
      <ContextStack.Screen
        name="ContextDetailScreen"
        component={ContextDetailScreen}
      />
    </ContextStack.Navigator>
  );
};

// const ContextScreenStack = createStackNavigator(
//   {
//     ContextListScreen: ContextListScreen,
//     ContextDetailScreen: ContextDetailScreen,
//   },
//   {
//     navigationOptions: {
//       tabBarIcon: ({focused}) => {
//         return (
//           <StateDependentTabIcon
//             focused={focused}
//             icon={ContextBottomNav}
//             showState={[AppState.SELECTING_CONTEXT, AppState.CONTEXT_SCREEN]}
//           />
//         );
//       },
//       tabBarOnPress: ({defaultHandler}) => {
//         if (
//           [AppState.SELECTING_CONTEXT, AppState.CONTEXT_SCREEN].includes(
//             getAppState(),
//           )
//         ) {
//           return defaultHandler();
//         }
//         return null;
//       },
//     },
//     defaultNavigationOptions: defaultNavOptions,
//   },
// );

export default ContextNavigator;
