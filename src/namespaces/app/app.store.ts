import { createSlice } from "@reduxjs/toolkit";
import { concatObjects, copyObject } from "src/core/support/object.utils";
import { setApp } from "src/namespaces/app/app.api";

export const initialAppState = {
  scene: "landing",
};

export const STORE_NAME = "app";
export type StateType = typeof initialAppState;

export const slice = createSlice({
  name: STORE_NAME,
  initialState: initialAppState,
  reducers: {
    set: (state, { payload }) => {
      const nextState = concatObjects({}, initialAppState, state, payload);

      setApp(copyObject(nextState));

      Object.assign(state, nextState);
    },
    navigateTo: (state, { payload }) => {
      if (!state) {
        return initialAppState;
      }

      if (payload) {
        Object.assign(state, payload);

        setApp(copyObject(state));
      }
    },
  },
});

export const appReducer = slice.reducer;

export const appActions = slice.actions;

export const appSelector = (state) => {
  const store = state[STORE_NAME];

  return store;
};
