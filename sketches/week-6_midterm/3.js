/*
there is one world, and is created during the big-bang. 

the world has beings. beings do the following: 
- they are born. 
- they exist. 
- they die. 

the world keeps time. each day is day_length units long. 

*/

let world;

//time stuff:
let day_length = 24;
let day = 0;
let time = [0, 0, 0, 0]; //ms, seconds, minutes, hours.

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

    this.time = 0;
  }
  big_bang() {
    let x = width / 2;
    let y = height / 2;
    this.beings.push(Being.birth(x, y));
  }
  run() {
    background(0);
    this.time = keep_time();

    noStroke();
    fill(255, 0, 0);

    text("hour: " + this.time[1], 50, 50);

    for (let being of this.beings) {
      being.live(this.time);
    }
  }
}

class Being {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(3, 0);

    //beings have houses, and other destinations that they frequent.
    this.house = this.pos.copy();
    this.other_destinations = [];

    this.other_destinations.push({ x: this.pos.x, y: this.pos.y });

    this.other_destinations.push({ x: random(0, width), y: random(0, height) });

    this.schedule = this.make_schedule();

    this.new_pos = createVector(0, 0);

    this.speed = random(2); //everyone moves at different speeds.
  }

  //constructor helper to make a schedule:
  make_schedule() {
    let f = 24;
    let segments = Math.floor(random(3, 9));
    let cuts = [0];

    for (let i = 0; i < segments - 1; i++) {
      let cut;
      do {
        cut = Math.floor(random(1, f));
      } while (cuts.includes(cut));
      cuts.push(cut);
    }
    cuts.push(f);

    // Sort cut points
    cuts.sort((a, b) => a - b);

    // Build segments as [start, end] pairs
    let schedule = [];
    for (let i = 0; i < cuts.length - 1; i++) {
      schedule.push([cuts[i], cuts[i + 1]]);
    }

    return schedule;
  }
  static birth(x, y) {
    return new Being(x, y);
  }
  live(t) {
    this.show();
    this.move(t);
  }
  show() {
    noFill();
    stroke(255);
    circle(this.pos.x, this.pos.y, 20);
  }
  move(t) {
    this.constrain();

    //t[0] comes as a 24 second loop.

    for (let i = 0; i < this.schedule.length; i++) {
      if (i !== t[1]) continue; //if we're not checking against the current time, we don't care.

      //if i is the current time:

      if (i % 2 == 0) {
        //starting number of a pair.
        let n = Math.floor(random(this.other_destinations.length));
        this.new_pos.set(this.other_destinations[n].x, this.other_destinations[n].y);
      } else {
        //ending number of a pair.
      }

      let d = p5.Vector.sub(this.new_pos, this.pos);
      d.setMag(this.speed);

      this.pos.add(d);

      if (i === this.schedule.length) {
        this.add_posis();
      }
    }
  }
  add_posis() {
    this.other_destinations.push({ x: random(0, width), y: random(0, height) });
  }
  constrain() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }
  age() {}
  static death() {}
}

//helper to keep time.
function keep_time() {
  const ms = millis() - day;
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60));

  //one minute loop.
  if (seconds >= day_length) {
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

  return time;
}
