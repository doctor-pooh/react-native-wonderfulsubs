import React, { useReducer, createContext, useContext } from "react";

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const initialState = {
  selectedShow: undefined,
  selectedCategory: undefined,
  searchBarVisible: false,
  descriptionIsVisible: false 
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_SHOW": {
      return { ...state, selectedShow: action.payload, descriptionIsVisible: true };
    }
    case "SET_SELECTED_CATEGORY": {
      return {...state, selectedCategory: action.payload};
    }
    case "UPDATE_SEARCH_BAR_VISIBILITY": {
      return {...state, searchBarVisible: action.payload}
    }
    case "SET_DESCRIPTION_VISIBLE": {
      return {...state, descriptionIsVisible: action.payload}
    }
    default: {
      return state;
    }
  }
};

export const StateContext = createContext([]);

export const useStateValue = () => useContext(StateContext);
