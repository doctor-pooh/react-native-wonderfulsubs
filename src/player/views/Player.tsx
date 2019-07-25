import React, { Component } from "react";
import { StyleSheet } from "react-native";
import VideoPlayer from "react-native-video";
import { mapValues } from 'lodash';
import * as actions from "../../redux-store/actions";
import { StateContext } from "../context";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { Episode, Show, Source } from "../../types";
import { PlayerPopover } from ".";
import * as behavior from './behavior';

interface Props {
  shows: {
    showData: Show;
  };
  navigation: any;
  showId: string;
  seasonId: string;
  episodeId: string;
  episode: Episode;
  source: Source;
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
  };
  render() {
    const [state] = this.context;
    const {
      video: { paused }
    } = state;
    const {
      uri,
      innerRef
    } = this.props;

    return (
      <VideoPlayer
        source={{
          uri
        }}
        bufferConfig={{
          bufferForPlaybackMs: 500
        }}
        style={styles.backgroundVideo}
        paused={paused}
        ref={innerRef}
        {...mapValues(behavior, fn => fn.bind(this))}
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
    zIndex: 500,
    backgroundColor: "black"
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
