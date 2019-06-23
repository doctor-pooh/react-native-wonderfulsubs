import { Show } from "../types";
import { flow, omit, pick, set, get } from "lodash/fp";
import AsyncStorage from "@react-native-community/async-storage";

const settings = () => {
  const callbackRegister = {
    onBookmarkAdded: (...args) => {},
    onBookmarkRemoved: (...args) => {},
    onSetShowWatched: (...args) => {}
  };
  
  const callBackByKey = () => {
    return Object.keys(callbackRegister).reduce(
      (obj: object, registerKey) => ({
        ...obj,
        [registerKey]: fn => (callbackRegister[registerKey] = fn)
      }),
      {}
    );
  };

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
    callbackRegister.onBookmarkAdded({ bookmark: bookmarks[show.id] });
    await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
    return bookmarks;
  };

  const removeBookmark = async id => {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    delete bookmarks[id];
    callbackRegister.onBookmarkRemoved({ id });
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
  };

  const setShowWatched = async ({
    showId,
    seasonId,
    episodeId,
    finishedWatching = true
  }) => {
    let watched = JSON.parse(await AsyncStorage.getItem("@watched"));
    if (!watched) {
      watched = {};
    }
    watched = set(`${showId}.${seasonId}.${episodeId}`, finishedWatching)(
      watched
    );
    callbackRegister.onSetShowWatched({
      showId,
      seasonId,
      episodeId,
      finishedWatching
    });
    await AsyncStorage.setItem("@watched", JSON.stringify(watched));
    return watched;
  };

  const getEpisodesWatched = async ({ showId, seasonId }) => {
    let watched = JSON.parse(await AsyncStorage.getItem("@watched"));
    if (!watched) {
      watched = {};
    }
    const episodesWatched = get(`${showId}.${seasonId}`)(watched);
    console.log();
    return episodesWatched;
  };

  return {
    addBookmark,
    removeBookmark,
    getBookmarks,
    getBookmark,
    setShowWatched,
    getEpisodesWatched,
    /********* CALLBACKS *********/
    ...callBackByKey()
  };
};

export default settings;
