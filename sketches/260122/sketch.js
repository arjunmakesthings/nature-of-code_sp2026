//untitled; arjun; jan, 2026.

/*
ask: 
make a reactive mesh, with vertices that use the z-parameter. use position & colour. 
*/

/*
thought: 
every enclosed body is a mesh, with vertices inside. shape is affected by the topology. 

an enclosed body can be thought of as a group of similar colours. 
*/

let cam;

let mesh_points = [];

let gap = 10;

function setup() {
  cam = createCapture(VIDEO, { flipped: true }, make_canvas);
  cam.hide();
}

//make canvas the same size as camera for easier calculations.
function make_canvas() {
  createCanvas(cam.width, cam.height, WEBGL);

  // make a mesh of points.
  for (let x = 0; x <= width * 2; x += gap) {
    for (let y = 0; y <= height; y += gap) {
      mesh_points.push(new MeshPoint(x, y));
    }
  }
}

function draw() {
  background(0);
  translate(-width / 2, -height / 2);

  get_color();
  image(cam, 0, 0, width, height);

  for (let mesh_point of mesh_points) {
    mesh_point.display();
    mesh_point.clump();
  }
}

function get_color() {
  cam.loadPixels();
  //returns a cam.pixels 1-d array with rgba values.

  /*
the algorithm: 
- go through all the mesh-points, get assigned the colour of what they actually are as per video input. 
- for the joining, we look at similarity. 
  */

  for (let i = 0; i < mesh_points.length; i++) {
    let n = get_pixel_index(mesh_points[i].x, mesh_points[i].y);

    mesh_points[i].r = cam.pixels[n];
    mesh_points[i].g = cam.pixels[n + 1];
    mesh_points[i].b = cam.pixels[n + 2];
  }

  // now we go through all the mesh points, and compare the colour values to their neighbour.

  for (let i = 0; i<mesh_points.length; i++){
    let neighbours = get_neighbours(mesh_points[i]); 
  }
}

function get_neighbours(p){
  let x = mesh_points[n].x; 
  let y = mesh_points[n].x; 

  const possible_neighbours = [
        [x - gap, y - gap], // top-left
        [x, y - gap], // top
        [x + gap, y - gap], // top-right
        [x - gap, y], // left
        [x + gap, y], // right
        [x - gap, y + gap], // bottom-left
        [x, y + gap], // bottom
        [x + gap, y + gap], // bottom-right
  ];
}

//helper to convert x,y coordinates to pixels index.
function get_pixel_index(x, y) {
  return (y * cam.width + x) * 4;
}

// function get_neighbours(x, y) {
//   let neighbours = [];
//   const possible_neighbours = [
//     [x - 1, y - 1], // top-left
//     [x, y - 1], // top
//     [x + 1, y - 1], // top-right

//     [x - 1, y], // left
//     [x + 1, y], // right

//     [x - 1, y + 1], // bottom-left
//     [x, y + 1], // bottom
//     [x + 1, y + 1], // bottom-right
//   ];

//   for (const [dx, dy] of possible_neighbours) {
//     if (dx >= 0 && dx < cam.width && dy >= 0 && dy < cam.height) {
//       neighbours.push(get_pixel_index(dx, dy));
//     }
//   }

//   return neighbours;
// }

class MeshPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.r = 255;
    this.g = 255;
    this.b = 255;
    // this.a = 100;
  }

  display() {
    beginShape(POINTS);
    stroke(this.r, this.g, this.b);
    strokeWeight(gap);
    vertex(this.x, this.y);

    endShape();
  }
}
