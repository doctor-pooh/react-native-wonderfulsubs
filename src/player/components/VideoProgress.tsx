import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { prettyTime } from "../utils";
import LinearGradient from "react-native-linear-gradient";

interface VideoProps {
  duration: number;
  currentTime: number;
}

const rgbTransition = ({ start = [], end = [], percentage = 0 }) =>
  `${end.length == 3 ? "rgb" : "rgba"}(${end
    .map((val, index) => start[index] + (val - start[index]) * percentage)
    .join(",")})`;

const VideoProgress = (props: VideoProps) => {
  const { duration, currentTime } = props;
  const widthPercentage = (currentTime / duration) * 100;
  const prettyCurrentTime = prettyTime(currentTime);
  const prettyDuration = prettyTime(duration);
  const endRgb = rgbTransition({
    start: [255, 89, 0],
    end: [255, 217, 0],
    percentage: currentTime / duration
  });
  return (
    <View style={styles2.videoProgressContainer}>
      <View style={{ ...styles2.videoProgressLineContainer }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["rgba(0,0,0,0)", endRgb]}
          style={{
            ...styles2.videoProgress,
            width: `${widthPercentage > 0 ? widthPercentage : 0.1}%`
          }}
        />
        {new Array(5).fill(0).map((_,i) => <View key={i} style={{...styles2.videoProgressLineEnd, left: `${(i)*(100/4)}%`, position: "absolute"}} />)}
        <View style={styles2.videoProgressLineEnd} />
        <View style={styles2.videoProgressBottomLayer} />
      </View>
      <View style={styles2.videoProgressTimeContainer}>
        <Text style={styles2.videoProgressTimeText}>{prettyCurrentTime}</Text>
        <Text style={styles2.videoProgressTimeText}>{prettyDuration}</Text>
      </View>
    </View>
  );
};

let winSize = Dimensions.get("window");
const styles2 = StyleSheet.create({
  videoProgress: {
    backgroundColor: "rgba(255,255,255,0.0)",
    height: 4,
    alignSelf: "flex-start",
    borderRadius: 4
  },
  videoProgressLineEnd: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgb(255, 255, 255)",
    left: -2,
    zIndex: 9000
  },
  videoProgressBottomLayer: {
    height: 10,
    width: 10,
    left: -9,
    top: -3,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    zIndex: 8900
  },
  videoProgressLineContainer: {
    flexDirection: "row",
    height: 4,
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "rgba(32,33,32, 0.75)"
  },
  videoProgressContainer: {
    width: winSize.width
  },
  videoProgressTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5.5,
    paddingRight: 5.5
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
