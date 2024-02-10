import { createSlice } from "@reduxjs/toolkit";
import { concatObjects } from "src/core/support/object.utils";

export const initialSessionState = {
  paused: true,
  game: null,
};

export const STORE_NAME = "session";
export type StateType = typeof initialSessionState;

export const slice = createSlice({
  name: STORE_NAME,
  initialState: initialSessionState,
  reducers: {
    set: (state, { payload }) => {
      const nextState = concatObjects({}, initialSessionState, state, payload);

      Object.assign(state, nextState);
    },
    setPlay: (state, { payload }) => {
      state.paused = !payload;
    }
  },
});

export const sessionReducer = slice.reducer;

export const sessionActions = slice.actions;

export const sessionSelector = (state): StateType => {
  const store = state[STORE_NAME];

  return store;
};
