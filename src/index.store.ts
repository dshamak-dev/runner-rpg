import { createElement } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { appReducer, initialAppState } from "src/namespaces/app/app.store";
import {
  initialSessionState,
  sessionReducer,
} from "src/namespaces/session/session.store";
import { getApp } from "src/namespaces/app/app.api";
import { concatObjects } from "src/core/support/object.utils";
import { getSession } from "src/namespaces/session/session.api";

export const makeStore = (preloadedState = null) => {
  return configureStore({
    preloadedState: Object.assign({}, preloadedState),
    reducer: combineReducers({ app: appReducer, session: sessionReducer }),
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        serializableCheck: false,
      });
    },
  });
};

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState<AppStoreType>(null);

  const handleLoad = async () => {
    const appPayload = await getApp();
    const appState = concatObjects(initialAppState, appPayload);

    const sessionPayload = await getSession();
    const sessionState = concatObjects(initialSessionState, sessionPayload);

    setStore(makeStore({ app: appState, session: sessionState }));
  };

  useEffect(() => {
    handleLoad();
  }, []);

  if (!store) {
    return null;
  }

  return createElement(Provider, { store, children });
};

export type AppStoreType = ReturnType<typeof makeStore>;
