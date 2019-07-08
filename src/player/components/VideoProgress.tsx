import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

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
      <View style={styles2.videoProgressLineContainer}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["rgba(0, 0, 0, 0)", "rgb(255, 153, 0)"]}
          style={{
            ...styles2.videoProgress,
            width: `${widthPercentage > 0 ? widthPercentage : 0.1}%`
          }}
        />
        <View style={styles2.videoProgressLineEnd} />
      </View>
      <View style={styles2.videoProgressTimeContainer}>
        <Text style={styles2.videoProgressTimeText}>{prettyCurrentTime}</Text>
        <Text style={styles2.videoProgressTimeText}>{prettyDuration}</Text>
      </View>
    </View>
  );
};

const styles2 = StyleSheet.create({
  videoProgress: {
    backgroundColor: "rgba(255,255,255,0.0)",
    height: 4,
    alignSelf: "flex-start"
  },
  videoProgressLineEnd: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgb(255, 255, 255)",
    left: -2
  },
  videoProgressLineContainer: {
    flexDirection: "row"
  },
  videoProgressContainer: {},
  videoProgressTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  videoProgressTimeText: {
    color: "white",
    marginTop: 2,
    marginLeft: 4,
    marginRight: 4,
    fontSize: 12
  }
});

export default VideoProgress;
