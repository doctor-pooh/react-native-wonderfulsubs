import React, { Component } from "react";
import { StyleSheet, View, Text, Animated, Dimensions } from "react-native";
import VideoPlayer from "react-native-video";
import * as actions from "../../redux-store/actions";
import * as reactActions from "../actions";
import { StateContext } from "../context";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { Episode, Show } from "../../types";
import { StackActions } from "react-navigation";
import { findNextEpisode } from "../../show-utils";
import { PlayerPopover } from ".";

interface Props {
  shows: {
    showData: Show;
  };
  navigation: any;
  showId: string;
  seasonId: string;
  episodeId: string;
  uri: string;
  innerRef: any;
  popoverRef: React.RefObject<PlayerPopover>;
  fetchNextEpisode(current: {
    showId: string;
    seasonId: string;
    episodeId: string;
  }): AnyAction;
}

interface State {
  updatedWatchingStatus: boolean;
  nextEpisodePoppedUp: boolean;
}

class Player extends Component<Props, State> {
  static contextType = StateContext;
  state = {
    updatedWatchingStatus: false,
    nextEpisodePoppedUp: false
  }
  render() {
    let playerRef;
    const [state, dispatch] = this.context;
    const {
      player,
      video: { progress, duration, delta, paused }
    } = state;
    const { updatedWatchingStatus, nextEpisodePoppedUp} = this.state;
    const {
      showId,
      seasonId,
      episodeId,
      uri,
      innerRef,
      fetchNextEpisode,
      shows: { showData },
      navigation,
      popoverRef
    } = this.props;

    const setEpisodeWatched = watched => {
      (async () => {
        await global
          .__provider()
          .getSettings()
          .setEpisodeWatched({
            showId,
            seasonId,
            episodeId,
            finishedWatching: watched
          });
      })();
    };

    const playNextEpisode = () => {
      const { episode: nextEpisode, season: nextSeason } = findNextEpisode({
        seasonId,
        episodeId,
        show: showData
      });
      if (nextEpisode && nextSeason) {
        fetchNextEpisode({ showId, seasonId, episodeId });
      } else {
        navigation.dispatch(
          StackActions.pop({
            n: 1
          })
        );
      }
    };

    return (
      <VideoPlayer
        source={{
          uri
        }} // Can be a URL or a local file.
        style={styles.backgroundVideo}
        paused={paused}
        onLoad={({ duration }) => {
          dispatch(reactActions.setVideoFinished(false));
          dispatch(reactActions.setTimeDuration(duration));
          this
          setEpisodeWatched(false);
        }}
        onProgress={(progress: any) => {
          dispatch(reactActions.setTimeProgress(progress.currentTime));
          if (
            progress.currentTime / duration >= 0.9 &&
            !updatedWatchingStatus
          ) {
            setEpisodeWatched(true);
            this.setState({updatedWatchingStatus: true});
          }
          if (duration - progress.currentTime <= 15 && !nextEpisodePoppedUp) {
            const { episode: nextEpisode } = findNextEpisode({
              seasonId,
              episodeId,
              show: showData
            });
            popoverRef.current.displayPopup(
              {
                episodePopup: {
                  episode: nextEpisode,
                  topText: "Next up...",
                  showTimeLeft: true
                }
              },
              false
            );
            this.setState({nextEpisodePoppedUp: true});
          } else if (duration - progress.currentTime > 15 && nextEpisodePoppedUp) {
            popoverRef.current.dismissPopup();
            this.setState({nextEpisodePoppedUp: false});
          }
        }}
        onEnd={() => {
          dispatch(reactActions.setVideoFinished(true));
          popoverRef.current.dismissPopup();
          playNextEpisode();
        }}
        ref={innerRef}
      />
    );
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 500
  }
});

const PlayerForwarded = React.forwardRef((props: Props, ref) => {
  return <Player innerRef={ref} {...props} />;
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
)(PlayerForwarded);
