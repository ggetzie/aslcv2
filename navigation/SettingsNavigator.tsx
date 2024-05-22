import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SettingsScreen from '../src/screens/settings/SettingsScreen';

const SettingsStack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
    </SettingsStack.Navigator>
  );
};

// const SettingsScreenStack = createStackNavigator(
//   {
//     SettingsScreen: SettingsScreen,
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
//           source={SettingsBottomNav}
//         />
//       ),
//     },
//     defaultNavigationOptions: defaultNavOptions,
//   },
// );

export default SettingsNavigator;
