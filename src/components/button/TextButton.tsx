import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface Props {
  onPress?: () => void;
  preferredFocus?: boolean;
  onFocus?: () => void;
  title?: string;
  selected?: boolean;
  icon?: string;
  style?: object;
  fontSize?:number;
  underlineWhenSelected?: boolean;
}

const TextButton = (props: Props) => {
  const {
    onPress,
    preferredFocus,
    onFocus,
    selected,
    title,
    icon,
    underlineWhenSelected = true,
    style = {},
    fontSize=16
  } = props;
  const styles = StyleSheet.create({
    button: {
      height: 40,
      paddingBottom: 5
    },
    container: {
      flex: 1,
      opacity: 0.3,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      borderBottomWidth: 2,
      borderColor: "rgba(255,255,255,0)"
    },
    text: {
      fontSize,
      color: "white",
      paddingLeft: 0,
      paddingRight: 6,
      height: 28,
      lineHeight: 33
    },
    icon: {
      color: "white",
      fontSize,
      paddingLeft: 0,
      paddingRight: 6,
      marginTop: -2,
      marginRight: 5,
      height: 28,
      lineHeight: 33,
      textAlignVertical: "center"
    }
  });
  const stylesSelected = StyleSheet.create({
    container: {
      opacity: 1,
      borderColor: underlineWhenSelected
        ? "rgba(255,255,255,1)"
        : "rgba(0,0,0,0)"
    },
    text: {
      textShadowColor: "rgba(255, 255, 255, 0.5)",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10
    },
    icon: {
      textShadowColor: "rgba(255, 255, 255, 0.5)",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10
    }
  });

  const theFiller = ({ icon, title, selected }) => {
    let elements = [];
    if (icon) {
      elements.push(
        <Icon
          key="icon"
          name={icon}
          style={{ ...styles.icon, ...(selected ? stylesSelected.icon : {}) }}
        />
      );
    }
    if (title) {
      elements.push(
        <Text
          key="text"
          style={{ ...styles.text, ...(selected ? stylesSelected.text : {}) }}
        >
          {title}
        </Text>
      );
    }
    if (elements.length > 0) {
      return elements;
    }
    return <View />;
  };

  return (
    <TouchableHighlight
      underlayColor="rgba(0,0,0,0)"
      activeOpacity={1}
      hasTVPreferredFocus={preferredFocus}
      onPress={onPress}
      onShowUnderlay={onFocus}
      style={{ ...styles.button, ...style }}
    >
      <View
        style={{
          ...styles.container,
          ...(selected ? stylesSelected.container : {})
        }}
      >
        {theFiller({ icon, title, selected })}
      </View>
    </TouchableHighlight>
  );
};

export default TextButton;
