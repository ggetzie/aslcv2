import * as React from 'react';
import {Component} from 'react';
import {Platform, StatusBar} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {rootNavigator} from "./navigation/AppNavigator";
import {Provider} from 'react-redux';
import createStore from './redux/store';
import {getJwtFromAsyncStorage} from "./src/constants/utilityFunctions";
import {LoadingComponent} from "./src/components/general/LoadingComponent";

interface Props {
}

interface State {
  loading: boolean;
  isSignedIn: boolean;
}

export default class App extends Component<Props, State> {

  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      loading: true,
      isSignedIn: false
    };

  }

  async componentDidMount(): Promise<void> {
    console.disableYellowBox = true;
    const token: string = await getJwtFromAsyncStorage();
    if (token != null && token.trim().length !== 0) {
      try {
        this.setState({
          isSignedIn: true
        });
      } catch (error) {
        console.warn(error);
      }
    }
    this.setState({
      loading: false
    });
  }

  render() {
    if (this.state.loading) {
      return <LoadingComponent/>;
    }

    const Layout = createAppContainer(rootNavigator(this.state.isSignedIn));
    return (
        <Provider store={createStore}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content"/>}
          <Layout/>
        </Provider>
    );
  }
}
