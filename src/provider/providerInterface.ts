import {
  Show,
  Category,
  Source
} from "../types";



export interface Provider {
  key: string;
  categories: Category[];
  maxShowsToFetch: number;
  getSettings(): object;
  setSettings(settings: object): object;
  fetchShows({ type } : Category): Promise<{[id: string]: Show}>;
  fetchShowDecription(target: { showId: string }): Promise<Show>;
  searchShows(target: {query: string}): Promise<{[id: string]: Show}>;
  fetchSeasons(target: { showId: string }): Promise<Show>;
  fetchEpisodes(target: { showId: string; seasonId: number }): Promise<Show>;
  fetchEpisodeDescription(target: {
    showId: string;
    seasonId: number;
    episodeId: number;
  }): Promise<Show>;
  fetchSources(target: {
    showId: string;
    seasonId: number;
    episodeId: number;
  }): Promise<{data: Show, source: Source}>;
};