//untitled; arjun; month, 2026.

/*
ask: 
Try using vectors ... 
*/

/*
thought: 
love is a vector in space. 

borrowed from the 'red thread of fate', people are born connected to one another, but they move about randomly. however, fate (or the algorithm of the universe) brings them closer together. some of them reach in time & accept, thereby being with each other. some of them don't, and die alone. 
*/

let people = [];

let population = Math.floor(8272166038 / 100000000); //taken the actual population, but divided it to make it behave.

//people things:
const skins = [
  "#FFD1A3", // Fair
  "#F4A460", // Light
  "#D2691E", // Medium
  "#A0522D", // Olive
  "#704214", // Deep
  "#3E2723", // Dark
  "#8B4513", // Brown
  "#CD853F", // Peru
  "#DEB887", // Burlywood
];

let size_range = [2, 10];

//ui stuff:
let margin = 50;

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800, WEBGL); //square to handle calculations better.

  for (let i = 0; i < population; i++) {
    people.push(new Person(random(margin, width - margin), random(margin, height - margin), random(margin, width - margin)));
  }

  //god assigns a partner to each person at birth.
  assign_partner();

  //white screen:
  background(255);
}

/* helper written by a llm to assign a partner to each person. */
function assign_partner() {
  let shuffled = people.slice().sort(() => Math.random() - 0.5); //shuffles the array.

  // Pair them up sequentially
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    shuffled[i].partner = shuffled[i + 1];
    shuffled[i + 1].partner = shuffled[i];
  }

  // If odd number of people, last person gets no partner
  if (shuffled.length % 2 === 1) {
    shuffled[shuffled.length - 1].partner = null;
  }
}

function draw() {
  background(255);

  orbitControl();

  push();
  translate(-width / 2, -height / 2);
  for (person of people) {
    person.red_line();
    person.display();

    if (frameCount % 60 == 0){
      //every one second: 
      person.move(); 
    }
  }
  pop();
}

class Person {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);

    this.dest_pos = createVector(x, y, z);

    this.size = Math.floor(random(size_range[0], size_range[1]));

    this.skin_color = random(skins);

    this.prob = 0; 
  }

  display() {
    stroke(this.skin_color);
    strokeWeight(this.size);
    point(this.pos);

    this.pos.x = lerp(this.pos.x, this.dest_pos.x, 0.1);
    this.pos.y = lerp(this.pos.y, this.dest_pos.y, 0.1);
    this.pos.z = lerp(this.pos.z, this.dest_pos.z, 0.1);
  }

  red_line() {
    if (this.partner && people.indexOf(this) < people.indexOf(this.partner)) {
      //if a partner exists and this person comes first:
      stroke(255, 0, 0);
      strokeWeight(0.05);
      line(this.pos.x, this.pos.y, this.pos.z, this.partner.pos.x, this.partner.pos.y, this.partner.pos.z);
    }
  }

  move(){
    let step = createVector(random(-2, 2), random(-2, 2), random(-2, 2));
    this.dest_pos.add(step);
  }
}
