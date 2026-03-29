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

    float give = 0.0; 
    //globals:
    vec2 px_coord = vTexCoord * u_res;

    //local for calculations:
    curr_state = texture2D(u_prev, vTexCoord).r;

    //seed:
    if(u_inject_toggle == 1.0) {
        float d = distance(px_coord, u_seed_coords);

        if(d < 1.0) {
            curr_state = 1.0;
        }

    }

    vec4 neighbours[8];
    get_neighbours(u_prev, vTexCoord, u_res, neighbours);

    for(int i = 0; i < 8; i++) {
        vec4 n = neighbours[i]; //channels are r,g,b,a.

        if(n.r < curr_state) {
            give += curr_state / 8.0;
        }
    }

    curr_state -= give;

    //receive: 
    for(int i = 0; i < 8; i++) {
        vec4 n = neighbours[i]; //channels are r,g,b,a.

        if(n.g > 0.0) {
            curr_state += n.g / 8.0;
        }
    }

    //pass the thing:
    gl_FragColor = vec4(curr_state, give, 0.0, 0.0);
}

/* usage: 

vec4 neighbours[8];
get_neighbours(u_prev, vTexCoord, u_res, neighbours);

*/
