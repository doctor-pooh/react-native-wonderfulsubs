/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { StackActions } from "react-navigation";
import { debounce } from "lodash";
import * as actions from "../../redux-store/actions";
import { ShowItem } from "../components";
import { Show } from "../../types";
import { DISPLAY_CONST, DATA_CONST } from "../../constants";
import { useStateValue } from "../context";

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

const ShowList = (props: Props) => {
  const [state, dispatch] = useStateValue();
  const {
    navigation,
    infiniteScrollShowData,
    fetchSeasonData,
    category,
    shows
  } = props;
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

  const getSources = async sourceFetch => {
    const response = await sourceFetch();
    const result = await response.json();
    return result.urls && result.urls[result.urls.length - 1];
  };

  const playVideo = async sourceFetch => {
    const source = await getSources(sourceFetch);
    console.log(source);
    navigation.dispatch(
      StackActions.push({
        routeName: "Player",
        params: { uri: source.src }
      })
    );
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
        params: { showId: id}
      })
    );
    //fetchSeasonData({ showId: item.id })
  }

  const showsData = Object.values(category === DATA_CONST.CATEGORIES.SEARCH_CATEGORY ? shows.searchData : shows.data);
  const items = showsData.map(item => (
    <ShowItem
      key={item.id}
      imageSource={item.picture}
      onPress={() => goToEpisodes(item.id)}
      onFocus={() => onFocusDebounce(item.id)}
    />
  ));

  const calculateScrollPercentage = (scrollPosition: number) => {
    const scrollPositionWithOffset = this.scrollWindowSize + scrollPosition;
    return scrollPositionWithOffset / this.windowHeight;
  };

  return (
    <ScrollView
      onLayout={({ nativeEvent: { layout } }) =>
        (this.scrollWindowSize = layout.height)
      }
      onScroll={({ nativeEvent: { contentOffset } }) => {
        if (
          showsData.length < DISPLAY_CONST.SHOW_LIST.MAX_SHOWS_ON_SCREEN &&
          category !== DATA_CONST.CATEGORIES.SEARCH_CATEGORY
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
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

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
    flexWrap: "wrap",
    backgroundColor: "rgb(36,36,33)"
  },
  infiniteScrollingContainer: {
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
