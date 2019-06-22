import { Show } from "../types";
import { flow, omit, pick, set, get } from "lodash/fp";
import AsyncStorage from "@react-native-community/async-storage";

const settings = () => {
  const addBookmark = async (show: Show) => {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    const dummy: Show = {
      id: "",
      seasons: [],
      name: "",
      description: "",
      wallArt: "",
      picture: "",
      provider: ""
    };
    bookmarks[show.id] = flow(
      omit(["seasons"]),
      pick(Object.keys(dummy))
    )(show);
    await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
    return bookmarks;
  };

  const removeBookmark = async id => {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    delete bookmarks[id];
    await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
    return bookmarks;
  };

  const getBookmarks = async () => {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    return bookmarks;
  };

  const getBookmark = async id => {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    return bookmarks[id];
  }

  const setShowWatched = async ({showId, seasonId, episodeId, finishedWatching = true}) => {
      let watched = JSON.parse(await AsyncStorage.getItem("@watched"));
      if (!watched) {
          watched = {};
      }
      watched = set(`${showId}.${seasonId}.${episodeId}`, finishedWatching)(watched);
      await AsyncStorage.setItem("@watched", JSON.stringify(watched));
      return watched;
  }

  const getEpisodesWatched = async ({showId, seasonId}) => {
    let watched = JSON.parse(await AsyncStorage.getItem("@watched"));
    if (!watched) {
        watched = {};
    }
    const episodesWatched = get(`${showId}.${seasonId}`)(watched);
    console.log();
    return episodesWatched;
  }

  return {
    addBookmark,
    removeBookmark,
    getBookmarks,
    getBookmark,
    setShowWatched,
    getEpisodesWatched
  };
};

export default settings;
