import { combineReducers } from "redux";
import { shows, settings } from "./redux-store/reducers";

export default navigation => combineReducers({ shows, settings, navigation });
