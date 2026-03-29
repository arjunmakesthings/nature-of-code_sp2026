#ifdef GL_ES
precision mediump float;
#endif

//built-in uniforms:
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

//built in attributes (from p5): 
attribute vec3 aPosition;
attribute vec2 aTexCoord;

//custom uniforms: 
uniform vec2 u_res;

//to pass vertex-attributes to the fragment shader: 
varying vec2 vTexCoord;

void main() {
  //make vec3 vec4 for calculations:
  vec4 position = vec4(aPosition, 1.0);

  //translate:
  position.xy -= 0.5; 

  //mvp: 
  gl_Position = uProjectionMatrix * uModelViewMatrix * position;

  //pass to fragment shader:
  vTexCoord = aTexCoord;
}