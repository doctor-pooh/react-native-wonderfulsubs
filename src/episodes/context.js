import React, { useReducer, createContext, useContext } from "react";

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const initialState = {
  selectedSeason: 0
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_SEASON": {
      return {
        ...state,
        selectedSeason: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export const StateContext = createContext([]);

export const useStateValue = () => useContext(StateContext);
