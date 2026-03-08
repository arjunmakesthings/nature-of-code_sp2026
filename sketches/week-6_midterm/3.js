/*
there is one world, and is created during the big-bang. 

the world has beings. beings do the following: 
- they are born. 
- they exist. 
- they die. 

*/

let world;

function setup() {
  createCanvas(1000, 1000);

  world = new World(0, 0);
  world.big_bang();
}
function draw() {
  world.run();
}

class World {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.beings = [];
  }
  big_bang() {
    let x = width / 2;
    let y = height / 2;
    this.beings.push(Being.birth(x, y));
  }
  run() {
    background(0);

    for (let being of this.beings) {
      being.live();
    }
  }
}

class Being {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(3, 0);
  }
  static birth(x, y) {
    return new Being(x, y);
  }
  live() {
    this.show();
    this.move();
  }
  show() {
    noFill();
    stroke(255);
    circle(this.pos.x, this.pos.y, 20);
  }
  move() {
    this.pos.add(this.vel);
    this.constrain();
  }
  constrain() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }
  static death() {}
}

//helper to keep time.
let day = 0;
let time = [0, 0, 0, 0]; //ms, seconds, minutes, hours.

function keep_time() {
  const ms = millis() - day;
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60));

  //one minute loop.
  if (seconds >= 30) {
    day = millis();
    time[0] = 0;
    time[1] = 0;
    time[2] = 0;
    time[3] = 0;
  } else {
    time[0] = Math.floor(ms);
    time[1] = seconds;
    time[2] = minutes;
    time[3] = hours;
  }
}
