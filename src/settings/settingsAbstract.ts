import { Show } from "../types";

export default abstract class Settings {
  constructor() {}
  abstract getDefaultSettings(): any;
  abstract getSettings(): Promise<any>;
  abstract updateSettings(settings: any): Promise<any>;
  abstract addBookmark(show: Show): Promise<{ [id: string]: Show }>;
  abstract removeBookmark(id: string): Promise<{ [id: string]: Show }>;
  abstract getBookmarks(): Promise<{ [id: string]: Show }>;
  abstract getBookmark(id: string): Promise<Show>;
  abstract setEpisodeWatched(target: {
    showId: string;
    seasonId: string;
    episodeId: string;
    finishedWatching: boolean;
  }): Promise<void>;
  abstract getEpisodesWatched(target: {
    showId: string;
    seasonId: string;
  }): Promise<string[]>;

  private callbackTopics: { [topic: string]: (...args: any) => void } = {};

  on(topic: string, fn: (...args: any) => void) {
    this.callbackTopics[topic] = fn;
  }

  trigger(topic: string, ...args: any) {
    this.callbackTopics[topic] && this.callbackTopics[topic](...args);
  }
}
