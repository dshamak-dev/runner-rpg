import { describe, expect, test } from "@jest/globals";
import { GameObject } from "src/namespaces/session/session.model";
import { hasCollision } from "src/namespaces/session/session.utils";

describe("Session Utils", () => {
  const character: GameObject = {
    id: "1",
    position: { x: 1, y: 0 },
    rect: { width: 1, height: 1 },
  };

  test("should find collisions", () => {
    const a: GameObject = {
      id: "2",
      position: { x: 1, y: 0 },
      rect: { width: 1, height: 1 },
    };

    const b: GameObject = {
      id: "2",
      position: { x: 2, y: 2 },
      rect: { width: 1, height: 1 },
    };

    const c: GameObject = {
      id: "2",
      position: { x: 2, y: 1 },
      rect: { width: 1, height: 1 },
    };

    const hitA = hasCollision(character, a);
    const hitB = hasCollision(character, b);
    const hitC = hasCollision(character, c);

    expect(hitA).toBeTruthy();
    expect(hitB).toBeFalsy();
    expect(hitC).toBeTruthy();
  });
});
