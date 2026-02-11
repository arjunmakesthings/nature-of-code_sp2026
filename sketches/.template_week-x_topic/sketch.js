//untitled; arjun; month, 2026.

/*
ask: 

*/

/*
thought: 

*/

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800); //square to handle calculations better.
}

function draw() {
  background(0);

  let v1 = better_vec.from_coords(200, 200, 400, 400, true);

  console.log(v1);
}

class better_vec {
  static from_coords(x0, y0, x1, y1, show) {
    if (show == true) {
      //draw:
      push();
      translate(x0, y0);
      let curr_vec = createVector(x1, y1).sub(x0, y0);
      rotate(curr_vec.heading());

      stroke(255, 0, 0);

      line(0, 0, curr_vec.mag(), 0);

      fill(255, 0, 0);

      beginShape(TRIANGLES);
      vertex(curr_vec.mag(), 0);
      vertex(curr_vec.mag() - 10, 5);
      vertex(curr_vec.mag() - 10, -5);
      endShape();

      pop();
    }
    return createVector(x1, y1).sub(x0, y0);
  }

  static from_vec(vec1, vec2, show) {
    if (show == true) {
      stroke(255, 0, 0);
      line(vec1.x, vec1.y, vec2.x, vec2.y);
    }
    return createVector(x1, y1).sub(x0, y0);
  }
}
