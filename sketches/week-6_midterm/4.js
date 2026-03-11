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

  background(0);
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

    //helpers for calculations:
    this.prev_hour = -1;

    this.polyGroups = [];
  }
  big_bang() {
    for (let i = 0; i < 200; i++) {
      // let x = width / 2;
      // let y = height / 2;
      // this.beings.push(Being.birth(x, y));
      this.beings.push(Being.birth(random(width), random(height)));
    }
    // let x = width / 2;
    // let y = height / 2;
    // this.beings.push(Being.birth(x, y));
  }
  run() {
    // background(0);
    this.time = keep_time();

    let hour = this.time[1];

    // spawn new beings every hour
    if (this.prev_hour != hour) {
      let n = Math.floor(random(0, 20));
      for (let i = 0; i < n; ++i) {
        this.beings.push(Being.birth(random(width), random(height)));
      }
    }
    this.prev_hour = hour;

    noStroke();
    fill(255);

    text("hour: " + this.time[1], 50, 50);

    // -- LIVE AND DIE
    for (let i = this.beings.length - 1; i >= 0; i--) {
      let being = this.beings[i];
      being.live(this.time);
      if (!being.alive) this.beings.splice(i, 1);
    }

    // -- POLYGON DETECTION AND SMOOTHING
    let threshold = 50;
    let newGroups = [];
    let visited = new Set();

    for (let i = 0; i < this.beings.length; i++) {
      if (visited.has(i)) continue;

      let neighbors = [this.beings[i]];
      for (let j = i + 1; j < this.beings.length; j++) {
        let d = p5.Vector.dist(this.beings[i].pos, this.beings[j].pos);
        if (d < threshold) neighbors.push(this.beings[j]);
      }

      if (neighbors.length > 2) {
        neighbors.forEach((b) => visited.add(this.beings.indexOf(b)));

        // compute centroid
        let cx = neighbors.reduce((sum, b) => sum + b.pos.x, 0) / neighbors.length;
        let cy = neighbors.reduce((sum, b) => sum + b.pos.y, 0) / neighbors.length;

        // sort neighbors by angle
        neighbors.sort((a, b) => atan2(a.pos.y - cy, a.pos.x - cx) - atan2(b.pos.y - cy, b.pos.x - cx));

        // smooth positions
        neighbors.forEach((b) => {
          if (!b.displayPos) b.displayPos = b.pos.copy();
          b.displayPos.lerp(b.pos, 0.1); // slower lerp for smoother motion
        });

        // compute average age for fade-in opacity
        let avg_age = neighbors.reduce((sum, b) => sum + b.curr_age, 0) / neighbors.length;
        let opacity = map(avg_age, 0, 80, 0, 255);

        // store polygon group for smoother transitions
        newGroups.push({ neighbors, opacity });
      }
    }

    // -- DRAW POLYGONS WITH FADE
    this.polyGroups.forEach((g) => {
      fill(255, 255, 255, g.opacity * 0.5); // white polygons with age-based opacity
      beginShape();
      let pts = g.neighbors.map((b) => b.displayPos);
      pts.push(pts[0]); // repeat first point at end
      pts.unshift(pts[pts.length - 2]); // repeat last actual point at start
      pts.forEach((p) => curveVertex(p.x, p.y));
      endShape(CLOSE);

      // fade old polygons gradually
      g.opacity = lerp(g.opacity, 0, 0.01);
    });

    // update polyGroups with newly detected groups
    this.polyGroups = newGroups;
  }
}

class Being {
  constructor(x, y) {
    //beings have positions in space.
    this.pos = createVector(x, y);
    this.vel = createVector(3, 0);

    //they have houses, and other destinations that they frequent.
    this.home = this.pos.copy();
    this.other_destinations = [];
    this.other_destinations.push({ x: this.home.x, y: this.home.y }); //the first position in other destinations is always home.

    //they live by a schedule.
    this.schedule = this.make_schedule();

    //they have a current-age.
    this.curr_age = 0;

    //they have a dying rate.
    this.dying_rate = 0;

    //they have the probability to die.
    this.prob_to_die = 0;

    //they have a mass.
    this.mass = 1;

    //they move at different speeds.
    this.speed = random(0, 2);

    this.alive = true;

    //helper variables to do calculations.
    this.current_hour = -1; //remember last hour to prevent jittering.
    this.new_pos = createVector(x, y);

    //helper allocations:
    this.other_destinations.push({ x: random(0, width), y: random(0, height) });
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
    // this.show();
    this.move(t);
    this.age();
    this.die();
  }

  show() {
    let c = map(this.curr_age, 0, 80, 255, 50);
    fill(c);
    circle(this.pos.x, this.pos.y, this.mass);
  }

  move(t) {
    this.constrain();

    //t[0] comes as a 24 second loop.
    let hour = t[1];

    //only pick a new destination when the hour changes
    if (hour !== this.current_hour) {
      this.current_hour = hour;

      for (let i = 0; i < this.schedule.length; i++) {
        if (i !== hour) continue; //if we're not checking against the current time, we don't care.

        //if i is the current time:
        if (i % 2 == 0) {
          //starting number of a pair.
          let n = Math.floor(random(this.other_destinations.length));
          this.new_pos.set(this.other_destinations[n].x, this.other_destinations[n].y);
        }

        if (i === this.schedule.length - 1) {
          this.add_posis();
        }
      }
    }

    //move toward the chosen destination every frame
    let d = p5.Vector.sub(this.new_pos, this.pos);

    if (d.mag() > this.speed) {
      d.setMag(this.speed);
      this.pos.add(d);
    } else {
      this.pos = this.new_pos.copy();
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

  age() {
    this.curr_age += this.dying_rate;

    this.dying_rate += abs(noise(frameCount) * 0.00005); //dying rate keeps changing between 0,1.

    this.mass += this.curr_age * 0.005;
    this.mass = constrain(this.mass, 1, 20);
  }

  die() {
    //as beings get older, their probability to die increases.
    this.prob_to_die = this.curr_age * 0.00005;

    //probability can never exceed 1.
    this.prob_to_die = constrain(this.prob_to_die, 0, 1);

    this.mass -= this.prob_to_die;

    let n = random();

    if (n < this.prob_to_die) {
      this.alive = false;
    }
  }
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
