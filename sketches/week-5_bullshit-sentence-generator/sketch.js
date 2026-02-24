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

  // letters[0] = new Letter(String.fromCharCode(97 + floor(random(26)))); //new letter every time.
}

function draw() {
  background(0);

  if (frameCount % new_words_at == 0) {
    //every x seconds, make a new sentence.

    //average sentence length is ~47 characters.
    let n = round(randomGaussian(47, 20));
    n = constrain(n, 17, 67);

    sentences.push(new Sentence(n));
  }

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
      this.letters.push(new Letter(character, x, y));
      x += textWidth(character); // increment x by the width of this character. 
    }
  }
  run() {
    for (let letter of this.letters) {
      letter.display();
    }
  }
}

// a letter:
class Letter {
  constructor(alphabet, x, y) {
    this.alphabet = alphabet;

    this.pos = createVector(x, y);

    this.w = textWidth(this.alphabet);
    this.h = textAscent() + textDescent();
  }
  display() {
    noStroke();
    fill(255);
    text(this.alphabet, this.pos.x, this.pos.y);

    noFill();
    stroke(255);
    rect(this.pos.x, this.pos.y - textAscent(), this.w, this.h);
  }
}
