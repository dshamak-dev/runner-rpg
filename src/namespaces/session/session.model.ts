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

const spawnRate = [1500, 4000];

export interface GameObject {
  id: string;
  rect: { width: number; height: number };
  position: { x: number; y: number };
  type?: string;
}

const timeFactor = 1;
const Gravity = 0.0015;
const JUMP_SPEED = 0.45;
const SPEED = 0.05;
const characterReact = { width: 8, height: 10 * (1 + scale[1]) };
const POINTS_PER_DISTANCE = 0.1;

const ITEM_COOLDOWNS = [1000, 3000];

const SPEED_FACTOR = 0.0001;
const MAX_SPEED = 2.5;
const MIN_SPEED = 0.8;

export class SessionGame {
  time: number = 0;
  speed: number = 1;
  yVelocity: number = 0;
  distance: number = 0;
  character: GameObject;
  obstacles: GameObject[] = [];
  items: GameObject[] = [];
  spawnTimeout: number = spawnRate[1];
  gameOver: boolean = false;
  gameSpeed: number = 0.7;
  itemsCooldown?: number = 0;

  inAir: boolean = false;

  get score() {
    return Math.floor(this.distance * POINTS_PER_DISTANCE);
  }

  get width() {
    return width;
  }

  get height() {
    return height;
  }

  get unit() {
    return unit;
  }

  get jumpPower() {
    return JUMP_SPEED;
  }

  get horizontalSpeed() {
    return SPEED;
  }

  constructor({ obstacles, items = null, character, ...props }) {
    Object.assign(this, copyObject(props));

    this.obstacles = obstacles?.slice() || [];
    this.items = items ? items.slice() : [];

    this.character = character
      ? copyObject(character)
      : {
          id: "character",
          rect: characterReact,
          position: { x: 10, y: 0 },
          type: "",
        };
  }

  normalizeDeltaTime(deltaTime) {
    return this.gameOver ? 0 : Math.min(deltaTime, maxFPS);
  }

  normalizeSpeed(deltaTime) {
    return deltaTime * this.horizontalSpeed * this.gameSpeed;
  }

  update(deltaTime) {
    const _delta = this.normalizeDeltaTime(deltaTime);

    if (!_delta) {
      return;
    }

    let nextSpeed = this.gameSpeed + SPEED_FACTOR;

    this.gameSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, nextSpeed));

    this.time += _delta;

    const deltaSpeed = this.horizontalSpeed * _delta;

    this.distance += deltaSpeed;

    this.updateCharacter(_delta);

    this.updateObstacles(_delta);
    this.checkCollisions();
    this.updateItems(_delta);
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
    const gravity = Gravity;

    if (this.inAir) {
      y += this.yVelocity * delta;

      this.yVelocity -= gravity * delta;
    }

    if (this.inAir && y <= 0) {
      this.inAir = false;
      this.yVelocity = 0;

      y = 0;
    }

    this.character.position.y = y;
  }

  updateObstacles(_delta) {
    if (this.spawnTimeout <= 0) {
      this.spawn();

      this.spawnTimeout = randomNumber(spawnRate[0], spawnRate[1], true);
    } else {
      this.spawnTimeout = Math.max(
        0,
        this.spawnTimeout - _delta * this.gameSpeed
      );
    }

    const speed = this.normalizeSpeed(_delta);

    this.obstacles = this.obstacles
      .map((it) => {
        return {
          ...it,
          position: {
            ...it.position,
            x: it.position.x - speed,
          },
        };
      })
      .filter((it) => {
        return it.position.x > -10;
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
      x: 100,
      y: 0,
    };
    const obstacle: GameObject = {
      id: randomId(),
      position,
      rect: characterReact,
      type: "obstacle",
    };

    const minOffset = obstacle.rect.width * 2;
    const minX = position.x - minOffset / 2;

    const closest = this.obstacles.find((it) => it.position.x >= minX);
    if (closest) {
      obstacle.position.x += minOffset;
    }

    this.obstacles.push(obstacle);
  }

  updateItems(delta) {
    if (this.itemsCooldown <= 0) {
      this.spawnItem();

      this.itemsCooldown = randomNumber(
        ITEM_COOLDOWNS[0],
        ITEM_COOLDOWNS[1],
        true
      );
    } else {
      this.itemsCooldown = Math.max(
        0,
        this.itemsCooldown - delta * this.gameSpeed
      );
    }

    const speed = this.normalizeSpeed(delta);

    this.items = this.items
      .map((it) => {
        return {
          ...it,
          position: {
            ...it.position,
            x: it.position.x - speed,
          },
        };
      })
      .filter((it) => {
        return it.position.x > -10;
      });
  }

  spawnItem() {
    const item: GameObject = {
      id: randomId(),
      position: {
        x: 100,
        y: 0,
      },
      rect: { width: 2, height: 4 },
      type: "item",
    };

    this.items.push(item);
  }
}
