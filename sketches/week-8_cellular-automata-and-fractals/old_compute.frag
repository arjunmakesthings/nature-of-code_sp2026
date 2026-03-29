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
float seed = 1.0;

float capacity = 1.0;
float rate = 0.01;

void main() {
    //globals:
    vec2 px_coord = vTexCoord * u_res;

    //local for calculations:
    float curr_self = texture2D(u_prev, vTexCoord).r;

    // 1) check for seed distribution. 
    float d = distance(px_coord, u_seed_coords);

    if(d < 10.0 && u_inject_toggle == 1.0) {
        //this is the seed one.
        curr_self = seed;
    }

    // 2) take half of what you have, and give it to your neighbours.
    float keep = curr_self;
    float received = 0.0;
    float offload = 0.0; 

    // if you have more than you can take, offload.
    if(curr_self > capacity) {
        offload = curr_self * rate;
        keep -= offload; //remove from what you are going to keep.
    } else if(curr_self < capacity) {
        //current self is less than what it can take. so we receive from neighbours.
        vec2 px = 1.0 / u_res; // 1px in uv-space. 

        //the g value contains offloads for each pixel.
        float neighbors[8];
        neighbors[0] = texture2D(u_prev, vTexCoord + vec2(0.0, px.y)).g;   // up
        neighbors[1] = texture2D(u_prev, vTexCoord + vec2(0.0, -px.y)).g;  // down
        neighbors[2] = texture2D(u_prev, vTexCoord + vec2(-px.x, 0.0)).g;  // left
        neighbors[3] = texture2D(u_prev, vTexCoord + vec2(px.x, 0.0)).g;   // right
        neighbors[4] = texture2D(u_prev, vTexCoord + vec2(-px.x, px.y)).g; // up-left
        neighbors[5] = texture2D(u_prev, vTexCoord + vec2(px.x, px.y)).g;  // up-right
        neighbors[6] = texture2D(u_prev, vTexCoord + vec2(-px.x, -px.y)).g; // down-left
        neighbors[7] = texture2D(u_prev, vTexCoord + vec2(px.x, -px.y)).g; // down-right

        for(int i = 0; i < 8; i++) {
            float n = neighbors[i];
            if(n > 0.0) {
                received += n/8.0; //add to my receivals. 
            }
        }
        received = min(received, rate); 
    }
    curr_self = keep + received; 
    //pass the thing:
    gl_FragColor = vec4(curr_self, offload, 0.0, 0.0);
}
