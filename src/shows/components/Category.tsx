import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, TextButton } from "../../components";

interface Props {
  onPress?: () => void;
  preferredFocus?: boolean;
  onFocus?: () => void;
  title?: string;
  selected?: boolean;
  icon?: string;
}

const Category = (props: Props) => {
  return <TextButton {...props} style={{ paddingRight: 100 }} fontSize={20} />;
};

export default Category;
