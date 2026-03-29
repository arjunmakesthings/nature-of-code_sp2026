//untitled; arjun; month, 2026.

/*
ask: 

*/

/*
thought: 

*/

let shader_1;
let shader_2;

function preload() {
  shader_1 = loadShader("./vert.vert", "./frag_1.frag");
  shader_2 = loadShader("./vert.vert", "./frag_2.frag");
}

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800, WEBGL); //square to handle calculations better.

  noStroke();
}

function draw() {
  shader(shader_1);
  rect(-width / 2, -height / 2, width, height);

  pass_uniforms(); 
}

function pass_uniforms() {
  //resolution:
  shader_1.setUniform("u_res", [width, height]);
  shader_2.setUniform("u_res", [width, height]);

  //resolution:
  shader_1.setUniform("u_res", [width, height]);
  shader_2.setUniform("u_res", [width, height]);
}

/* helpers */
