import { fetchShowData, fetchSourceData } from "./actions";
import {
  INITIALIZE_SHOWS,
  INFINITE_SCROLL_FETCH_SHOW_DATA,
  FETCH_NEXT_EPISODE
} from "./actionTypes";
import createMiddleware from "../redux-utils/createMiddleware";
import { Show } from "../types";
import { findNextEpisode } from "../show-utils";
import { DATA_CONST } from "../constants";

function goGetShowData(state, { payload: category }, infiniteScroll = false) {
  switch (category) {
    case DATA_CONST.CATEGORIES.SEARCH_CATEGORY:
      return [];
    case DATA_CONST.CATEGORIES.BOOKMARKS_CATEGORY:
      return fetchShowData({category, infiniteScroll});
    default:
      return fetchShowData({category, infiniteScroll});
  }
}

function fetchNextEpisode(state: { shows: { showData: Show } }, { payload }) {
  const { showId, seasonId, episodeId } = payload;
  const {
    shows: { showData }
  } = state;
  const { season: nextSeason, episode: nextEpisode } = findNextEpisode({
    seasonId,
    episodeId,
    show: showData
  });

  return fetchSourceData({
    showId: showId,
    seasonId: nextSeason.id,
    episodeId: nextEpisode.id
  });
}

export default createMiddleware({
  [INITIALIZE_SHOWS]: goGetShowData,
  [INFINITE_SCROLL_FETCH_SHOW_DATA]: (state, payload) => goGetShowData(state, payload, true),
  [FETCH_NEXT_EPISODE]: fetchNextEpisode
});
