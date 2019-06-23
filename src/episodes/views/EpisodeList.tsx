import React from "react";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import { NavigationEvents } from "react-navigation";
import * as actions from "../../redux-store/actions";
import { EpisodeItem } from "../components";
import { Show, Episode } from "../../types";
import { useStateValue } from "../context";
import { TopActionBar } from "./TopActionBar";

interface Props {
  shows?: {
    isFetching: boolean;
    showData: Show;
  };
  fetchSourceData?(target: {
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

  const episodeData =
    (showData &&
      showData.seasons &&
      showData.seasons[selectedSeason] &&
      showData.seasons[selectedSeason].episodes) ||
    [];

  let lastWatchedEpisodeIndex = undefined;
  const episodeList = episodeData.map((episode, index) => {
    if (episode.watched) {
      lastWatchedEpisodeIndex = index;
    }
    return {
      ...episode,
      key: `${episode.id}`
    };
  });

  let focusedEpisodeId = undefined;
  if (episodeList.length > 0) {
    if (
      lastWatchedEpisodeIndex &&
      lastWatchedEpisodeIndex < episodeList.length - 1
    ) {
      focusedEpisodeId = episodeList[lastWatchedEpisodeIndex + 1].id;
    } else {
      focusedEpisodeId = episodeList[0].id;
    }
  }

  let topBar: Episode;
  return (
    <View>
      <FlatList
        data={[{ ...topBar, key: "topBar" }, ...episodeList]}
        removeClippedSubviews={false}
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
                watched={item.watched}
                preferredFocus={item.id === focusedEpisodeId}
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
