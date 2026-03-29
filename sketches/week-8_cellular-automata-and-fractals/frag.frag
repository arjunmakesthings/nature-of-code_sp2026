#ifdef GL_ES
precision mediump float;
#endif

// Passed attributes from vertex shader.
varying vec2 vTexCoord;

//passed from sketch: 
uniform vec2 u_mouse;
uniform vec2 u_res;

void main() {
    // gl_FragColor = vec4(0.0, vTexCoord.y,0.0, 1.0);

    vec2 fragCoord = vTexCoord * u_res;
    float distToMouse = distance(fragCoord, u_mouse);

    if(distToMouse < 20.0) { // 20 pixels radius
        gl_FragColor = vec4(1.0);
    } else {
        gl_FragColor = vec4(0.0, vTexCoord.y, 0.0, 1.0);
    }
}