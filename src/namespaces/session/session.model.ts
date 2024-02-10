import { copyObject } from "src/core/support/object.utils";
import { randomId, randomNumber } from "src/core/support/random.utils";
import {
  getGameObjectCoolrds,
  hasCollision,
} from "src/namespaces/session/session.utils";

const maxFPS = 30;

let unit = 0;
const scale = [1, 0.5]; // width / height
const widthInUnits = 10;
let screenWidth = 0;
let screenHeight = 0;
let width = 0;
let height = 0;

function calculate() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  width = screenWidth * scale[0];
  height = width * scale[1];

  unit = width / widthInUnits;
}

calculate();

document.addEventListener("resize", calculate);

const spawnRate = [200, 2000];

export interface GameObject {
  id: string;
  rect: { width: 1; height: 1 };
  position: { x: number; y: number };
  type?: string;
}

const timeFactor = 0.5;

export class SessionGame {
  time: number = 0;
  speed: number = 1;
  gravity: number = 0.2;
  yVelocity: number = 0;
  jumpPower: number = 4;
  distance: number = 0;
  character: GameObject;
  obstacles: GameObject[] = [];
  spawnTimeout: number = 0;
  gameOver: boolean = false;

  y: number = 0;
  inAir: boolean = false;

  get width() {
    return width;
  }

  get height() {
    return height;
  }

  get unit() {
    return unit;
  }

  constructor({ obstacles, character, ...props }) {
    Object.assign(this, copyObject(props));

    this.obstacles = obstacles?.slice() || [];

    this.character = character
      ? copyObject(character)
      : {
          id: "character",
          rect: { width: 1, height: 1 },
          position: { x: 1.5, y: 0 },
          type: "",
        };
  }

  normalizeDeltaTime(deltaTime) {
    return this.gameOver ? 0 : Math.min(deltaTime, maxFPS) * timeFactor;
  }

  getVelocity(deltaTime) {
    return (this.normalizeDeltaTime(deltaTime) * this.speed) / unit;
  }

  update(deltaTime) {
    const _delta = this.normalizeDeltaTime(deltaTime);

    if (!_delta) {
      return;
    }

    this.time += _delta;

    const deltaSpeed = this.getVelocity(deltaTime);

    this.distance += deltaSpeed;

    this.updateCharacter(_delta);

    if (this.spawnTimeout <= 0) {
      this.spawn();

      this.spawnTimeout = randomNumber(spawnRate[0], spawnRate[1], true);
    } else {
      this.spawnTimeout = Math.max(0, this.spawnTimeout - _delta);
    }

    this.updateObstacles(_delta);
    this.checkCollisions();
  }

  jump() {
    if (this.inAir) {
      return;
    }

    this.yVelocity = this.jumpPower;
    this.inAir = true;
  }

  updateCharacter(delta) {
    let y = this.character.position.y;

    if (this.inAir) {
      this.yVelocity -= this.gravity;

      y += this.gravity * (this.yVelocity > 0 ? 1 : -1);
    }

    if (this.inAir && y <= 0) {
      this.inAir = false;
      y = 0;
      this.yVelocity = 0;
    }

    this.character.position.y = y;
  }

  updateObstacles(deltaTime) {
    const velocity = this.getVelocity(deltaTime);

    this.obstacles = this.obstacles
      .map((it) => {
        return {
          ...it,
          position: {
            ...it.position,
            x: it.position.x - velocity,
          },
        };
      })
      .filter((it) => {
        return it.position.x > -1;
      });
  }

  checkCollisions() {
    const charCoords = getGameObjectCoolrds(this.character);

    if (!charCoords) {
      return false;
    }

    const hasHit = this.obstacles.find((it) => {
      return hasCollision(this.character, it);
    });

    if (hasHit) {
      this.gameOver = true;
    }
  }

  spawn() {
    const position = {
      x: widthInUnits + 1,
      y: 0,
    };
    const obstacle: GameObject = {
      id: randomId(),
      position,
      rect: { width: 1, height: 1 },
      type: "obstacle",
    };

    const minOffset = 3;

    if (this.obstacles.find((it) => it.position.x >= position.x - minOffset)) {
      obstacle.position.x += minOffset;
    }

    this.obstacles.push(obstacle);
  }
}
