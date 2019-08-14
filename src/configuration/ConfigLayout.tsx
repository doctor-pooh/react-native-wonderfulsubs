import React from "react";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";
import * as actions from "../redux-store/actions";
import { ConfigurationHeader, ConfigurationBody } from "./views";
import { StateProvider } from "./context";

interface Props {
  navigation: any;
  reduxNavigation: {
    index: number;
  };
  initializeShows(category: string): AnyAction;
}

const ShowsLayout = (props: Props) => {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <StateProvider>
        <ConfigurationHeader
          navigation={navigation}
        />
        <ConfigurationBody />
      </StateProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(36,36,33)"
  },
  footer: {}
});

const mapDispatchToProps = {
  ...actions
};

const mapStateToProps = state => ({
  reduxNavigation: state.navigation
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowsLayout);
