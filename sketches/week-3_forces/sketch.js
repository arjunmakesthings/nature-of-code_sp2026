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

let tp_vectors = [];

let shuffled = [];

//shader stuff:
let my_shader;

let cam;

let t;

function preload() {
  my_shader = loadShader("vert.vert", "frag.frag");
}

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  // createCanvas(800, 800); //square to handle calculations better.

  createCanvas(640, 480, WEBGL);
  cam = createCapture(VIDEO, { flipped: true });
  cam.hide();

  for (let i = 0; i < num; i++) {
    balls.push(new Ball());
  }

  shuffled = balls.slice();
  shuffle(shuffled, true);

  background(0);
  noStroke();
}

function draw() {
  background(0);

  t = millis() * 1000;

  // translate(-width / 2, -height / 2);
  cam.loadPixels(); //i'm going to read it later in display().

  shader(my_shader);

  my_shader.setUniform("u_res", [width, height]); //pass a uniform into the shader files as the resolution of the sketch.

  my_shader.setUniform("u_tex", cam); //set texture as uniform from cam.

  my_shader.setUniform("u_time", millis() * 0.001); // pass seconds.

  for (let ball of balls) {
    // ball.display();
    ball.move();
    ball.stay_in();
  }

  beginShape(QUAD_STRIP);
  for (let i = 0; i < shuffled.length - 2; i += 3) {
    let uv0 = createVector(shuffled[i].pos.x / width, shuffled[i].pos.y / height);
    let uv1 = createVector(shuffled[i + 1].pos.x / width, shuffled[i + 1].pos.y / height);
    let uv2 = createVector(shuffled[i + 2].pos.x / width, shuffled[i + 2].pos.y / height);

    uv0.add(noise(frameCount * 0.01));
    uv2.sub(noise(frameCount * 0.01));

    vertex(shuffled[i].pos.x, shuffled[i].pos.y, 0, uv0.x, uv0.y);
    vertex(shuffled[i + 1].pos.x, shuffled[i + 1].pos.y, 0, uv1.x, uv1.y);
    vertex(shuffled[i + 2].pos.x, shuffled[i + 2].pos.y, 0, uv2.x, uv2.y);
  }

  endShape(CLOSE);

  for (let i = 0; i < balls.length; i++) {
    for (let j = 0; j < balls.length; j++) {
      //don't check a ball with itself; of-course.
      if (i === j) continue;

      let dir = p5.Vector.sub(balls[j].pos, balls[i].pos); //distance between the two.

      // let dir_mag = dir.mag(); //magnitude of the distance

      dir.normalize();

      dir.mult(0.001);
      balls[i].applyForce(dir);
    }
  }
}

class Ball {
  constructor() {
    this.pos = createVector(random(margin, width - margin), random(margin, height - margin));

    this.mass = Math.floor(random(1, 10));

    this.speed = random(0.1, 0.5);
    this.vel = createVector(random(-this.speed, this.speed), random(-this.speed, this.speed));
  }
  display() {
    strokeWeight(5);
    stroke(255);
    vertex(this.pos);
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
