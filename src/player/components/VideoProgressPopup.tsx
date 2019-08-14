import React, { Component } from "react";
import { Animated, View, Text, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import VideoProgress from "./VideoProgress";
import { StateContext } from "../context";
import LinearGradient from "react-native-linear-gradient";

interface VideoPopupProps {
  icon: string;
  text: string;
  info: string;
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
    const { icon, text, opacity = 0, info } = this.props;
    const {
      video: { progress, duration, delta }
    } = state;
    const currentTime = progress + delta;
    return (
      <View style={styles.statusContainer}>
        <Animated.View style={{ ...styles.bottomContainer, opacity }}>
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            locations={[0, 0.35, 1]}
            style={styles.gradientContainer}>
            {currentTime >= 0 && duration ? (
              <VideoProgress duration={duration} currentTime={currentTime} />
            ) : (
                <View />
              )}
            <View style={styles.statusTextContainer}>
              {icon ? <Icon name={icon} style={styles.statusIcon} /> : <View />}
              {text ? <Text style={styles.statusText}>{text}</Text> : <View />}
            </View>
            {info ? <View style={styles.infoContainer}><Icon name="stream" style={styles.infoIcon} /><Text style={styles.infoText}>{info}</Text></View> : <View />}
          </LinearGradient>
        </Animated.View>
      </View>
    );
  }
}

let winSize = Dimensions.get("window");
const styles = StyleSheet.create({
  statusContainer: {
    zIndex: 700,
    width: winSize.width,
    height: winSize.height
  },
  bottomContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0)"
  },
  gradientContainer: {
    height: "100%"
  },
  statusTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: -10
  },
  infoContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    opacity: 0.4,
    flex: 1,
    flexDirection: "row"
  },
  infoText: {
    color: "#FFF",
    fontSize: 10
  },
  infoIcon: {
    color: "#FFF",
    fontSize: 10,
    marginRight: 5,
    top: 2
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

export default VideoProgressPopup;
