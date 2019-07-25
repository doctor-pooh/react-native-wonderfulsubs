import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions
} from "react-native";
import { NavigationActions } from "react-navigation";
import { debounce } from "lodash";
import { DISPLAY_CONST, DATA_CONST } from "../../constants";
import { StateContext } from "../context";
import { Show } from "../../types";
import { AnyAction } from "redux";
import * as actions from "../../redux-store/actions";
import { Category, SearchButton } from "../components";

let winSize = Dimensions.get("window");

interface Props {
  style: object;
  shows?: {
    data: Show[];
    searchData: Show[];
  };
  category: string;
  navigation: any;
  initializeShows?(category: string): AnyAction;
  updateCategory?: (category: string) => AnyAction;
  searchShowData?: (query: string) => AnyAction;
}

class ShowHeader extends Component<Props> {
  static contextType = StateContext;
  public static defaultProps = {
    style: {}
  };
  public render() {
    const [state, dispatch] = this.context;

    const resetSelectedShow = () => {
      dispatch({
        type: "SET_SELECTED_SHOW",
        payload: undefined
      });
    };

    const onFocus = () => {
      resetSelectedShow();
    };

    const onFocusDebounce = debounce(onFocus, 100);

    const { selectedShow } = state;
    const { shows, searchShowData, category, navigation } = this.props;
    const showsData =
      (shows &&
        category &&
        (category === DATA_CONST.CATEGORIES.SEARCH_CATEGORY
          ? shows.searchData
          : shows.data)) ||
      [];
    const show = showsData && showsData[selectedShow];
    const categorySelection = category;

    const updateCategory = newCategory => {
      if (category != newCategory) {
        navigation.dispatch(
          NavigationActions.navigate({
            routeName: "Shows",
            params: { category: newCategory, oldCategory: category },
            key: newCategory
          })
        );
      }
    };

    const categoryView = () => {
      const categories = global
        .__provider()
        .categories.map(({ name, type }) => (
          <Category
            preferredFocus={type === category}
            key={type}
            title={name}
            onFocus={onFocusDebounce}
            onPress={() => updateCategory(type)}
            selected={type === categorySelection}
          />
        ));
      return (
        <View style={styles.categoryContainer}>
          {categories}
          <SearchButton
            preferredFocus={DATA_CONST.CATEGORIES.SEARCH_CATEGORY === category}
            onFocus={onFocusDebounce}
            selected={
              DATA_CONST.CATEGORIES.SEARCH_CATEGORY === categorySelection
            }
            onSearch={query => {
              if (query && query.length > 0) {
                searchShowData(query);
                updateCategory(DATA_CONST.CATEGORIES.SEARCH_CATEGORY);
              }
            }}
          />
        </View>
      );
    };

    const descriptionView = () => (
      <View style={styles.descriptionContainer}>
        <Image style={styles.image} source={{ uri: show.wallArt }} />
        <View style={styles.descriptionTextContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {show.name}
          </Text>
          <Text numberOfLines={6} style={styles.description}>
            {show.description.trim()}
          </Text>
        </View>
      </View>
    );

    return (
      <View style={{ ...styles.container, ...this.props.style }}>
        {categoryView()}
        {show && selectedShow ? descriptionView(): <View />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "auto",
    width: winSize.width,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: "rgb(30,30,25)",
    elevation: 2
  },
  descriptionContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 5,
  },
  descriptionTextContainer: {
    justifyContent: "flex-start",
    height: DISPLAY_CONST.SHOW_ITEM.ITEM_WIDTH * 0.9,
    paddingLeft: 20,
    paddingRight: 20
  },
  description: {
    opacity: 1,
    color: "white",
    width: winSize.width - (DISPLAY_CONST.SHOW_ITEM.ITEM_HEIGHT * 0.9 + 80),
    fontSize: 12
  },
  title: {
    opacity: 1,
    color: "white",
    fontSize: 22,
    marginBottom: 10,
    marginTop: -2.5
  },
  image: {
    width: DISPLAY_CONST.SHOW_ITEM.ITEM_HEIGHT * 0.9,
    height: DISPLAY_CONST.SHOW_ITEM.ITEM_WIDTH * 0.9
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
)(ShowHeader);
