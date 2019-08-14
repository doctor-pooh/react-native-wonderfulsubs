import React, { useReducer, createContext, useContext } from "react";
import { set } from 'lodash';

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const initialState = {};

export const reducer = (state, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export const StateContext = createContext([]);

export const useStateValue = () => useContext(StateContext);