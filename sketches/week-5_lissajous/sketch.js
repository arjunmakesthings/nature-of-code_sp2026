//untitled; arjun; month, 2026.

/*
ask: 

*/

/*
thought: 

*/

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800, WEBGL); //square to handle calculations better.

  background(0);
}

let step = 0;

function draw() {
  background(0, 20);

  let r1 = mouseX;
  let r2 = mouseY;

  strokeWeight(10);
  stroke(255);

  let x = cos(step) * r1;
  let y = sin(step) * r2;

  push();
  point(x, y);

  pop();

  step += 0.1;
}
