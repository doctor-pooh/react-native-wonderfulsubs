import { Show } from "../types";
import { flow, omit, pick, set, get } from "lodash/fp";
import AsyncStorage from "@react-native-community/async-storage";
import Settings from "./settingsAbstract";

// TODO: Write functions for storing position in an episode

export default class DefaultSettingsController extends Settings {
  async getSettings(): Promise<any> {
    const settings = JSON.parse(await AsyncStorage.getItem("@settings")) || this.getDefaultSettings();
    return settings;
  }

  async updateSettings(settings: any): Promise<any> {
    const oldSettings = JSON.parse(await AsyncStorage.getItem("@settings")) || {};
    const updated = {
      ...oldSettings,
      ...settings
    };
    this.trigger("settingsUpdated", { settings: updated });
    await AsyncStorage.setItem("@settings", JSON.stringify(updated));
    return updated;
  }

  getDefaultSettings() {
    return { quality: 5000000 };
  }

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
      provider: "",
      bookmarked: undefined
    };
    bookmarks[show.id] = flow(
      omit(["seasons"]),
      pick(Object.keys(dummy))
    )(<Show>{ ...show, bookmarked: true });
    this.trigger("bookmarkAdded", { bookmarks: bookmarks });
    await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
    return bookmarks;
  }

  async removeBookmark(id: string): Promise<{ [id: string]: Show }> {
    let bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks"));
    if (!bookmarks) {
      bookmarks = {};
    }
    delete bookmarks[id];
    this.trigger("bookmarkRemoved", { bookmarks });
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
