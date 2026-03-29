#ifdef GL_ES
precision mediump float;
#endif

//receive from vertex shader:
varying vec2 vTexCoord;

//custom uniforms:
uniform vec2 u_res;
uniform sampler2D u_prev;
uniform vec2 u_mouse; //passed in pixel space.
uniform float u_mouse_was_clicked; 

//parameters:
float seed = 100.0;
float capacity = 5.0;
float rate = 0.1;

//what we're passing: 
float thing = 0.0;

void main() {
    //globals:
    vec2 px_coord = vTexCoord * u_res;

    float curr_self = texture2D(u_prev, vTexCoord).r;

    if(u_mouse_was_clicked == 1.0) {
        //was clicked.
        float d = distance(px_coord, u_mouse);

        if(d < 20.0) {
            thing = seed;
        }
    } else {
        thing = curr_self;
    }

    //pass color:
    gl_FragColor = vec4(thing, 0.0, 0.0, 0.0);
}

//     //find neighbours: 
// vec2 px = 1.0 / u_res; //size of 1 pixel in uv-coordinates.

// float up = texture2D(u_prev, vTexCoord + vec2(0.0, px.y)).r;
// float down = texture2D(u_prev, vTexCoord - vec2(0.0, px.y)).r;
// float left = texture2D(u_prev, vTexCoord - vec2(px.x, 0.0)).r;
// float right = texture2D(u_prev, vTexCoord + vec2(px.x, 0.0)).r;

// float up_left = texture2D(u_prev, vTexCoord + vec2(-px.x, px.y)).r;
// float up_right = texture2D(u_prev, vTexCoord + vec2(px.x, px.y)).r;
// float down_left = texture2D(u_prev, vTexCoord + vec2(-px.x, -px.y)).r;
// float down_right = texture2D(u_prev, vTexCoord + vec2(px.x, -px.y)).r;