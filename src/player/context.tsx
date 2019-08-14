import React, { useReducer, createContext, useContext } from "react";

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const initialState = {
  player: undefined,
  video: {
    paused: false,
    progress: undefined,
    duration: undefined,
    naturalSize: undefined,
    delta: 0,
    finished: false,
    isFetching: false,
    bufferedCount: 0
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TIME_PROGRESS_DELTA": {
      return {
        ...state,
        video: {
          ...state.video,
          delta: action.payload
        }
      };
    }
    case "TOGGLE_PAUSED": {
      return {
        ...state,
        video: {
          ...state.video,
          paused: !state.video.paused
        }
      };
    }
    case "SET_TIME_PROGRESS": {
      return {
        ...state,
        video: {
          ...state.video,
          progress: action.payload
        }
      };
    }
    case "SET_VIDEO_INFO": {
      return {
        ...state,
        video: {
          ...state.video,
          ...action.payload
        }
      };
    }
    case "SET_VIDEO_FINISHED": {
      return {
        ...state,
        video: {
          ...state.video,
          finished: action.payload
        }
      }
    }
    case "VIDEO_LOADING": {
      return  {
        ...state,
        video: {
          ...state.video,
          isFetching: true
        }
      }
    }
    case "VIDEO_LOADED": {
      return  {
        ...state,
        video: {
          ...state.video,
          isFetching: false
        }
      }
    }
    case "SET_BUFFERED_COUNT": {
      return {
        ...state,
        video: {
          ...state.video,
          bufferedCount: action.payload
        }
      }
    }
    default: {
      return state;
    }
  }
};

export const StateContext = createContext([]);

export const useStateValue = () => useContext(StateContext);
