import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { StyleSheet, View, Text, Animated, Dimensions } from "react-native";
import KeepAwake from "react-native-keep-awake";
import Icon from "react-native-vector-icons/FontAwesome";
import VideoPlayer from "react-native-video";
import { FirestickKeys } from "../components";
import * as actions from "../redux-store/actions";
import { findNextEpisode } from "../show-utils";
import { Show } from "../types";
import { StackActions } from "react-navigation";

const prettyTime = duration =>
  new Date(1000 * duration)
    .toISOString()
    .substr(11, 8)
    .replace(/^(00:0)|^(00:)/, "");
interface VideoProps {
  duration: number;
  currentTime: number;
}
const VideoProgress = (props: VideoProps) => {
  const { duration, currentTime } = props;
  const widthPercentage = (currentTime / duration) * 100;
  const prettyCurrentTime = prettyTime(currentTime);
  const prettyDuration = prettyTime(duration);
  return (
    <View style={styles2.videoProgressContainer}>
      <View
        style={{
          ...styles2.videoProgress,
          width: `${widthPercentage > 0 ? widthPercentage : 0.1}%`
        }}
      />
      <View style={styles2.videoProgressTimeContainer}>
        <Text style={styles2.videoProgressTimeText}>{prettyCurrentTime}</Text>
        <Text style={styles2.videoProgressTimeText}>{prettyDuration}</Text>
      </View>
    </View>
  );
};

const styles2 = StyleSheet.create({
  videoProgress: {
    backgroundColor: "rgba(255,0,0,0.5)",
    height: 4,
    alignSelf: "flex-start",
    borderRightWidth: 1,
    borderColor: "white"
  },
  videoProgressContainer: {},
  videoProgressTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  videoProgressTimeText: {
    color: "white",
    marginTop: 2,
    marginLeft: 2,
    marginRight: 2,
    fontSize: 12
  }
});

interface VideoPopupProps {
  icon: string;
  text: string;
  duration: number;
  currentTime: number;
  opacity: number | Animated.Value;
}

class VideoPopup extends Component<VideoPopupProps> {
  render() {
    const {
      icon,
      text,
      duration = 0,
      currentTime = 0,
      opacity = 0
    } = this.props;
    return (
      <Animated.View
        style={{
          ...styles.statusContainer,
          opacity
        }}
      >
        {currentTime >= 0 && duration ? (
          <VideoProgress duration={duration} currentTime={currentTime} />
        ) : (
          <View />
        )}
        <View style={styles.statusTextContainer}>
          {icon ? <Icon name={icon} style={styles.statusIcon} /> : <View />}
          {text ? <Text style={styles.statusText}>{text}</Text> : <View />}
        </View>
      </Animated.View>
    );
  }
}

interface Props {
  navigation: any;
  shows: {
    showData: Show;
  };
  fetchNextEpisode(current: {
    showId: string;
    seasonId: number;
    episodeId: number;
  }): AnyAction;
}
interface State {
  paused: boolean;
  fastForward: number;
  fastReverse: number;
  finishedWatching: boolean;
  video: {
    duration: number;
    progress: {
      currentTime: number;
    };
  };
  popup: {
    icon: string;
    text: string;
    anim: Animated.Value;
  };
}
class Player extends Component<Props, State> {
  state = {
    paused: false,
    fastForward: 0,
    fastReverse: 0,
    finishedWatching: false,
    video: {
      duration: undefined,
      progress: {
        currentTime: undefined
      }
    },
    popup: {
      autoDismiss: true,
      icon: undefined,
      text: undefined,
      anim: new Animated.Value(0)
    }
  };

  player = undefined;

