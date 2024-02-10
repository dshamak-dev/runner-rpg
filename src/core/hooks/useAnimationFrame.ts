import React, { useEffect, useState } from "react";

export const useAnimationFrame = (initialState: boolean = false, callback) => {
  const [state, setState] = useState(initialState);
  const [lastTime, setTime] = useState(0);

  const play = () => {
    useState(true);
  };
  const pause = () => {
    useState(false);
    setTime(0);
  };

  useEffect(() => {
    if (!state) {
      return;
    }

    window.requestAnimationFrame((time) => {
      if (lastTime) {
        callback(time - lastTime);
      }

      setTime(time);
    });
  }, [state, lastTime]);

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  return { play, pause, playing: state, lastTime };
};
