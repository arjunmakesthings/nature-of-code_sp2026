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
    // size of one pixel in UV space
    vec2 px = 1.0 / res;

    // axis-aligned neighbors
    neighbours[0] = texture2D(tex, uv + vec2(0.0, px.y));   // up
    neighbours[1] = texture2D(tex, uv + vec2(0.0, -px.y));  // down
    neighbours[2] = texture2D(tex, uv + vec2(-px.x, 0.0));  // left
    neighbours[3] = texture2D(tex, uv + vec2(px.x, 0.0));   // right

    // diagonal neighbors
    neighbours[4] = texture2D(tex, uv + vec2(-px.x, px.y));  // up-left
    neighbours[5] = texture2D(tex, uv + vec2(px.x, px.y));   // up-right
    neighbours[6] = texture2D(tex, uv + vec2(-px.x, -px.y)); // down-left
    neighbours[7] = texture2D(tex, uv + vec2(px.x, -px.y));  // down-right
}

void inject() {
    curr = seed_amt;
}

void main() {
    //globals: 
    vec2 px_coord = vTexCoord * u_res; // convert to px space.
    //previous state:
    vec4 prev = texture2D(u_prev, vTexCoord);

    //inject seed: 
    if(u_inject_toggle == 1.0) {
        float d = distance(px_coord, u_seed_coords);
        if(d < 1.0) {
            inject();
        } else {
            // curr = prev.r;
        }
    } else {
        curr = prev.r;
    }

    //two simple rules: if you have more than you can take, share with neighbours. if you have less, take from neighbours.

    vec4 neighbours[8];
    get_neighbours(u_prev, vTexCoord, u_res, neighbours);

    if(curr > capacity) {
        float excess = curr - capacity;

        for(int i = 0; i < 8; i++) {
            float other = neighbours[i].r;
            give += excess / 8.0; //excess divided across all neighbours.
        }
        //we assume that all were given across all neighbours. so:
        curr -= give;
    } else if(curr < capacity) {
        //on the other hand, if your current value is less than your capacity, you seek:
        for(int i = 0; i < 8; i++) {
            float other_r = neighbours[i].r;
            float other_g = neighbours[i].g;
                curr += other_g; 
            
        }
    }
        //send out as rgba: 
    gl_FragColor = vec4(curr, give, u_inject_toggle, 1.0);
}

// for(int i = 0;
// i < 8;
// i ++) {
// curr += neighbours[i].g * weights[i];
// }