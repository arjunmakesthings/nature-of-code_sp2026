#ifdef GL_ES
precision lowp float;
#endif

// Built-in transformation matrices.
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

// Mesh attributes.
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// Custom uniforms.
uniform vec2 u_res;

// Passed attributes.
varying vec2 vTexCoord;

uniform float u_time;

void main() {
  // Copy the vec3 position into a vec4.
    vec4 position = vec4(aPosition, 1.0);

  // position.x += sin(u_time) / tan(u_time + aPosition.y * 0.05);
    position.x += 50. * tan(u_time + aPosition.x / 0.0005);

  // Move the shape for the origin in the center.
    position.xy -= u_res * 0.5;

  // Set the clip space position.
    gl_Position = uProjectionMatrix * uModelViewMatrix * position;

  // Pass data to the fragment shader.
    vTexCoord = aTexCoord;
}