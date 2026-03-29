#ifdef GL_ES
precision mediump float;
#endif

//receive from vertex shader:
varying vec2 vTexCoord;

//we also get gl_FragCoord which is the pixel position of the pixel being computed.

//custom uniforms:
uniform sampler2D u_map;

void main() {
    //read from texture and color.
    gl_FragColor = texture2D(u_map, vTexCoord);

    //for testing:
    // gl_FragColor = vec4(vTexCoord.x, 0.0,0.0,1.0);
}