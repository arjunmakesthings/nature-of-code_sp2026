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
float capacity = 0.1;

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
    if(u_inject_toggle == 1.0) {
        vec2 px_coord = vTexCoord * u_res; // convert to px space.
        float d = distance(px_coord, u_seed_coords);
        if(d < 1.0) {
            curr = seed_amt;
        }
    } else {
        //nothing.
    }
}

void main() {
    //previous state:
    vec4 prev = texture2D(u_prev, vTexCoord);

    //reset to what you had. 
    curr = prev.r;

    inject(); 

    //two simple rules: if you have more than you can take, share with neighbours. if you have less, take from neighbours.

    vec4 neighbours[8];
    get_neighbours(u_prev, vTexCoord, u_res, neighbours);

    if(curr > capacity) {
        float excess = curr - capacity;

        for(int i = 0; i < 8; i++) {
            float other = neighbours[i].r;

            if(other < capacity) {
                //they have the potential to take.
                give += excess / 8.0; //excess divided across all neighbours.
            }
        }
        //whatever was given, you subtract.
        curr -= give;
    } else if(curr < capacity) {
        //on the other hand, if your current value is less than your capacity, you seek:
        for(int i = 0; i < 8; i++) {
            float other_r = neighbours[i].r;
            float other_g = neighbours[i].g;
            if(other_g > 0.01) {
                //if anyone has something, you take it.
                curr += min(other_g / 8.0, capacity); //assuming there were eight numbers. this /8.0 is our loss for the pixels that cannot be processed here.
            }
        }
    } else if(curr == capacity) {
        //do nothing.
    }
        //send out as rgba: 
    gl_FragColor = vec4(curr, give, 0.0, 0.0);
}

// for(int i = 0;
// i < 8;
// i ++) {
// curr += neighbours[i].g * weights[i];
// }