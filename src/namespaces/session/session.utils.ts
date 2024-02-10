import { GameObject, SessionGame } from "src/namespaces/session/session.model";

export const createGame = () => {
  return new SessionGame({ obstacles: [], character: null });
};

export const getGameObjectCoolrds = ({ position, rect }) => {
  if (!position || !rect) {
    return null;
  }

  const lb = { x: position.x, y: position.y };
  const lt = { y: position.y + rect.height, x: position.x };
  const rb = { x: position.x + rect.width, y: position.y };
  const rt = { x: position.x + rect.width, y: position.y + rect.height };

  return { lb, lt, rb, rt };
};

export const isPositionInArea = ({ x, y }, targetCoords): boolean => {
  const hitWidth = x >= targetCoords.lb.x && x <= targetCoords.rb.x;
  const hitHeight = y >= targetCoords.lb.y && y <= targetCoords.lt.y;

  return hitWidth && hitHeight;
};

export const hasCollision = (a: GameObject, b: GameObject): boolean => {
  const aCoords = getGameObjectCoolrds(a);

  if (!aCoords) {
    return false;
  }

  const bCoords = getGameObjectCoolrds(b);

  if (!bCoords) {
    return false;
  }

  const hitLB = isPositionInArea(aCoords.lb, bCoords);

  if (hitLB) {
    return true;
  }

  const hitRB = isPositionInArea(aCoords.rb, bCoords);

  if (hitRB) {
    return true;
  }

  const hitLT = isPositionInArea(aCoords.lt, bCoords);

  if (hitLT) {
    return true;
  }

  return isPositionInArea(aCoords.rt, bCoords);
};
