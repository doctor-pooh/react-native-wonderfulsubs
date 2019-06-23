import { put, takeLeading, select } from "redux-saga/effects";
import {
  FETCH_SHOW_DATA,
  FETCH_SEASON_DATA,
  FETCH_SEARCH_SHOW_DATA,
  FETCH_SOURCE_DATA
} from "./actionTypes";
import { updateShowData, fetchedShowData, searchedShowData } from "./actions";
import { AnyAction } from "redux";
import { NavigationActions } from "react-navigation";
import { DATA_CONST } from "../constants";

function* fetchShowData({ payload: { category } }: AnyAction) {
  const data = yield global
    .__provider()
    .fetchShows({ name: "", type: category });
  yield put(fetchedShowData({ data }));
}

function* fetchSeasonData({ payload: { id } }: AnyAction) {
  const data = yield global.__provider().fetchSeasons({ showId: id });
  yield put(updateShowData({ showId: id, data }));
}

function* fetchSearchData({ payload: { query } }: AnyAction) {
  const searchData = yield global.__provider().searchShows({ query });
  yield put(searchedShowData({ searchData }));
}

function* fetchSourceData({
  payload: { showId, seasonId, episodeId }
}: AnyAction) {
  const { data, source } = yield global
    .__provider()
    .fetchSources({ showId, seasonId, episodeId });
  yield put(
    NavigationActions.navigate({
      routeName: "Player",
      key: "Player",
      params: { uri: source.url, showId, seasonId, episodeId }
    })
  );
  yield put(updateShowData({ showId, data }));
}

function* fetchBookmarks() {
  const data = yield global.__provider().getSettings().getBookmarks();
  yield put(fetchedShowData({ data }));
}

export function* fetchShowEpisodesAsync() {
  yield takeLeading(FETCH_SEASON_DATA, fetchSeasonData);
}

export function* fetchShowDataAsync() {
  yield takeLeading(FETCH_SHOW_DATA, (action: AnyAction) => {
    const { category } = action.payload;
    switch (category) {
      case DATA_CONST.CATEGORIES.BOOKMARKS_CATEGORY:
        return fetchBookmarks();
      default:
        return fetchShowData(action);
    }
  });
}

export function* fetchSearchDataAsync() {
  yield takeLeading(FETCH_SEARCH_SHOW_DATA, fetchSearchData);
}

export function* fetchSourceDataAsync() {
  yield takeLeading(FETCH_SOURCE_DATA, fetchSourceData);
}
