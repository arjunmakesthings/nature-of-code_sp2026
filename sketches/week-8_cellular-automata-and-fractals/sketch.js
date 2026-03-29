//untitled; arjun; month, 2026.

/*
ask: 

*/

/*
thought: 

*/

//shader files:
let main_shader;
let compute_1, compute_2;

//graphic buffers:
let buffer_1, buffer_2;

let m_coords = [-1000, -1000]; //off-screen.

let tog = false;

function preload() {
  main_shader = loadShader("./vert.vert", "./frag.frag");

  compute_1 = loadShader("./vert.vert", "./compute.frag");
  compute_2 = loadShader("./vert.vert", "./compute.frag");
}

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800, WEBGL); //square to handle calculations better.
  pixelDensity(1);
  noStroke();

  //off-screen buffers for computing. we never draw these.
  buffer_1 = createGraphics(width, height, WEBGL);
  buffer_2 = createGraphics(width, height, WEBGL);
  buffer_1.pixelDensity(1);
  buffer_2.pixelDensity(1);
  buffer_1.noStroke();
  buffer_2.noStroke();

  buffer_1.background(0); 
  buffer_2.background(0); 
}

function draw() {
  if (tog) {
    buffer_1.shader(compute_1);
    compute_1.setUniform("u_prev", buffer_2);
    compute_1.setUniform("u_mouse", m_coords);
    compute_1.setUniform("u_res", [width, height]);
    buffer_1.rect(-width / 2, -height / 2, width, height);
  } else {
    buffer_2.shader(compute_2);
    compute_2.setUniform("u_prev", buffer_1);
    compute_2.setUniform("u_mouse", m_coords);
    compute_2.setUniform("u_res", [width, height]);
    buffer_2.rect(-width / 2, -height / 2, width, height);
  }

  let current = tog ? buffer_1 : buffer_2;

  //test to see ping pong (you should see flashing lights):
  // buffer_1.background(255, 0, 0);
  // buffer_2.background(0, 0, 255);

  shader(main_shader);
  main_shader.setUniform("u_map", current);
  main_shader.setUniform("u_res", [width, height]);
  rect(-width / 2, -height / 2, width, height);

  tog = !tog;
}

function mousePressed() {
  m_coords = [mouseX, mouseY];
}

/* helpers */
