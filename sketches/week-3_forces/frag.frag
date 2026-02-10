#ifdef GL_ES
precision lowp float;
#endif

// Passed attributes.
varying vec2 vTexCoord;

// Custom uniforms.
uniform sampler2D u_tex;

uniform float u_time;

void main() {
    vec4 texColor = texture2D(u_tex, vTexCoord);
    
    // texColor.b *= sin(u_time + vTexCoord.x / 0.05);
    gl_FragColor = texColor;
}