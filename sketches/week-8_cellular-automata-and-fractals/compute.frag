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

//local: 
float seed_amt = 1.0;
float capacity = 0.5;

float curr = 0.0;

float give = 0.0; 

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
    //globals: 
    vec2 px_coord = vTexCoord * u_res; // use uniform resolution

    //previous state:
    vec4 prev = texture2D(u_prev, vTexCoord);

    //inject seed: 
    if(u_inject_toggle == 1.0) {
        float d = distance(px_coord, u_seed_coords);
        if(d < 100.0) {
            curr = seed_amt;
        }
    } else {
        vec4 neighbours[8];
        get_neighbours(u_prev, vTexCoord, u_res, neighbours);
        if(curr >= capacity) {
            //you have more than you can take. share with neighbours.
            float amt_to_offload = curr - capacity;
            for(int i = 0; i < 8; i++) {
                float n = neighbours[i].r;
                if(n < capacity) {
                    give += amt_to_offload;
                }
            }
        } else if(curr < capacity) {
            //you are needy. take from neighbours. 

            for(int i = 0; i < 8; i++) {
                float n = neighbours[i].r;
                if(n > capacity) {
                    //this means it has something to give.
                    curr += n / 7.0;
                }
            }
            // curr -= prev.g;
        }

    }

    gl_FragColor = vec4(curr, prev.r, 0.0, 1.0);
}