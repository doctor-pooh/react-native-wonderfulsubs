import React from "react";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";
import * as actions from "../redux-store/actions";
import { ShowList, ShowHeader } from "./views";
import { StateProvider } from "./context";

interface Props {
  navigation: any;
  reduxNavigation: {
    index: number;
  };
  initializeShows(category: string): AnyAction;
}

const ShowsLayout = (props: Props) => {
  const { navigation, reduxNavigation, initializeShows } = props;
  const category = navigation.getParam(
    "category",
    global.__provider().categories[0].type
  );

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => {
          if (category) {
            initializeShows(category);
          }
        }}
      />
      <StateProvider>
        <ShowHeader
          category={category}
          style={styles.footer}
          navigation={navigation}
        />
        <ShowList category={category} navigation={navigation} />
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
