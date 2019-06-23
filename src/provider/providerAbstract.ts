import {
  Show,
  Category,
  Source
} from "../types";



export abstract class Provider {
  constructor(public settings: any) {
    this.settings = settings
  }
  key: string;
  categories: Category[];
  maxShowsToFetch: number;
  getSettings(): any {
    return this.settings;
  }
  abstract setSettings(settings: object): object;
  abstract fetchShows({ type } : Category): Promise<{[id: string]: Show}>;
  abstract fetchShowDecription(target: { showId: string }): Promise<Show>;
  abstract searchShows(target: {query: string}): Promise<{[id: string]: Show}>;
  abstract fetchSeasons(target: { showId: string }): Promise<Show>;
  abstract fetchEpisodes(target: { showId: string; seasonId: number }): Promise<Show>;
  abstract fetchEpisodeDescription(target: {
    showId: string;
    seasonId: number;
    episodeId: number;
  }): Promise<Show>;
  abstract fetchSources(target: {
    showId: string;
    seasonId: number;
    episodeId: number;
  }): Promise<{data: Show, source: Source}>;
};