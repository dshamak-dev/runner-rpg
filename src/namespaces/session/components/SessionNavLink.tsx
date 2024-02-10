import { faForward, faForwardStep, faPause, faPlay, faRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SceneNavLink } from "src/core/components/molecules/SceneNavLink";
import { appSelector } from "src/namespaces/app/app.store";
import {
  sessionActions,
  sessionSelector,
} from "src/namespaces/session/session.store";

interface Props {}

export const SessionNavLink: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appSelector);
  const { scene, query } = appState;
  const { paused, game } = useSelector(sessionSelector);

  const isActiveScene = useMemo(() => {
    return scene === "session";
  }, [scene]);

  const icon = useMemo(() => {
    if (!isActiveScene) {
      return game ? faForwardStep : faRunning;
    }

    return paused ? faPlay : faPause;
  }, [paused, game]);

  const handleClick = useCallback(() => {
    const canToggle = isActiveScene;

    dispatch(sessionActions.setPlay(canToggle ? paused : false));
  }, [isActiveScene, paused]);

  return (
    <SceneNavLink to="session" query={query} onClick={handleClick}>
      <FontAwesomeIcon icon={icon} />
    </SceneNavLink>
  );
};
