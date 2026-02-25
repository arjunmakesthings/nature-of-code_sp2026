// was inspired by attractors, repellers, and wanted to make an emitter.

// a sentence is generated when the mouse is pressed. a sentence is a collection of randomly strung together words. words are made up of letters.

// some letters attract each other; some repel.

let sentences = [];

let new_words_at = 60; //in frame-count.

//sentences have to generate a certain number of letters. letters, based on attraction and repulsion, clump together to form words.

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800); //square to handle calculations better.

  textSize(16);

  //for debug; create one instance:
  let n = round(randomGaussian(47, 20));
  n = constrain(n, 17, 67);
  sentences.push(new Sentence(n));
}

function draw() {
  background(0);

  // if (frameCount % new_words_at == 0) {
  //   //every x seconds, make a new sentence.

  //   //average sentence length is ~47 characters.
  //   let n = round(randomGaussian(47, 20));
  //   n = constrain(n, 17, 67);

  //   sentences.push(new Sentence(n));
  // }

  for (let sentence of sentences) {
    sentence.run();
  }
}

class Sentence {
  constructor(n) {
    this.letters = [];
    let x = 20;
    let y = 100;

    for (let i = 0; i < n; i++) {
      let character = String.fromCharCode(97 + floor(random(26))); // new letter every time
      let attract_type = Math.floor(random(0, 6));
      this.letters.push(new Letter(character, x, y, attract_type));
      x += textWidth(character) + 5; // increment x by the width of this character for the next one.
    }
  }
  run() {
    for (let letter of this.letters) {
      letter.display();
      letter.move();
    }
  }
}

// a letter:
class Letter {
  constructor(alphabet, x, y, attract_type) {
    this.alphabet = alphabet;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.w = textWidth(this.alphabet);
    this.h = textAscent() + textDescent();

    this.attract_type = attract_type;
  }
  display() {
    noStroke();
    fill(255);
    text(this.alphabet, this.pos.x, this.pos.y);

    noFill();
    stroke(255);
    rect(this.pos.x, this.pos.y - textAscent(), this.w, this.h);
  }
  move() {
    // this.apply_force(createVector(0,0.2));
    this.pos.add(this.vel);

    if (this.pos.y > height - this.h) {
      this.pos.y = height - this.h;
      this.vel.y *= -1;
    }

    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
    }

    if (this.pos.x > width - this.w) {
      this.pos.x = width - this.w;
      this.vel.x *= -1;
    }

    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -1;
    }
  }
  apply_force(force) {
    this.vel.add(force);
  }
}
