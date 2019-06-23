import React, { Component } from "react";
import { TextButton } from "../../components";
import { Show } from "../../types";
import { View, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";

interface Props {
  show: Show;
}

interface State {
  bookmarked: boolean;
}

export class TopActionBar extends Component<Props, State> {
  state = {
    bookmarked: undefined
  };
  componentWillReceiveProps() {
    const { show } = this.props;
    if (show.bookmarked) {
      this.setState({ bookmarked: true });
    }
  }
  render() {
    const { show } = this.props;
    const { bookmarked } = this.state;
    const toggleBookmark = async () => {
      if (!bookmarked) {
        await global
          .__provider()
          .getSettings()
          .addBookmark(show);
        this.setState({ bookmarked: true });
      } else {
        await global
          .__provider()
          .getSettings()
          .removeBookmark(show.id);
        this.setState({ bookmarked: false });
      }
    };

    return (
      <View style={styles.container}>
        <TextButton
          style={styles.textButton}
          icon={bookmarked ? "heart" : "heart-o"}
          title="Bookmark"
          selected={bookmarked}
          onPress={toggleBookmark}
          underlineWhenSelected={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "rgb(50,50,50)"
  },
  textButton: {
    flex: 1,
    width: 120,
    alignItems: "center"
  }
});
