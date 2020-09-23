import * as React from "react";
import {NavigationScreenComponent} from "react-navigation";
import {Text, View} from "react-native";
import {LogoutButton} from "../../components/LogoutButton";

const HomeScreen: NavigationScreenComponent<any, any> = (props) => {
  return (
      <View>
          <Text>
              Home Screen goes here...
          </Text>
          <LogoutButton navigation={props.navigation}/>
      </View>
  )
};

HomeScreen.navigationOptions = screenProps => ({
    title: 'Home',
    headerLeft: () => null
});

export default HomeScreen;
