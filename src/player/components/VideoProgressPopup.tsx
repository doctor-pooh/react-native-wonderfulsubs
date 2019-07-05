import React, { Component } from "react";
import { Animated, View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import VideoProgress from "./VideoProgress";
import { StateContext } from "../context";
import { Episode } from "../../types";
import { DISPLAY_CONST } from "../../constants"
import { typeAlias } from "@babel/types";

interface VideoPopupProps {
  icon: string;
  text: string;
  opacity: number | Animated.Value;
}
const test = {
  "description": "Rimuru and his Goblin riders set out for the marshlands to finalize their alliance with the Lizardmen. On the way, they save a Lizardman who'd been attacked by the Orcs. The victim turns out to be Gabiru's younger sister, who reveals that Gabiru led an insurrection and left to fight the Orc Lord without waiting for the alliance. She also pleads with Rimuru to save Gabiru and the rest of her clan. Meanwhile, Gabiru faces the massive Orc army and is shocked when he witnesses the power of their unique skill, Starved.",
  "episodeNumber": 13,
  "id": 12,
  "name": "The Great Clash",
  "picture": "https://static.vrv.co/imgsrv/display/thumbnail/320x180/catalog/crunchyroll/4fbfedc219a7ef7cf2974e2104ad880d.jpg"
};

class VideoProgressPopup extends Component<VideoPopupProps> {
  static contextType = StateContext;
  render() {
    const [state] = this.context;
    const { icon, text, opacity = 0 } = this.props;
    const {
      video: { progress, duration, delta }
    } = state;
    const currentTime = progress + delta;
    return (
      <View style={styles.statusContainer}>
        <Animated.View style={{ ...styles.bottomContainer, opacity }}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusContainer: {
    zIndex: 700,
    width: "100%",
    height: "100%"
  },
  bottomContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  topContentContainer: {
    marginTop: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
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
  },
  episodeTextContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  episodeDescription: {
    opacity: 1,
    color: "white",
    fontSize: 11
  },
  episodeTitle: {
    opacity: 1,
    color: "white",
    fontSize: 16,
    marginBottom: 10
  },
  topContainer: {
    width: "50%",
    flex: 1,
    position: "absolute",
    marginTop: 10,
    top: 0,
    right: 0,
    opacity: 1,
  },
  topTitleContainer: {
    marginLeft: 5
  },
  topContainerTitleText: {
    color: "white",
    fontSize: 16,
    opacity: 1
  },
  episodeImageContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1
  },
  episodeImage: {
    width: DISPLAY_CONST.EPISODE_ITEM.ITEM_WIDTH * 0.55,
    height: DISPLAY_CONST.EPISODE_ITEM.ITEM_HEIGHT * 0.55
  }
});

export default VideoProgressPopup;
