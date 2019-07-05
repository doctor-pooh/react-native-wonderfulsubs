import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
      backgroundColor: "rgba(255,255,255,0.5)",
      height: 4,
      alignSelf: "flex-start",
      borderRightWidth: 1,
      borderColor: "white"
    },
    videoProgressContainer: {
    },
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