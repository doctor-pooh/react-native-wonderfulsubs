import React, { Component } from "react";
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
  style: any;
}

export default class SeasonItem extends Component<Props> {
  props: { [x: string]: any; };
  render() {
    const { style = {}, ...props } = this.props;
    return (
      <TextButton {...props} style={{...style, marginBottom: 14.5, marginLeft: 10, marginRight: 10, ...style}}/>
    );
  }
}
