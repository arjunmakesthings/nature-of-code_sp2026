#ifdef GL_ES
precision mediump float;
#endif

//receive from vertex shader:
varying vec2 vTexCoord;

//custom uniforms:
uniform vec2 u_res;
uniform sampler2D u_prev;
uniform vec2 u_mouse;

void main() {
    //take texture from previous buffer to compute:
    vec4 prev = texture2D(u_prev, vTexCoord);

    //convert uv to pixel_coords:
    vec2 fragCoord = vTexCoord * u_res;

    float d = distance(fragCoord, u_mouse);

    //match color from before.
    vec4 color = prev;

    //where mouse was pressed:
    if(d < 20.0) {
        color = vec4(1.0);
    }
    // else{
    //     color = vec4(0.0,0.0,0.0,1.0); 
    // }

    //pass color:
    gl_FragColor = color;
}