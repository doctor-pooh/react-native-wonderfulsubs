/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  FlatList
} from "react-native";
import { StackActions } from "react-navigation";
import { debounce } from "lodash";
import * as actions from "../../redux-store/actions";
import { SeasonItem } from "../components";
import { Show } from "../../types";
import { DISPLAY_CONST, DATA_CONST } from "../../constants";
import { useStateValue } from "../context";

interface Props {
  navigation: any;
  showId: number;
  shows: {
    isFetching: boolean;
    showData: Show;
  };
  style: object;
}

const SeasonList = (props: Props) => {
  const [state, dispatch] = useStateValue();
  const { navigation, showId, shows, style = {} } = props;
  const { showData, isFetching } = shows;

  const playVideo = async source => {
    console.log(source);
    navigation.dispatch(
      StackActions.push({
        routeName: "Player",
        params: { uri: source.src }
      })
    );
  };

  const seasonData = [
    { id: 1, seasonNumber: 1, selected: true },
    { id: 2, seasonNumber: 2 },
    { id: 3, seasonNumber: 3 }
  ];
  // (showData &&
  //   showData.seasons) ||
  // [];

  const seasonDataWithKey = seasonData.map(season => ({
    ...season,
    key: `${season.id}`
  }));

  const seasonItemRenderer = ({ item }) => (
    <SeasonItem
      key={item.id}
      title={`Season ${item.seasonNumber}`}
      selected={item.selected}
      onFocus={() => console.log("focused", item.id)}
      onPress={() => console.log("pressed", item.id)}
    />
  );

  return (
    <FlatList
      data={seasonDataWithKey}
      renderItem={seasonItemRenderer}
      numColumns={1}
      style={{ ...styles.scrollOuterContainer, ...style }}
      contentContainerStyle={styles.scrollInnerContainer}
    />
  );
};

const styles = StyleSheet.create({
  scrollInnerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    marginTop: 32
  },
  scrollOuterContainer: {},
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "rgb(36,36,33)"
  },
  infiniteScrollingContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40
  }
});

const mapDispatchToProps = {
  ...actions
};

const mapStateToProps = state => ({
  shows: state.shows
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeasonList);
