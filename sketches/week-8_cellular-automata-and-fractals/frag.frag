#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D u_map;

void main() {
    gl_FragColor = texture2D(u_map, vTexCoord);
}