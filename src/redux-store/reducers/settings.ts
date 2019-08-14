import { createReducer } from "../../redux-utils";
import {set} from 'lodash';
import {
  SET_OPTION,
  INITIALIZE_OPTIONS
} from "../actionTypes";

const updateSettings = (state, action) => {
  const { path, value } = action.payload;
  return { ...state, ...set(state, path, value) };
}

const initSettings = (state, action) => {
  return {...state, ...action.payload};
}

export default createReducer(
  {},
  {
    [SET_OPTION]: updateSettings,
    [INITIALIZE_OPTIONS]: initSettings
  }
);
