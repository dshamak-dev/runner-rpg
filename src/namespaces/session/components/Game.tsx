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

  const {
    inAir,
    width,
    height,
    unit,
    character,
    obstacles,
    items,
    gameSpeed,
    score,
  } = game;

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
      <div data-score>
        <div>Speed: {(gameSpeed || 0).toFixed(1)}</div>
        <div>Score: {score}</div>
      </div>
      <div
        data-character
        data-air={inAir}
        style={
          {
            "--y": character.position.y,
            "--x": character.position.x,
            "--width": character.rect.width,
            "--height": character.rect.height,
          } as any
        }
      ></div>
      {[...obstacles, ...items].map((it, index) => {
        return (
          <div
            key={it.id}
            data-obstacle={it.type}
            style={
              {
                "--y": it.position.y,
                "--x": it.position.x,
                "--width": it.rect.width,
                "--height": it.rect.height,
              } as any
            }
          ></div>
        );
      })}
      <div data-background></div>
    </div>
  );
};
