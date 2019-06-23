import React, { Component } from "react";
import { Provider } from "react-redux";
import { useScreens } from "react-native-screens";
import { WonderfulSubs } from "./provider/wonderfulsubs";
import { Provider as ProviderAbstract } from "./provider/providerAbstract";
import { Alert } from "react-native";
import { buildStore } from "./store";
import settingsController from "./settings/settings";

useScreens();
const settings = settingsController();

const provider = new WonderfulSubs(settings);

global.__provider = (): ProviderAbstract => provider;
const router = require("./router");
const { RouterComponent, navReducer } = router;
const store = buildStore(navReducer);

export default class App extends Component {

  static getDerivedStateFromError(error) {
    Alert.alert('Unexpected error occurred',
    `
    Error: ${error}
    `
    );
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    Alert.alert('Unexpected error occurred',
    `
    Error: ${error}
    ${info}
    `
    );
  }
  render() {
    return (
      <Provider store={store}>
        <RouterComponent />
      </Provider>
    );
  }
}
