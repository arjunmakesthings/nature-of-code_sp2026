//untitled; arjun; month, 2026.

/*
ask: 
use trigonometric functions and/or oscillating motion in a sketch. This is a very loose constraint and you should feel free to design your own exercise or pick from below.
*/

/*
thought: 
i was inspired by the fourier series, and used this time to explore that. 
*/

let c;

let movers = [];
let num = 500;

let t = 0;

let margin = 100;

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800); //square to handle calculations better.

  for (let i = 0; i < num; i++) {
    movers.push(new Mover(random(margin, width - margin), random(margin, height - margin)));
  }

  background(0);
}

function draw() {
  background(0, 20);

  for (let mover of movers) {
    mover.complete();
    mover.show();
  }

  // stroke(255, 100);
  // strokeWeight(0.5);

  // for (let i = 0; i < movers.length; i++) {
  //   line(movers[i].center.x, movers[i].center.y, movers[i].pos.x, movers[i].pos.y);
  // }

  // c = better_vec.from_coords(0, 0, 200, 200, true);

  // circle(c.x, c.y, 10, 10);
}

class Mover {
  constructor(init_x, init_y) {
    this.pos = createVector(init_x, init_y);
    this.center = createVector(init_x, init_y);

    this.angle = 0;

    this.r = random(20, 100);
    this.init_r = this.r;

    this.t = 0;
    this.t_inc = random(0.04, 0);

    this.dir = random(1);
  }
  show() {
    noStroke();
    fill(255);
    if (this.t > 0.1) {
      circle(this.pos.x, this.pos.y, 2);
    }
  }
  complete() {
    if (this.dir < 0.5) {
      this.pos.x = this.center.x + this.r * cos(this.t);
      this.pos.y = this.center.y + this.r * sin(this.t);
    } else {
      this.pos.x = this.center.x - this.r * cos(this.t);
      this.pos.y = this.center.y - this.r * sin(this.t);
    }
    this.t += this.t_inc;

    this.r = noise(this.t) * this.init_r;

    if ((this.t % Math.PI) * 2 < 0.01) {
      this.find_new_pos();
    }
  }
  find_new_pos() {
    this.center.set(this.pos.x + noise(this.t) * 2, this.pos.y + noise(this.t) * 2);
    noFill();
    // this.pos.set(random(margin, width - margin));
  }
}

class better_vec {
  static from_coords(x0, y0, x1, y1, show = false) {
    if (show == true) {
      //draw:
      push();
      translate(x0, y0);
      let curr_vec = createVector(x1, y1).sub(x0, y0);
      rotate(curr_vec.heading());

      stroke(255, 0, 0);

      line(0, 0, curr_vec.mag(), 0);

      fill(255, 0, 0);

      beginShape(TRIANGLES);
      vertex(curr_vec.mag(), 0);
      vertex(curr_vec.mag() - 10, 5);
      vertex(curr_vec.mag() - 10, -5);
      endShape();

      pop();
    }
    return createVector(x1, y1).sub(x0, y0);
  }

  static from_vec(vec1, vec2, show) {
    if (show == true) {
      stroke(255, 0, 0);
      line(vec1.x, vec1.y, vec2.x, vec2.y);
    }
    return createVector(x1, y1).sub(x0, y0);
  }
}
