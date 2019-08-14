import { put, takeLeading, select, takeLatest } from "redux-saga/effects";
import { set } from 'lodash';
import {
  FETCH_SHOW_DATA,
  FETCH_SEASON_DATA,
  FETCH_SEARCH_SHOW_DATA,
  FETCH_SOURCE_DATA,
  SET_OPTION
} from "./actionTypes";
import { 
  updateShowData, 
  fetchedShowData, 
  searchedShowData, 
  initializeSettings 
} from "./actions";
import { AnyAction } from "redux";
import { NavigationActions } from "react-navigation";
import { DATA_CONST } from "../constants";
import { Show, Source } from "../types";

function* fetchShowData({ payload: { category } }: AnyAction) {
  const data = <Show[]>(yield global
    .__provider()
    .fetchShows({ name: "", type: category }));
  yield put(fetchedShowData({ data }));
}

function* fetchSeasonData({ payload: { id } }: AnyAction) {
  const data = <Show>(yield global.__provider().fetchSeasons({ showId: id }));
  yield put(updateShowData({ showId: id, data }));
}

function* fetchSearchData({ payload: { query } }: AnyAction) {
  const searchData = <Show[]>(yield global.__provider().searchShows({ query }));
  yield put(searchedShowData({ searchData }));
}

function* fetchSourceData({
  payload: { showId, seasonId, episodeId, stalledSourceId }
}: AnyAction) {
  const { data, source } = <{ data: Show, source: Source }>(yield global
    .__provider()
    .fetchSources({ showId, seasonId, episodeId, badSourceId: stalledSourceId }));
  yield put(
    NavigationActions.navigate({
      routeName: "Player",
      key: "Player",
      params: { uri: source.url, showId, seasonId, episodeId, source }
    })
  );
  yield put(updateShowData({ showId, data }));
}

function* updateSettings({ payload: { path, value } }: AnyAction) {
  const {settings} = yield select();
  const updatedSettings = set(settings, path, value);
  yield global.__provider().getSettings().updateSettings(updatedSettings);
}

export function* autoStart() {
  const settings = yield global.__provider().getSettings().getSettings();
  yield put(initializeSettings(settings));
};

export function* fetchShowEpisodesAsync() {
  yield takeLeading(FETCH_SEASON_DATA, fetchSeasonData);
}

export function* fetchShowDataAsync() {
  yield takeLeading(FETCH_SHOW_DATA, (action: AnyAction) => {
    const { category } = action.payload;
    switch (category) {
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

export function* updateSettingsAsync() {
  yield takeLatest(SET_OPTION, updateSettings)
}