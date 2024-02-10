import React, { useEffect, useState } from "react";

export const useAnimationFrame = (initialState: boolean = false, callback) => {
  const [state, setState] = useState(initialState);
  const [time, setTime] = useState(0);

  const play = () => {
    useState(true);
  };
  const pause = () => {
    useState(false);
  };

  useEffect(() => {
    if (!state) {
      return;
    }

    window.requestAnimationFrame((nextTime) => {
      if (time) {
        callback(time, nextTime - time);
      }

      setTime(nextTime);
    });
  }, [state, time]);

  useEffect(() => {
    setState(initialState);
  }, [initialState])

  return { play, pause, playing: state, time };
};
