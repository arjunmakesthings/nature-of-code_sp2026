//untitled; arjun; month, 2026.

/*
ask: 

*/

/*
thought: 

*/

let something;

let marbles = [];
let num = 2;

let size_range = [25, 50];

let margin = 50;

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800); //square to handle calculations better.

  for (let i = 0; i < num; i++) {
    marbles.push(new Marble(random(margin, width - margin), random(margin, height - margin)));
  }
}

function draw() {
  background(0);

  // for (let marble of marbles) {
  //   marble.display();
  // }

  marbles.forEach(function (marble) {
    marble.display();

    let vel = createVector(3,0); 
    vel.rotate(random(PI*2)); 

    marble.move(vel);
  });
}

class Marble {
  constructor(x, y, s) {
    this.pos = createVector(x, y);

    this.s = random(size_range[0], size_range[1]);

    this.hue = Math.floor(random(100)); 
  }
  display() {
    push();

    translate(this.pos.x, this.pos.y);

    colorMode(HSL);

    fill (this.hue, 100,50); 
    circle(0, 0, this.s); 
    pop();
  }

  move(vel){
    this.pos.add(vel); 
  }
}
