import React, { Component } from "react";
import { connect } from "react-redux";
import { createStackNavigator, createAppContainer } from "react-navigation";
import {
  createReduxContainer,
  createNavigationReducer
} from "react-navigation-redux-helpers";
import { StackActions } from "react-navigation";
import { BackHandler } from "react-native";
import { PlayerLayout } from "./player";
import { ShowsLayout } from "./shows";
import { EpisodesLayout } from "./episodes";
import { Configuration } from "./configuration";

const initialCategory = global.__provider().categories[0].type;

export const router = createStackNavigator(
  {
    Player: {
      screen: PlayerLayout
    },
    Shows: {
      screen: ShowsLayout
    },
    Episodes: {
      screen: EpisodesLayout
    },
    Settings: {
      screen: Configuration
    }
  },
  {
    cardStyle: { backgroundColor: "#242421", opacity: 1 },
    initialRouteName: "Shows",
    initialRouteKey: initialCategory,
    initialRouteParams: {
      category: initialCategory
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0
      },
      containerStyle: { backgroundColor: "transparent" },
      screenInterpolator: undefined
    }),
    headerMode: "none"
  }
);

const App = createReduxContainer(router);
const mapStateToProps = state => ({
  state: state.navigation
});
const NavigationRouterComponent = connect(mapStateToProps)(App);
//export const RouterComponent = createAppContainer(router);
class RouterComponentWrapper extends Component {
  backHandler;

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return this.handleBackButton();
    });
  }

  handleBackButton = () => {
    const { dispatch, state: navigation } = this.props;
    if (navigation.index > 0) {
      dispatch(
        StackActions.pop({
          n: 1
        })
      );
      return true;
    }
    return false;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return <NavigationRouterComponent />;
  }
}

const mapDispatchToProps = dispatch => ({ dispatch });

export const RouterComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(RouterComponentWrapper);

export const navReducer = createNavigationReducer(router);
