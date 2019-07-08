import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableHighlight,
  StyleSheet
} from "react-native";
import { Button } from "../../components";
import { DISPLAY_CONST } from "../../constants";
import { Badge } from "react-native-elements";

interface Props {
  onPress: () => void;
  preferredFocus?: boolean;
  imageSource: string;
  title: string;
  dubbed?: boolean;
  subbed?: boolean;
  onFocus: () => void;
}

export default class ShowItem extends Component<Props> {
  public static defaultProps = {
    onPress: () => {},
    preferredFocus: false,
    onFocus: () => {},
    selected: false,
    title: "None",
    imageSource: "https://via.placeholder.com/240x360.png"
  };

  public render() {
    const {
      onPress,
      preferredFocus,
      imageSource,
      onFocus,
      dubbed,
      subbed
    } = this.props;
    const badgeList = [];
    subbed && badgeList.push("subs");
    dubbed && badgeList.push("dubs");
    const badgeText = badgeList.join(" | ");
    return (
      <Button
        underlayColor="rgba(60,60,60,0)"
        activeOpacity={1}
        hasTVPreferredFocus={preferredFocus}
        underlayStyle={{ elevation: 0, zIndex: 9999 }}
        focusChildStyle={{
          transform: [
            { scaleX: 1.35 },
            { scaleY: 1.35 },
            { translateY: 0 },
            { translateX: 0 }
          ],
          elevation: 4,
          backgroundColor: "rgba(90,90,90,1)",
          opacity: 1
        }}
        onPress={onPress}
        onShowUnderlay={onFocus}
        style={styles.button}
      >
        <View style={styles.container}>
          <View style={styles.overlayContainer}>
            {badgeText ? (
              <Badge
                badgeStyle={{
                  backgroundColor: "rgb(32,33,32)",
                  borderWidth: 0
                }}
                textStyle={{ paddingBottom: 2, fontSize: 10 }}
                value={badgeText}
              />
            ) : (
              <View />
            )}
          </View>
          <Image style={styles.image} source={{ uri: imageSource }} />
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5
  },
  image: {
    width: DISPLAY_CONST.SHOW_ITEM.ITEM_WIDTH * 0.75,
    height: DISPLAY_CONST.SHOW_ITEM.ITEM_HEIGHT * 0.75
  },
  text: {
    color: "white",
    marginTop: 8,
    fontSize: 14
  },
  button: {
    paddingTop: DISPLAY_CONST.SHOW_ITEM.ITEM_HEIGHT / 3,
    paddingBottom: DISPLAY_CONST.SHOW_ITEM.ITEM_HEIGHT / 3,
    marginLeft: 18,
    marginRight: 18
  },
  overlayContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 109999,
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row"
  }
});
