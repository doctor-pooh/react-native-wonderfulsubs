import { combineReducers } from "redux";
import { shows } from "./redux-store";

export default navigation => combineReducers({ shows, navigation });
