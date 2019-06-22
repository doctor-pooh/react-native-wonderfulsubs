import { createReducer } from "../redux-utils";

import {
  FETCHED_SHOW_DATA,
  FETCH_SHOW_DATA,
  UPDATE_SHOW_DATA,
  FETCH_SEARCH_SHOW_DATA,
  FETCHED_SEARCH_SHOW_DATA,
  FETCH_SEASON_DATA
} from "./actionTypes";

const fetchedShowData = (state, action) => ({
  ...state,
  ...action.payload,
  isFetching: false
});

const fetchedSearchShowData = (state, action) => ({
  ...state,
  ...action.payload,
  isFetching: false
});

const updateShowData = (state, action) => {
  const { id, data } = action.payload;
  return {
    ...state,
    showData: data
  };
};

const isFetchingShowsData = (state, { payload: { infiniteScroll } }) => ({
  ...state,
  data: infiniteScroll ? state.data : {},
  isFetching: true
});

const isFetchingSearchData = state => ({
  ...state,
  data: {},
  isFetching: true
});

const isFetchingSeasonData = state => ({
  ...state,
  showData: {},
  isFetching: true
});

export default createReducer(
  {
    data: {},
    showData: {},
    searchData: {},
    isFetching: false
  },
  {
    [FETCH_SHOW_DATA]: isFetchingShowsData,
    [FETCH_SEARCH_SHOW_DATA]: isFetchingSearchData,
    [FETCH_SEASON_DATA]: isFetchingSeasonData,
    [FETCHED_SEARCH_SHOW_DATA]: fetchedSearchShowData,
    [FETCHED_SHOW_DATA]: fetchedShowData,
    [UPDATE_SHOW_DATA]: updateShowData
  }
);
