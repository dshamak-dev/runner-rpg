import classNames from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Scene } from "src/core/components/molecules/Scene";
import {
  sessionActions,
  sessionSelector,
} from "src/namespaces/session/session.store";

import "/src/namespaces/session/session.css";
import { SessionGame } from "src/namespaces/session/session.model";
import { useAnimationFrame } from "src/core/hooks/useAnimationFrame";

interface Props {
  id?: string;
}

export const SessionScene: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const session = useSelector(sessionSelector);
  const game = useMemo(() => {
    return new SessionGame(session?.game || {});
  }, [session?.game]);

  const handleUpdate = useCallback((time, delta) => {
    if (game) {
      game.update(time, delta);
    }
    console.log("tick", delta);
  }, []);

  const isPlaying = useMemo(() => {
    if (!session || session.paused) {
      return false;
    }

    return !!game;
  }, [session, game]);

  const { time } = useAnimationFrame(
    isPlaying,
    handleUpdate
  );

  useEffect(() => {
    dispatch(sessionActions.setPlay(false));

    return () => {
      dispatch(sessionActions.setPlay(false));
    };
  }, []);

  return (
    <Scene name="session">
      <div
        className={classNames("relative", "w-full h-full", "flex items-center")}
      >
        <div
          id="session-game"
          className={classNames("relative", "w-full h-[30vw]")}
        >
          <div data-score></div>
          <div data-character></div>
          <div data-background></div>
        </div>
      </div>
    </Scene>
  );
};
