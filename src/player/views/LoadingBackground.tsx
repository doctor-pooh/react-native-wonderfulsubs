import React from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import { useStateValue } from "../context";

const winSize = Dimensions.get("window");
const LoadingBackground = () => {
  const [state] = useStateValue();
  const {
    video: { isFetching }
  } = state;
  if (!isFetching) {
    return <View />;
  }
  return (
    <View style={{ ...styles.container }}>
      <ActivityIndicator
        style={styles.loadingIndicator}
        size="large"
        color="#ff9900"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: winSize.width,
    height: winSize.height,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999999
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%"
  }
});

export default LoadingBackground;
