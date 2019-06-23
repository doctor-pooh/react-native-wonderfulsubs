import React from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { NavigationEvents } from "react-navigation";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import * as actions from "../redux-store/actions";
import { StateProvider } from "./context";
import { EpisodeList, SeasonList } from "./views";

const winSize = Dimensions.get("window");

interface Props {
  navigation: any;
  shows: {
    isFetching: boolean;
  };
  fetchSeasonData(target: {showId: string}): AnyAction;
}

const EpisodeLayout = (props: Props) => {
  const {
    navigation,
    fetchSeasonData,
    shows: { isFetching }
  } = props;

  return (
    <View>
      <NavigationEvents
        onWillFocus={({
          state: {
            params: { showId }
          }
        }) => {
          fetchSeasonData({ showId });
        }}
      />
      <StateProvider>
        {isFetching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator style={styles.loadingIndicator} size="large" color="#ff9900" />
          </View>
        ) : (
          <View style={styles.container}>
            <SeasonList style={styles.seasonContainer} />
            <EpisodeList style={styles.episodeContainer} />
          </View>
        )}
      </StateProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  seasonContainer: {
    width: 130
  },
  episodeContainer: {
    width: winSize.width - 130
  },
  loadingContainer: {
    width: winSize.width,
    height: winSize.height
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%"
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
)(EpisodeLayout);
