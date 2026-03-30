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
    float prev = texture2D(u_prev, vTexCoord).r;

    float curr = 0.0;

    float give = 0.0; 

    //inject seed: 
    if(u_inject_toggle == 1.0) {
        float d = distance(px_coord, u_seed_coords);
        if(d < 20.0) {
            curr = 1.0;
        }
    } else {
        vec4 neighbours[8];
        get_neighbours(u_prev, vTexCoord, u_res, neighbours);
        if(curr > 0.1) {
            //you have something. give to your neighbours.
            for(int i = 0; i < 8; i++) {
                float n = neighbours[i].r;

                if(n < 1.0) {
                    give += curr / 8.0;
                }
            }
        } else {
            //take from neighbours. 

            for(int i = 0; i < 8; i++) {
                float n = neighbours[i].r;

                if(n > 0.1) {
                    curr += n / 8.0;
                }
            }

        }
    }

    gl_FragColor = vec4(curr, give, 0.0, 1.0);
}