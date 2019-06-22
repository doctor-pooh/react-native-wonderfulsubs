import {
  INITIALIZE_SHOWS,
  FETCH_SHOW_DATA,
  FETCHED_SHOW_DATA,
  UPDATE_SHOW_DATA,
  FETCH_EPISODE_DATA,
  FETCHED_EPISODE_DATA,
  FETCH_SEASON_DATA,
  FETCHED_SEASON_DATA,
  INFINITE_SCROLL_FETCH_SHOW_DATA,
  FETCH_SEARCH_SHOW_DATA,
  FETCHED_SEARCH_SHOW_DATA,
  FETCH_SOURCE_DATA,
  FETCH_NEXT_EPISODE
} from "./actionTypes";
import { Action } from "../redux-utils";

export function initializeShows(category: string): Action<string> {
  return {
    type: INITIALIZE_SHOWS,
    payload: category
  };
}

export function fetchedShowData(target: {
  data: object[];
}): Action<{ data: object[] }> {
  const { data } = target;
  return {
    type: FETCHED_SHOW_DATA,
    payload: { data }
  };
}

export function fetchShowData(target: {
  category: string;
  infiniteScroll: boolean;
}): Action<{ category: string; infiniteScroll: boolean }> {
  const { category, infiniteScroll } = target;
  return {
    type: FETCH_SHOW_DATA,
    payload: { category, infiniteScroll }
  };
}

export function searchShowData(query: string): Action<{ query: string }> {
  return {
    type: FETCH_SEARCH_SHOW_DATA,
    payload: { query }
  };
}

export function searchedShowData(target: {
  searchData: object[];
}): Action<{ searchData: object[] }> {
  const { searchData } = target;
  return {
    type: FETCHED_SEARCH_SHOW_DATA,
    payload: { searchData }
  };
}

export function infiniteScrollShowData(category: string): Action<string> {
  return {
    type: INFINITE_SCROLL_FETCH_SHOW_DATA,
    payload: category
  };
}

export function fetchEpisodeData(target: {
  showId: string;
}): Action<{ id: string }> {
  const { showId: id } = target;
  return {
    type: FETCH_EPISODE_DATA,
    payload: { id }
  };
}

export function fetchedEpisodeData(): Action {
  return {
    type: FETCHED_EPISODE_DATA
  };
}

export function fetchNextEpisode(current: {
  showId: string;
  seasonId: number;
  episodeId: number;
}): Action<{ showId: string; seasonId: number; episodeId: number }> {
  const { showId, seasonId, episodeId } = current;
  return {
    type: FETCH_NEXT_EPISODE,
    payload: { showId, seasonId, episodeId }
  };
}

export function fetchSeasonData(target: {
  showId: string;
}): Action<{ id: string }> {
  const { showId: id } = target;
  return {
    type: FETCH_SEASON_DATA,
    payload: { id }
  };
}

export function fetchedSeasonData(): Action {
  return {
    type: FETCHED_SEASON_DATA
  };
}

export function fetchSourceData(target: {
  showId: string;
  seasonId: number;
  episodeId: number;
}): Action<{ showId: string; seasonId: number; episodeId: number }> {
  const { showId, seasonId, episodeId } = target;
  return {
    type: FETCH_SOURCE_DATA,
    payload: { showId, seasonId, episodeId }
  };
}

export function updateShowData(target: {
  showId: string;
  data: object;
}): Action<{ id: string; data: object }> {
  const { showId: id, data } = target;
  return {
    type: UPDATE_SHOW_DATA,
    payload: { id, data }
  };
}
