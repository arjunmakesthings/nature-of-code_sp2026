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

let t_points = [];
let font; 

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(windowWidth, windowHeight); //square to handle calculations better.

  //text:
  t_points = convert_text_to_points("you & i \n can only \n cause chaos", 0, 0, width, height, 2, 160, "serif", CENTER, CENTER);

  for (let i = 0; i < t_points.length; i++) {
    fill(255);
    // circle(t_points[i].x, t_points[i].y, 3);
    movers.push(new Mover(t_points[i].x, t_points[i].y));
  }

  background(0);
}

function draw() {
  background(0, 2);

  for (let mover of movers) {
    mover.complete();
    mover.show();
  }
}

class Mover {
  constructor(init_x, init_y) {
    this.starting_displacement = random(-6, 6);
    this.pos = createVector(init_x + this.starting_displacement, init_y + this.starting_displacement);
    this.center = createVector(init_x + this.starting_displacement, init_y + this.starting_displacement);

    this.angle = 0;

    this.r = random(2, 20);
    this.init_r = this.r;

    this.t = 0;
    this.t_inc = random(0.04, 0);

    this.dir = random(1);

    this.d = 1;
  }
  show() {
    noStroke();
    fill(255);
    if (this.t > 0.5) {
      circle(this.pos.x, this.pos.y, 0.5);
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

    this.r = noise(this.t * this.d) * this.init_r;

    if ((this.t % Math.PI) * 2 < 0.01) {
      this.find_new_pos();
    }
  }
  find_new_pos() {
    this.center.set(this.pos.x + noise(this.t) * 2, this.pos.y + noise(this.t) * 2);
    this.r += this.r * 0.2;
    this.int_r = this.r;
    this.d += this.d * 0.2;
    noFill();
  }
}

// class better_vec {
//   static from_coords(x0, y0, x1, y1, show = false) {
//     if (show == true) {
//       //draw:
//       push();
//       translate(x0, y0);
//       let curr_vec = createVector(x1, y1).sub(x0, y0);
//       rotate(curr_vec.heading());

//       stroke(255, 0, 0);

//       line(0, 0, curr_vec.mag(), 0);

//       fill(255, 0, 0);

//       beginShape(TRIANGLES);
//       vertex(curr_vec.mag(), 0);
//       vertex(curr_vec.mag() - 10, 5);
//       vertex(curr_vec.mag() - 10, -5);
//       endShape();

//       pop();
//     }
//     return createVector(x1, y1).sub(x0, y0);
//   }

//   static from_vec(vec1, vec2, show) {
//     if (show == true) {
//       stroke(255, 0, 0);
//       line(vec1.x, vec1.y, vec2.x, vec2.y);
//     }
//     return createVector(x1, y1).sub(x0, y0);
//   }
// }
