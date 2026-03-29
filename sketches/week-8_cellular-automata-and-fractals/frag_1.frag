#ifdef GL_ES
precision mediump float;
#endif

// Passed attributes from vertex shader.
varying vec2 vTexCoord;

void main() {
    gl_FragColor = vec4(0.0, vTexCoord.y,0.0, 1.0);
}