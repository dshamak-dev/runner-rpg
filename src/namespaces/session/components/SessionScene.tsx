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
import { setSession } from "src/namespaces/session/session.api";
import { copyObject } from "src/core/support/object.utils";
import { Game } from "src/namespaces/session/components/Game";
import { createGame } from "src/namespaces/session/session.utils";

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
      game.update(delta);

      setSession({ game: copyObject(game) });
    }
  }, [game]);

  const isGameOver = useMemo(() => {
    if (!session) {
      return false;
    }

    return game?.gameOver;
  }, [session, game?.gameOver]);

  const isPlaying = useMemo(() => {
    if (!session || session.paused || isGameOver) {
      return false;
    }

    return !!game;
  }, [session, game, isGameOver]);

  const { time } = useAnimationFrame(isPlaying, handleUpdate);

  const handlePlay = () => {
    if (isGameOver) {
      dispatch(sessionActions.set({ paused: false, game: createGame() }));
    } else {
      dispatch(sessionActions.setPlay(true));
    }
  };

  const handleClick = useCallback(() => {
    if (!isPlaying) {
      handlePlay();
      return;
    }

    if (game?.jump) {
      game.jump();
    }
  }, [game, isPlaying]);

  useEffect(() => {
    const handler = (e) => {
      const isKey = e.code === "Space";

      if (!isKey) {
        return;
      }

      if (!isPlaying) {
        handlePlay();
        return;
      }

      if (game) {
        game.jump();
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [isPlaying]);

  useEffect(() => {
    dispatch(sessionActions.setPlay(false));

    return () => {
      if (game) {
        dispatch(sessionActions.set({ paused: true, game }));
        return;
      }

      dispatch(sessionActions.setPlay(false));
    };
  }, []);

  return (
    <Scene name="session">
      <div
        onClick={handleClick}
        className={classNames(
          "relative",
          "w-full h-full oveflow-hidden",
          "flex items-center"
        )}
      >
        {isPlaying ? null : (
          <div
            className={classNames(
              "absolute z-20",
              "w-full h-full",
              "flex items-center justify-center",
              "bg-black/30 text-white uppercase"
            )}
          >
            <span>{isGameOver ? "Game Over. Restart?" : "tap to play"}</span>
          </div>
        )}
        <Game game={game} />
      </div>
    </Scene>
  );
};
