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
      "https://r6---sn-a5mlrn7r.googlevideo.com/videoplayback?expire=1562316703&ei=P7seXaf6EK6BsfIPqvu6gAM&ip=66.27.114.215&id=o-ALqDEgxfNyJs1qbYXYXTkoqHooYpujMOrakEjAPh7eVk&itag=18&source=youtube&requiressl=yes&mm=31%2C29&mn=sn-a5mlrn7r%2Csn-a5meknlz&ms=au%2Crdu&mv=m&mvi=5&pl=16&gcr=us&initcwndbps=1680000&mime=video%2Fmp4&gir=yes&clen=4608547&ratebypass=yes&dur=173.499&lmt=1560171973431603&mt=1562294954&fvip=6&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&lsparams=mm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AHylml4wRQIgZe8t6sVZA7qImyav-tERiabIfsVN0lIbrFtMMPwjTpACIQCaeSz3355ztmqrLmBCMRWOmYn4ji8wH0wNvkt6XKxOIQ%3D%3D&sig=ALgxI2wwRAIgYpi-PU0obnBH0TzNvVCaTjf47OSJ-9VkWHrOTYD56zkCICh8IFU9eOQtW6yrJ1_vdLpLOvbrXnfguaOzSQM5iJ4q"
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
