import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import * as actions from "../redux-store/actions";
import { Player, PlayerPopover } from "./views";
import { Animated, View, StyleSheet } from "react-native";
import KeepAwake from "react-native-keep-awake";
import { VideoProgressPopup, VideoNextEpisodePopup } from "./components";
import { findEpisode } from "../show-utils";
import { Show, Episode } from "src/types";
import { RemoteInput } from "./hoc";
import { StateProvider } from "./context";

interface Props {
  navigation: any;
  shows: {
    showData: Show;
  };
  fetchNextEpisode(current: {
    showId: string;
    seasonId: string;
    episodeId: string;
  }): AnyAction;
}

class PlayerLayout extends Component<Props> {
  componentDidMount() {
    KeepAwake.activate();
  }
  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  playerRef = React.createRef();
  popoverRef = React.createRef<PlayerPopover>();

  render() {
    const {
      navigation,
      fetchNextEpisode,
      shows: { showData }
    } = this.props;

    const uri: string = navigation.getParam(
      "uri",
      "http://mirrors.standaloneinstaller.com/video-sample/jellyfish-25-mbps-hd-hevc.mp4"
    );
    const showId: string = navigation.getParam("showId");
    const seasonId: string = navigation.getParam("seasonId");
    const episodeId: string = navigation.getParam("episodeId");

    const episode = findEpisode({ episodeId, seasonId, show: showData });

    return (
      <View style={styles.container}>
        <StateProvider>
          <Player
            showId={showId}
            seasonId={seasonId}
            episodeId={episodeId}
            popoverRef={this.popoverRef}
            uri={uri}
            innerRef={this.playerRef}
            navigation={navigation}
          />
          <PlayerPopover ref={this.popoverRef} />
          <RemoteInput
            popoverRef={this.popoverRef}
            playerRef={this.playerRef}
            episode={episode}
          />
        </StateProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
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
)(PlayerLayout);
