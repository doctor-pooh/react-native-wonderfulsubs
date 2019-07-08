import React, { Component } from "react";
import { Animated, View, Text, StyleSheet, Image } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { StateContext } from "../context";
import { Episode } from "../../types";
import { DISPLAY_CONST } from "../../constants";
 
interface VideoPopupProps {
  untilTimeLeft?: number;
  showTimeLeft: boolean;
  episode: Episode;
  topText?: string;
  opacity: number | Animated.Value;
}
const test = {
  description:
    "Rimuru and his Goblin riders set out for the marshlands to finalize their alliance with the Lizardmen. On the way, they save a Lizardman who'd been attacked by the Orcs. The victim turns out to be Gabiru's younger sister, who reveals that Gabiru led an insurrection and left to fight the Orc Lord without waiting for the alliance. She also pleads with Rimuru to save Gabiru and the rest of her clan. Meanwhile, Gabiru faces the massive Orc army and is shocked when he witnesses the power of their unique skill, Starved.",
  episodeNumber: 13,
  id: 12,
  name: "The Great Clash",
  picture:
    "https://static.vrv.co/imgsrv/display/thumbnail/320x180/catalog/crunchyroll/4fbfedc219a7ef7cf2974e2104ad880d.jpg"
};

class VideoNextEpisodePopup extends Component<VideoPopupProps> {
  static contextType = StateContext;
  render() {
    const [state] = this.context;
    const {
      opacity = 0,
      episode,
      topText,
      showTimeLeft = false,
      untilTimeLeft = 15
    } = this.props;
    const {
      video: { progress = 0, duration = 0, delta }
    } = state;
    let timeLeft = duration - progress;
    timeLeft = timeLeft < 0 ? 0 : timeLeft;
    const timeLeftSeconds = `${Math.floor(timeLeft)}s`;
    const timeLeftPercentage =
      timeLeft > untilTimeLeft
        ? 0
        : Math.floor(((untilTimeLeft - timeLeft) / untilTimeLeft) * 100);
    const { name, picture, description } = episode || test;

    return (
      <Animated.View style={{ ...styles.topContainer, opacity }}>
        {topText ? (
          <View style={styles.topTitleContainer}>
            <Text style={styles.topContainerTitleText}>{topText}</Text>
          </View>
        ) : (
          <View />
        )}
        <View style={styles.topContentContainer}>
          {showTimeLeft ? (
            <View style={styles.progressContainer}>
              <AnimatedCircularProgress
                size={40}
                width={3}
                fill={timeLeftPercentage}
                tintColor="rgba(255,255,255,0.5)"
                backgroundColor="rgba(255,255,255,0.3)"
                lineCap="butt"
              >
                {fill => (
                  <Text style={styles.progressText}>{timeLeftSeconds}</Text>
                )}
              </AnimatedCircularProgress>
            </View>
          ) : (
            <View />
          )}
          <View style={styles.episodeImageContainer}>
            <Image
              style={styles.episodeImage}
              source={picture && { uri: picture }}
            />
          </View>
          <View style={styles.episodeTextContainer}>
            <Text numberOfLines={1} style={styles.episodeTitle}>
              {name}
            </Text>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit={true}
              style={styles.episodeDescription}
            >
              {description}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  progressContainer: {
    width: 40,
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5
  },
  bottomContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
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
    zIndex: 700,
    width: "50%",
    flex: 1,
    position: "absolute",
    marginTop: 10,
    top: 0,
    right: 0,
    opacity: 1
  },
  topTitleContainer: {
    marginLeft: 5,
    height: 22
  },
  topContainerTitleText: {
    color: "white",
    fontSize: 16,
    opacity: 1
  },
  progressText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
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

export default VideoNextEpisodePopup;