  displayPopup({ icon, text, autoDismiss = true }) {
    Animated.timing(
      // Animate over time
      this.state.popup.anim, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 250 // Make it take a while
      }
    ).start(); // Starts the animation
    this.setState({
      popup: {
        ...this.state.popup,
        icon,
        text
      }
    });
    if (autoDismiss) {
      setTimeout(
        () =>
          Animated.timing(
            // Animate over time
            this.state.popup.anim, // The animated value to drive
            {
              toValue: 0, // Animate to opacity: 1 (opaque)
              duration: 1000 // Make it take a while
            }
          ).start(),
        2000
      );
    }
  }

  componentDidMount() {
    KeepAwake.activate();
  }
  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  render() {
    const {
      navigation,
      fetchNextEpisode,
      shows: { showData }
    } = this.props;
    const uri = navigation.getParam(
      "uri",
      "http://www.html5videoplayer.net/videos/toystory.mp4"
    );
    const showId = navigation.getParam("showId");
    const seasonId = navigation.getParam("seasonId");
    const episodeId = navigation.getParam("episodeId");

    const currentTime =
      this.state.video.progress.currentTime +
      this.state.fastForward +
      this.state.fastReverse;

    const playNextEpisode = () => {
      const { episode: nextEpisode, season: nextSeason } = findNextEpisode({
        seasonId,
        episodeId,
        show: showData
      });
      if (nextEpisode && nextSeason) {
        fetchNextEpisode({ showId, seasonId, episodeId });
        this.setState({ ...this.state, finishedWatching: false });
      } else {
        navigation.dispatch(
          StackActions.pop({
            n: 1
          })
        );
      }
    };
    
    const setShowWatched = watched => {
      (async () => {
        await global
          .__settings()
          .setShowWatched({
            showId,
            seasonId,
            episodeId,
            finishedWatching: watched
          });
      })();
    }

    return (
      <View style={styles.container} hasTVPreferredFocus={true}>
        <VideoPlayer
          source={{
            uri
          }} // Can be a URL or a local file.
          style={styles.backgroundVideo}
          paused={this.state.paused}
          onLoad={({ duration }) => {
            this.setState({ video: { ...this.state.video, duration } });
            setShowWatched(false)
          }}
          onProgress={(progress: any) => {
            this.setState({ video: { ...this.state.video, progress } });
            if (
              progress.currentTime / this.state.video.duration >= 0.9 &&
              !this.state.finishedWatching
            ) {
              setShowWatched(true)
              this.setState({ ...this.state, finishedWatching: true });
            }
          }}
          onEnd={() => playNextEpisode()}
          ref={ref => {
            this.player = ref;
          }}
        />
        <VideoPopup
          icon={this.state.popup.icon}
          text={this.state.popup.text}
          duration={this.state.video.duration}
          currentTime={currentTime}
          opacity={this.state.popup.anim}
        />

        <FirestickKeys
          keyPressTimeOut={250}
          onPlay={() => {
            this.setState({ paused: !this.state.paused });
            let displayobj;
            if (!this.state.paused) {
              displayobj = { icon: "play", text: "Play" };
              KeepAwake.activate();
            } else {
              displayobj = { icon: "pause", text: "Paused" };
              KeepAwake.deactivate();
            }
            this.displayPopup({
              ...displayobj,
              autoDismiss: !this.state.paused
            });
          }}
          onLeftHold={() => {
            const step =
              this.state.fastReverse && this.state.fastReverse <= -60
                ? -30
                : -10;
            let reverseAmt = this.state.fastReverse
              ? this.state.fastReverse + step
              : step;
            if (this.state.video.progress.currentTime + reverseAmt < 0) {
              reverseAmt = -1 * this.state.video.progress.currentTime;
            }
            this.setState({
              fastReverse: reverseAmt
            });
            this.displayPopup({
              icon: "backward",
              text: prettyTime(Math.abs(reverseAmt)),
              autoDismiss: false
            });
          }}
          onLeft={() => {
            const reverseAmt = this.state.fastReverse
              ? this.state.fastReverse
              : -10;
            if (this.state.video.progress) {
              if (this.state.video.progress.currentTime + reverseAmt >= 0) {
                this.player.seek(
                  reverseAmt + this.state.video.progress.currentTime
                );
              } else {
                this.player.seek(0);
              }
            }
            this.setState({ fastReverse: 0 });
            this.displayPopup({
              icon: "backward",
              text: prettyTime(Math.abs(reverseAmt))
            });
          }}
          onRightHold={() => {
            const step =
              this.state.fastForward && this.state.fastForward >= 60 ? 30 : 10;
            let forwardAmt = this.state.fastForward
              ? this.state.fastForward + step
              : step;
            if (
              this.state.video.progress.currentTime + forwardAmt >
              this.state.video.duration
            ) {
              forwardAmt =
                this.state.video.duration -
                this.state.video.progress.currentTime;
            }
            this.setState({
              fastForward: forwardAmt
            });
            this.displayPopup({
              icon: "forward",
              text: prettyTime(forwardAmt),
              autoDismiss: false
            });
          }}
          onRight={() => {
            const forwardAmt = this.state.fastForward
              ? this.state.fastForward
              : 10;
            if (this.state.video.progress) {
              if (
                this.state.video.progress.currentTime + forwardAmt <
                this.state.video.duration
              ) {
                this.player.seek(
                  forwardAmt + this.state.video.progress.currentTime
                );
              } else {
                this.player.seek(this.state.video.duration);
              }
            }
            this.setState({ fastForward: 0 });
            this.displayPopup({
              icon: "forward",
              text: prettyTime(forwardAmt)
            });
          }}
        />
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
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 500
  },
  statusContainer: {
    zIndex: 700,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    opacity: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: 60
  },
  statusTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  statusText: {
    color: "#FFF",
    fontSize: 20
  },
  statusIcon: {
    color: "#FFF",
    fontSize: 25,
    marginRight: 10
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
)(Player);
