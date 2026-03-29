/*
basic ping-pong template for p5.js, to handle gpu-computing. see README.md for notes. 

by arjun; 260329. thanks to elias (elie) zananiri for his shader-time class at itp in sp-2026. 
*/

//shader variables:
let main_shader;
let compute_1, compute_2;

//graphic (off-screen) buffers:
let buffer_1, buffer_2;

//switch to ping-pong.
let tog = false;

//for this example, to show passing of mouse-coords:
let m_coords = [-1000, -1000]; //off-screen to avoid 0,0 draw by default.

function preload() {
  main_shader = loadShader("./vert.vert", "./frag.frag");

  compute_1 = loadShader("./vert.vert", "./compute.frag");
  compute_2 = loadShader("./vert.vert", "./compute.frag");
}

function setup() {
  // createCanvas(1000, 562, WEBGL); //in 16:9 aspect ratio.
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

  //start with a default black background.
  buffer_1.background(0);
  buffer_2.background(0);
}

function draw() {
  if (tog) {
    buffer_1.shader(compute_1);
    set_uniforms(compute_1, buffer_2);
    buffer_1.rect(0, 0, width, height);
  } else {
    buffer_2.shader(compute_2);
    set_uniforms(compute_2, buffer_1);
    buffer_2.rect(0, 0, width, height);
  }

  let current = tog ? buffer_1 : buffer_2;

  //test to see ping pong (you should see flashing lights):
  // buffer_1.background(255, 0, 0);
  // buffer_2.background(0, 0, 255);

  shader(main_shader);
  main_shader.setUniform("u_map", current);
  main_shader.setUniform("u_res", [width, height]);
  rect(0, 0, width, height);

  //reverse the switch. 
  tog = !tog;
}

function mousePressed() {
  m_coords = [mouseX, mouseY];
}

/* helpers */
function set_uniforms(shader_name, prev_buffer) {
  shader_name.setUniform("u_prev", prev_buffer);
  shader_name.setUniform("u_mouse", m_coords);
  shader_name.setUniform("u_res", [width, height]);
}
