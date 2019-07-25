import React, { Component, RefObject } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { Episode } from "src/types";
import { VideoProgressPopup, VideoNextEpisodePopup } from "../components";

interface Props {
  ref: RefObject<PlayerPopover>;
}
interface State {
  autoDismiss: boolean;
  anim: Animated.Value;
  lowerPopup: {
    visible: boolean;
    icon?: string;
    text?: string;
    videoInfo?: any;
  };
  episodePopup: {
    visible: boolean;
    episode?: Episode;
    topText?: string;
    showTimeLeft?: boolean;
  };
}

class PlayerPopover extends Component<Props, State> {
  state = {
    autoDismiss: true,
    anim: new Animated.Value(0),
    lowerPopup: {
      visible: false,
      icon: undefined,
      text: undefined,
      videoInfo: undefined
    },
    episodePopup: {
      visible: false,
      episode: undefined,
      topText: undefined,
      showTimeLeft: false
    }
  };

  displayPopup(
    value: {
      lowerPopup?: { icon?: string; text?: string, videoInfo?: any };
      episodePopup?: {
        episode: Episode;
        topText?: string;
        showTimeLeft?: boolean;
      };
    },
    autoDismiss: boolean = true,
    dissmissAfter: number = 2000
  ) {
    const { lowerPopup, episodePopup } = value;
    const lowerPopupState = lowerPopup
      ? { ...lowerPopup, visible: true }
      : { visible: false };
    let episodePopupState;
    if (this.state.episodePopup.showTimeLeft)
      episodePopupState = this.state.episodePopup;
    else if (episodePopup)
      episodePopupState = { ...episodePopup, visible: true };
    else episodePopupState = { visible: false };
    Animated.timing(this.state.anim, {
      toValue: 1,
      duration: 250
    }).start();
    this.setState({
      ...this.state,
      autoDismiss,
      lowerPopup: {
        ...lowerPopupState
      },
      episodePopup: {
        ...episodePopupState
      }
    });
    if (autoDismiss) {
      setTimeout(
        () =>
          Animated.timing(this.state.anim, {
            toValue: 0,
            duration: 500
          }).start(),
        dissmissAfter
      );
    }
  }

  dismissPopup() {
    Animated.timing(this.state.anim, {
      toValue: 0,
      duration: 250
    }).start(() =>
      this.setState({
        ...this.state,
        lowerPopup: { visible: false },
        episodePopup: { visible: false },
        autoDismiss: true
      })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.lowerPopup.visible ? (
          <VideoProgressPopup
            icon={this.state.lowerPopup.icon}
            text={this.state.lowerPopup.text}
            info={this.state.lowerPopup.videoInfo}
            opacity={this.state.anim}
          />
        ) : (
          <View />
        )}
        {this.state.episodePopup.visible ? (
          <VideoNextEpisodePopup
            episode={this.state.episodePopup.episode}
            topText={this.state.episodePopup.topText}
            showTimeLeft={this.state.episodePopup.showTimeLeft}
            opacity={this.state.anim}
          />
        ) : (
          <View />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
    width: "100%",
    height: "100%"
  }
});

export default PlayerPopover;
