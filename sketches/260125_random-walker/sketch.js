//the definitive list of typos for a given word.
// arjun; january, 2026.

/*
ask: 
Using the random walker as a model, develop a ==sketch that experiments with motion== ... another way of thinking about the assignment is to ==apply the rules of motion to another medium of expression==: sound, color, number, scale ...
*/

/*
thought: 
a random walker can be applied to text too. heavily inspired by the nonsense laboratory by allison parrish, this sketch attempts to wonder — collectively with a human being — at what point does a typo become more than a typo? 

a keyboard is laid out like so: 

q w e r t y u i o p
a s d f g h j k l
z x c v b n m

each letter can be thought of as a point in two-dimensional space. going by the random walker algorithm, each letter has a maximum of 8 possibilities to move to, and a minimum of 1.
*/

let space = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

let prob_to_change = 0.1; //start with a very low probability to change.
let rate_of_growth = 0.05;

let str = ""; //i use this as a variable to store manipulations.
let original_word = ""; //i use this to store the original word that was entered by the person.

let resulted_words = []; //variable to store all the words that my get_new_word function output.

//html stuff:
let content_p, form, input, heading, sub_heading; //html variables.

let end_p;

function setup() {
  noCanvas();

  heading = document.querySelector("h1");
  sub_heading = document.querySelector("h2");

  content_p = document.getElementById("content");

  form = document.getElementById("input_form");
  input = document.getElementById("word_input");

  form.addEventListener("submit", handle_submit);
}

function handle_submit(e) {
  //by default, the browser reloads when a form is submitted. we need to prevent that.
  e.preventDefault();

  original_word = input.value.trim();
  str = original_word; //at the start of the sketch, my manipulated string is the same as the original word.

  content_p.innerHTML = str; //show what has been typed.
  resulted_words.push(original_word); //also store the original word, so that it isn't displayed again.

  // hide the form & description, update header: 
  form.style.display = "none";
  sub_heading.style.display = "none";
  heading.textContent = `the definitive list of acceptable typos for ${original_word}:`;
}

function draw() {
  if (frameCount % 60 === 0 && str !== "") {
    //every 1 second.

    str = ""; //empty string.

    // get a new word on the original word:
    str = get_new_word();
    //this returns a string.

    if (str === null) {
      end_p = createP("fin.");
      end_p.addClass('ender');
      noLoop();
    } else {
      //update the paragraph with the string you received.
      content_p.innerHTML += ", " + str;

      //we want the probability to change exponentially.
      prob_to_change *= 1 + rate_of_growth;
      prob_to_change = constrain(prob_to_change, 0, 1);
    }
  }
}

//helper to generate a new word based on whatever str is.
function get_new_word() {
  let word; //variable to store the word that this function will generate.

  // i always look for unique words that haven't been spit out by this program in the past. these variables help me keep track.
  let max_tries = 60; //safety to prevent infinite tries when it can't find a new word.
  let current_tries = 0; //variable to keep track of how many times the program has run.

  //generate a new word.
  while (current_tries < max_tries) {
    current_tries++;

    //if i write a word, i want to have an iteration of the word with typos.
    let chars = Array.from(original_word); //returns all characters of that string into a new array.

    for (let i = 0; i < chars.length; i++) {
      let ch = chars[i];
      let neighbours = get_neighbours(ch);
      // if (neighbours.length === 0) continue; //if there are no neighbours, move to the next iteration. although this isn't possible, but it's a fail-safe.

      let n = random(1); //pick a random number. this returns a number like so: 0.9211030989418209.

      if (n > prob_to_change) {
        continue; //doesn't need to be changed.
      } else {
        //needs to be changed.
        chars[i] = neighbours[Math.floor(random(0, neighbours.length))];
      }
    }

    //change this into the string.
    word = chars.join("");

    //check if the word is unique
    if (!resulted_words.includes(word)) {
      //outputs:
      resulted_words.push(word); //add to the array.
      return word;
    }

    //otherwise, try again.
  }

  //if we've reached here, there is no unique typo that can be generated.
  return null;
}

//helper written by gpt to get neighbours of a particular character, based on the visual-representation i'd thought of.
function get_neighbours(char) {
  if (!char || typeof char !== "string") return [];
  char = char.toLowerCase();

  // find letter position
  let pos = null;
  for (let r = 0; r < space.length; r++) {
    for (let c = 0; c < space[r].length; c++) {
      if (space[r][c] === char) {
        pos = { r, c };
        break;
      }
    }
    if (pos) break;
  }
  if (!pos) return [];

  // collect neighbours within +/-1 row and col (including diagonals)
  const neighbours = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // skip the letter itself
      const rr = pos.r + dr;
      const cc = pos.c + dc;
      if (rr < 0 || rr >= space.length) continue;
      if (cc < 0 || cc >= space[rr].length) continue;
      neighbours.push(space[rr][cc]);
    }
  }

  return neighbours;
}
