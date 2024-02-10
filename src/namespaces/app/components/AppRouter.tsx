import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Scene } from "src/core/components/molecules/Scene";
import { appActions, appSelector } from "src/namespaces/app/app.store";
import { LandingScene } from "src/namespaces/landing/components/LandingScene";
import { MarketScene } from "src/namespaces/market/components/MarketScene";
import { SessionScene } from "src/namespaces/session/components/SessionScene";

export type AppSceneType = "landing" | "session" | "market";
const navigateEventName = "navigateTo";

export const handleNavigate = (scene: AppSceneType, query?: Object) => {
  const event = new CustomEvent(navigateEventName, {
    detail: {
      scene,
      query,
    },
  });

  document.dispatchEvent(event);
};

export const preventBrowserHistory = () => {
  function disableBack() {
    window.history.forward();
  }
  setTimeout(disableBack, 0);
  window.onunload = function () {
    null;
  };
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
};

export const AppRouter = (): ReactElement<typeof Scene> => {
  const store = useSelector(appSelector);
  const dispatch = useDispatch();

  const navigateTo = (scene, query) => {
    dispatch(appActions.navigateTo({ scene, query }));
  };

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const _path = e.detail?.scene;
      const _query = e.detail?.query;

      if (_path) {
        navigateTo(_path, _query);
      }
    };

    document.addEventListener(navigateEventName, handler);

    preventBrowserHistory();

    return () => {
      document?.removeEventListener(navigateEventName, handler);
    };
  }, [dispatch]);

  if (!store) {
    return null;
  }

  const { scene, query } = store;

  switch (scene) {
    case "session": {
      return <SessionScene id={query?.id} />;
    }
    case "market": {
      return <MarketScene />;
    }
    default:
    case "landing": {
      return <LandingScene />;
    }
  }
};
