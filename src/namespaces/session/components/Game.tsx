import classNames from "classnames";
import React, { useMemo } from "react";
import { SessionGame } from "src/namespaces/session/session.model";

interface Props {
  game: SessionGame;
}

export const Game: React.FC<Props> = ({ game }) => {
  if (!game) {
    return null;
  }

  const { inAir, width, height, unit, character, obstacles } = game;

  const styles = useMemo(() => {
    return {
      canvas: {
        "--width": width,
        "--height": height,
        "--unit": unit,
      },
    } as any;
  }, [width, height, unit]);

  return (
    <div
      id="session-game"
      className={classNames("relative w-full overflow-hidden")}
      style={styles.canvas}
    >
      <div data-score></div>
      <div
        data-character
        data-air={inAir}
        style={
          {
            "--y": character.position.y,
            "--x": character.position.x,
          } as any
        }
      ></div>
      {obstacles.map((it, index) => {
        return (
          <div
            key={it.id}
            data-obstacle={it.type}
            style={
              {
                "--y": it.position.y,
                "--x": it.position.x,
              } as any
            }
          ></div>
        );
      })}
      <div data-background></div>
    </div>
  );
};
