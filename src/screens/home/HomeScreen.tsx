import * as React from "react";
import {NavigationScreenComponent} from "react-navigation";
import {Text, View} from "react-native";

const HomeScreen: NavigationScreenComponent<any, any> = (props) => {
  return (
      <View>
          <Text>
              Home Screen goes here...
          </Text>
      </View>
  )
};

HomeScreen.navigationOptions = screenProps => ({
    title: 'Home',
    headerLeft: () => null
});

export default HomeScreen;
