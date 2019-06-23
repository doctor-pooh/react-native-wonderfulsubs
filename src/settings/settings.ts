import { Show } from "../types";
import { flow, omit, pick, set, get } from "lodash/fp";
import AsyncStorage from "@react-native-community/async-storage";
import Settings from "./settingsAbstract";

export default class DefaultSettingsController extends Settings {
  async addBookmark(show: Show): Promise<{ [id: string]: Show }> {
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
    this.trigger("bookmarkAdded", { bookmark: bookmarks[show.id] });
    await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
    return bookmarks;
  }

  async removeBookmark(id: string): Promise<{ [id: string]: Show }> {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    delete bookmarks[id];
    this.trigger("bookmarkRemoved", { id });
    await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
    return bookmarks;
  }

  async getBookmarks(): Promise<{ [id: string]: Show }> {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    return bookmarks;
  }

  async getBookmark(id: string): Promise<Show> {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    return bookmarks[id];
  }

  async setEpisodeWatched(target: {
    showId: string;
    seasonId: string;
    episodeId: string;
    finishedWatching: boolean;
  }): Promise<void> {
    const { showId, seasonId, episodeId, finishedWatching } = target;
    let watched = JSON.parse(await AsyncStorage.getItem("@watched"));
    if (!watched) {
      watched = {};
    }
    watched = set(`${showId}.${seasonId}.${episodeId}`, finishedWatching)(
      watched
    );
    this.trigger("setEpisodeWatched", {
      showId,
      seasonId,
      episodeId,
      finishedWatching
    });
    await AsyncStorage.setItem("@watched", JSON.stringify(watched));
  }

  async getEpisodesWatched(target: {
    showId: string;
    seasonId: string;
  }): Promise<string[]> {
    const { showId, seasonId } = target;
    let watched = JSON.parse(await AsyncStorage.getItem("@watched"));
    if (!watched) {
      watched = {};
    }
    const episodesWatched = get(`${showId}.${seasonId}`)(watched);
    return episodesWatched;
  }
}
