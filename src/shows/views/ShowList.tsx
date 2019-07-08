/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { StackActions } from "react-navigation";
import { debounce } from "lodash";
import * as actions from "../../redux-store/actions";
import { ShowItem } from "../components";
import { Show } from "../../types";
import { DISPLAY_CONST, DATA_CONST } from "../../constants";
import { StateContext } from "../context";

interface Props {
  navigation: any;

  infiniteScrollShowData(category: string): AnyAction;
  fetchSeasonData(target: { showId: number }): AnyAction;
  category: string;
  shows: {
    isFetching: boolean;
    data: Show[];
    searchData: Show[];
  };
}

class ShowList extends Component<Props> {
  static contextType = StateContext;
  windowHeight: number;
  scrollWindowSize: number;

  render() {
    const [state, dispatch] = this.context;
    const { navigation, infiniteScrollShowData, category, shows } = this.props;
    const { isFetching } = shows;

    const resetCategory = () => {
      dispatch({
        type: "SET_SELECTED_CATEGORY",
        payload: undefined
      });
    };

    const setSelectedShow = id => {
      dispatch({
        type: "SET_SELECTED_SHOW",
        payload: id
      });
    };

    const onFocus = id => {
      resetCategory();
      setSelectedShow(id);
    };
    const onFocusDebounce = debounce(onFocus, 100);

    const goToEpisodes = id => {
      navigation.dispatch(
        StackActions.push({
          routeName: "Episodes",
          params: { showId: id }
        })
      );
    };

    const showsData =
      (shows &&
        category &&
        Object.values(
          category === DATA_CONST.CATEGORIES.SEARCH_CATEGORY
            ? shows.searchData
            : shows.data
        )) ||
      [];
    const items = showsData.map(item => (
      <ShowItem
        key={item.id}
        imageSource={item.picture}
        onPress={() => {
          goToEpisodes(item.id);
        }}
        dubbed={item.attributes && item.attributes.dubbed}
        subbed={item.attributes && item.attributes.subbed}
        onFocus={() => onFocusDebounce(item.id)}
      />
    ));

    const calculateScrollPercentage = (scrollPosition: number) => {
      if (this.windowHeight && this.scrollWindowSize) {
        const scrollPositionWithOffset = this.scrollWindowSize + scrollPosition;
        return scrollPositionWithOffset / this.windowHeight;
      }
      return 0;
    };

    return (
      <ScrollView
        onLayout={({ nativeEvent: { layout } }) =>
          (this.scrollWindowSize = layout.height)
        }
        removeClippedSubviews={false}
        onScroll={({ nativeEvent: { contentOffset } }) => {
          if (
            showsData.length < global.__provider().maxShowsToFetch &&
            category &&
            category !== DATA_CONST.CATEGORIES.SEARCH_CATEGORY &&
            category !== DATA_CONST.CATEGORIES.BOOKMARKS_CATEGORY
          ) {
            const scrollPrecentage = calculateScrollPercentage(contentOffset.y);
            if (
              scrollPrecentage >
              DISPLAY_CONST.SHOW_LIST.FETCH_SHOWS_AT_SCROLL_PRECENTAGE
            ) {
              infiniteScrollShowData(category);
            }
          }
        }}
        contentContainerStyle={styles.scrollInnerContainer}
        style={styles.scrollOuterContainer}
      >
        <View
          onLayout={({ nativeEvent: { layout } }) =>
            (this.windowHeight = layout.height)
          }
          style={styles.container}
        >
          {items}
          {isFetching && (
            <View style={styles.infiniteScrollingContainer}>
              <ActivityIndicator size="large" color="#ff9900" />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollInnerContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 10
  },
  scrollOuterContainer: {
    paddingBottom: 10
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap"
  },
  infiniteScrollingContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40
  }
});

const mapDispatchToProps = {
  ...actions
};

const mapStateToProps = state => ({
  shows: state.shows
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowList);
