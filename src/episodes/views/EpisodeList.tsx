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
  ActivityIndicator,
  FlatList
} from "react-native";
import { NavigationEvents } from "react-navigation";
import * as actions from "../../redux-store/actions";
import { EpisodeItem } from "../components";
import { Show, Episode } from "../../types";
import { useStateValue } from "../context";
import { TopActionBar } from "./TopActionBar";

interface Props {
  navigation: any;
  showId: number;
  shows: {
    isFetching: boolean;
    showData: Show;
  };
  fetchSourceData(target: {
    showId: string;
    seasonId: number;
    episodeId: number;
  }): AnyAction;
  style?: object;
}

const EpisodeList = (props: Props) => {
  const [state, dispatch] = useStateValue();
  const { shows, style = {}, fetchSourceData } = props;
  const { selectedSeason, episodesWatched } = state;
  const { showData, isFetching } = shows;
  const getWatchedEpisodes = () => {
    (async () => {
      if (
        showData.id &&
        selectedSeason != undefined &&
        episodesWatched === undefined
      ) {
        const episodesWatchedData = await global
          .__settings()
          .getEpisodesWatched({
            showId: showData.id,
            seasonId: selectedSeason
          });
        dispatch({
          type: "SET_EPISODES_WATCHED",
          payload: episodesWatchedData
        });
      }
    })();
  };

  const episodeData =
    (showData &&
      showData.seasons &&
      showData.seasons[selectedSeason] &&
      showData.seasons[selectedSeason].episodes) ||
    [];

  let topBar: Episode;
  return (
    <View>
      <NavigationEvents
        onWillFocus={() => {
          getWatchedEpisodes();
        }}
      />
      <FlatList
        data={[
          { ...topBar, key: "topBar" },
          ...episodeData.map(episode => ({
            ...episode,
            key: `${episode.id}`
          }))
        ]}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return <TopActionBar show={showData} />;
          } else {
            return (
              <EpisodeItem
                key={item.id}
                title={item.name}
                description={item.description}
                episodeNumber={item.episodeNumber}
                imageSource={item.picture}
                watched={episodesWatched && episodesWatched[item.id]}
                onPress={() =>
                  fetchSourceData({
                    showId: showData.id,
                    seasonId: selectedSeason,
                    episodeId: item.id
                  })
                }
              />
            );
          }
        }}
        maxToRenderPerBatch={80}
        numColumns={1}
        style={{ ...styles.scrollOuterContainer, ...style }}
        contentContainerStyle={styles.scrollInnerContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollInnerContainer: {
    marginBottom: 10,
    paddingBottom: 5
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
)(EpisodeList);
