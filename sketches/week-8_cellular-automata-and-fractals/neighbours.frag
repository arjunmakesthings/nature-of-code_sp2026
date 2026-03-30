#ifdef GL_ES
precision mediump float;
#endif

//receive from vertex shader:
varying vec2 vTexCoord;

//custom uniforms:
uniform vec2 u_res;
uniform sampler2D u_prev;
uniform vec2 u_seed_coords; //passed in pixel-space. 
uniform float u_inject_toggle; 

//parameters:

//helpers: 

//to get neighbours:
/* usage: 

vec4 neighbours[8];
get_neighbours(u_prev, vTexCoord, u_res, neighbours);

*/
void get_neighbours(sampler2D tex, vec2 uv, vec2 res, out vec4 neighbours[8]) {
    vec2 px = 1.0 / res;

    neighbours[0] = texture2D(tex, uv + vec2(0.0, px.y));
    neighbours[1] = texture2D(tex, uv + vec2(0.0, -px.y));
    neighbours[2] = texture2D(tex, uv + vec2(-px.x, 0.0));
    neighbours[3] = texture2D(tex, uv + vec2(px.x, 0.0));
    neighbours[4] = texture2D(tex, uv + vec2(-px.x, px.y));
    neighbours[5] = texture2D(tex, uv + vec2(px.x, px.y));
    neighbours[6] = texture2D(tex, uv + vec2(-px.x, -px.y));
    neighbours[7] = texture2D(tex, uv + vec2(px.x, -px.y));
}

void main() {
    float curr_state = 0.0;

    float prev_state = 0.0;
    //previous state is current state from buffer.
    prev_state = texture2D(u_prev, vTexCoord).r;

    //globals:
    vec2 px_coord = vTexCoord * u_res;

    //seed: 
    float d = distance(px_coord, u_seed_coords);

    if(d < 1.0) {
        curr_state = 1.0;
    }

    if (curr_state == 0.0 && prev_state == 0.0){
        curr_state = 1.0;
    }else if(curr_state == 1.0 && )

    if(prev_state == 0.0) {
        curr_state = 1.0;
    } else {
        curr_state = 0.0;
    }

    //pass the thing:
    gl_FragColor = vec4(curr_state, 0.0, 0.0, 0.0);
}


