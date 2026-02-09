//untitled; arjun; february, 2026.

/*
ask: 
make a sketch with forces. 
*/

/*
thought: 

*/

let balls = [];
let num = 200;

let margin = 50;

let text_to_points = [];

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800); //square to handle calculations better.

  for (let i = 0; i < num; i++) {
    balls.push(new Ball());
  }

  let boxW = width * 0.8; // or any desired width
  let boxH = height; // or any desired height
  let x = width / 2 - boxW / 2;
  let y = height / 2 - boxH / 2;

  text_to_points = convert_text_to_points(
    "all the chaos in the world only pulls me closer to you",
    x,
    y, // Top-left of bounding box
    boxW,
    boxH, // Bounding box size
    3,
    100, // gridSize, fontSize
    "Arial",
    CENTER,
    CENTER,
  );

  background(0);
}

function draw() {
  //background(0, 90);

  for (let i = 0; i < text_to_points.length; i++) {
    stroke(255);

    strokeWeight(1);
    point(text_to_points[i].x, text_to_points[i].y);
  }

  // for (let ball of balls) {
  //   ball.display();
  //   ball.move();
  //   ball.stay_in();
  // }

  // for (let i = 0; i < balls.length; i++) {
  //   for (let j = 0; j < balls.length; j++) {
  //     //don't check a ball with itself; of-course.
  //     if (i === j) continue;

  //     let dir = p5.Vector.sub(balls[j].pos, balls[i].pos); //distance between the two.

  //     // let dir_mag = dir.mag(); //magnitude of the distance

  //     dir.normalize();

  //     dir.mult(0.01);
  //     balls[i].applyForce(dir);
  //   }
  // }
}

class Ball {
  constructor() {
    this.pos = createVector(random(margin, width - margin), random(margin, height - margin));

    this.mass = Math.floor(random(1, 10));

    this.speed = random(1, 5);
    this.vel = createVector(random(-this.speed, this.speed), random(-this.speed, this.speed));
  }
  display() {
    strokeWeight(0.5);
    stroke(255);
    point(this.pos.x, this.pos.y);
  }
  move() {
    // this.vel.mult(0.99); // Damping
    this.pos.add(this.vel);
  }
  stay_in() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    } else if (this.pos.y < 0 || this.pos.y > height) {
      //it is out of bounds.
      this.vel.y *= -1;
    }
  }
  applyForce(force) {
    let f = force.copy();

    f.div(this.mass);

    this.vel.add(f);
  }
}
