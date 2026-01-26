// at what point is a typo not just a typo?
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

let str = "";

//html stuff: 
let content_p, form, input; //html variables.

function setup() {
  noCanvas(); 

  content_p  = document.getElementById("content"); 

  form = document.getElementById("input_form");
  input = document.getElementById("word_input");

  form.addEventListener("submit", handle_submit);
}

function handle_submit(e){
  //by default, the browser reloads when a form is submitted. we need to prevent that. 
  e.preventDefault(); 
  str = input.value.trim(); //take the value submitted, remove whitespace. 
}

function draw() {
content_p.innerHTML=str; 
console.log(str); 
}

let prob_to_change = 0.01;

//helper to generate a new word based on whatever str is. 
function get_new_word() {
  let word; 

  //if i write a word, i want to have an iteration of the word with typos.
  let chars = Array.from(str); //returns all characters of that string into a new array.

  for (let i = 0; i < chars.length; i++) {
    let ch = chars[i];
    let neighbours = get_neighbours(ch);
    if (neighbours.length === 0) continue; //if there are no neighbours, move to the next iteration. although this isn't possible, but fail-safe.

    let n = random(1); //pick a random number.

    if (n > prob_to_change) {
      continue; //doesn't need to be changed.
    } else {
      //needs to be changed.
      chars[i] = neighbours[Math.floor(random(0, neighbours.length))];
    }
  }

  //change this into the string.
  word = chars.join("");
  return word;
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
