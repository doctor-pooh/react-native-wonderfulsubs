import React, { Component } from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "../../components";
import { DISPLAY_CONST } from "../../constants";
import { Badge } from "react-native-elements";

interface Props {
  onPress: () => void;
  preferredFocus?: boolean;
  imageSource?: string;
  title?: string;
  description?: string;
  episodeNumber?: number;
  onFocus: () => void;
  watched: boolean;
  dubbed?: boolean;
  subbed?: boolean;
  progress?: number;
}

let winSize = Dimensions.get("window");

export default class EpisodeItem extends Component<Props> {
  public static defaultProps = {
    onPress: () => { },
    preferredFocus: false,
    onFocus: () => { },
    selected: false,
    title: "None",
    description: "No description...",
    episodeNumber: -1,
    watched: false,
    imageSource: "https://via.placeholder.com/240x360.png"
  };

  public render() {
    const {
      onPress,
      preferredFocus,
      imageSource,
      title,
      description,
      episodeNumber,
      onFocus,
      watched,
      subbed,
      dubbed
    } = this.props;
    const badgeList = [];
    subbed && badgeList.push("subs");
    dubbed && badgeList.push("dubs");
    const badgeText = badgeList.join(" | ");
    const progress = this.props.progress < 1 ? this.props.progress : 0;

    return (
      <View style={styles.container}>
        <Text style={styles.episodeNumber}>{episodeNumber}</Text>
        <Button
          underlayColor="rgba(60,60,60,0)"
          activeOpacity={1}
          hasTVPreferredFocus={preferredFocus}
          underlayStyle={{ elevation: 0, zIndex: 9999 }}
          focusChildStyle={{
            elevation: 4,
            backgroundColor: watched
              ? "rgba(192, 135, 48,1)"
              : "rgba(90,90,90,1)",
            opacity: !watched ? 1 : 0.75
          }}
          onPress={onPress}
          onFocus={onFocus}
          style={styles.button}
        >
          <View style={styles.buttonContainer}>
            {watched ? (
              <Icon name="check-circle" style={styles.watchedIcon} />
            ) : (
                <View />
              )}
            <View style={styles.overlayContainer}>
              {badgeText ? (
                <Badge
                  badgeStyle={{
                    backgroundColor: "rgba(32,33,32, 0.85)",
                    borderWidth: 0,
                    borderRadius: 4
                  }}
                  textStyle={{ paddingBottom: 2, fontSize: 10 }}
                  value={badgeText}
                />
              ) : (
                  <View />
                )}
            </View>
            <Image
              style={styles.image}
              source={imageSource && { uri: imageSource }}
              blurRadius={watched ? 1 : 0}
            />
            {progress > 0 ? <View style={[styles.progressBar, {
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }]} /> : <View />}
            <View style={[styles.progressBar,
            {
              width: `${watched ? 0 : (progress * 100)}%`,
              backgroundColor: 'white'
            }]} />
          </View>
        </Button>
        <View style={styles.descriptionTextContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit={true}
            style={styles.description}
          >
            {description}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    width: "auto",
    marginLeft: 12,
    marginRight: 12
  },
  episodeNumber: {
    opacity: 1,
    color: "white",
    fontSize: 18,
    marginLeft: 20,
    marginRight: 20,
    width: 40,
    textAlign: "center"
  },
  descriptionTextContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  description: {
    opacity: 1,
    color: "white",
    fontSize: 11
  },
  title: {
    opacity: 1,
    color: "white",
    fontSize: 16,
    marginBottom: 10
  },
  buttonContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5
  },
  image: {
    width: DISPLAY_CONST.EPISODE_ITEM.ITEM_WIDTH * 0.55,
    height: DISPLAY_CONST.EPISODE_ITEM.ITEM_HEIGHT * 0.55
  },
  watchedIcon: {
    position: "absolute",
    right: 15,
    bottom: 10,
    zIndex: 999,
    fontSize: 20,
    color: "rgba(192, 135, 48,1)"
  },
  text: {
    color: "white",
    marginTop: 8,
    fontSize: 14
  },
  button: {
    paddingTop: 8.5,
    paddingBottom: 8.5
  },
  progressBar: {
    height: 4,
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "white",
    zIndex: 9999
  },
  overlayContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 109999,
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row"
  }
});
