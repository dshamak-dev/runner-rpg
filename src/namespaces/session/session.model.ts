export class SessionGame {
  speed: number = 1;
  gravity: number = 1;
  yVelocity: number = 0;
  jumpPower: number = 3;
  distance: number = 0;

  constructor(props) {
    Object.assign(this, props);
  }

  update(time, deltaTime) {
    this.distance += this.speed * deltaTime; 

    console.log(this.distance);
  }
}
