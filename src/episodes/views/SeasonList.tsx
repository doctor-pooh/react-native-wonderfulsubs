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
  FlatList,
  Text
} from "react-native";
import * as actions from "../../redux-store/actions";
import { SeasonItem } from "../components";
import { Show } from "../../types";
import { useStateValue } from "../context";

interface Props {
  shows?: {
    isFetching: boolean;
    showData: Show;
  };
  style: object;
}

const SeasonList = (props: Props) => {
  const [state, dispatch] = useStateValue();
  const { shows, style = {} } = props;
  const { selectedSeason } = state;
  const { showData, isFetching } = shows;

  const setSelectedSeason = id => {
    dispatch({
      type: "SET_SELECTED_SEASON",
      payload: id
    });
  };

  const seasonData = (showData && showData.seasons) || [];

  const seasonDataWithKey = seasonData.map(season => ({
    ...season,
    key: `${season.id}`
  }));

  const selectedSeasonData = seasonData[selectedSeason];

  const seasonItemRenderer = ({ item }) => (
    <SeasonItem
      key={item.id}
      title={item.seasonName}
      selected={item.id === selectedSeason}
      onPress={() => setSelectedSeason(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {selectedSeasonData ? <Text style={styles.text}>{selectedSeasonData.type}</Text> : <View />}
      <FlatList
        data={seasonDataWithKey}
        renderItem={seasonItemRenderer}
        numColumns={1}
        style={{ ...styles.scrollOuterContainer, ...style }}
        contentContainerStyle={styles.scrollInnerContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollInnerContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    marginTop: 20
  },
  scrollOuterContainer: {},
  container: {
    paddingTop: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(30,30,25)",
    elevation: 2
  },
  text: {
    color: "white",
    fontSize: 20
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
