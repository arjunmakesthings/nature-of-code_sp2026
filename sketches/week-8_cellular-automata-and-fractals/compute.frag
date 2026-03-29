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

//what we're passing: 
float thing = 0.0;

void main() {
    //globals:
    vec2 px_coord = vTexCoord * u_res;

    //local for calculations:
    float curr_self = texture2D(u_prev, vTexCoord).r;

    // 1) calculate 'thing'. 
    if(u_mouse_was_clicked == 1.0) {
        //was clicked.
        float d = distance(px_coord, u_mouse);

        if(d < 20.0) {
            thing = seed;
        }
    } else {
        thing = curr_self;
    }

    // 



    //pass thing:
    gl_FragColor = vec4(thing, 0.0, 0.0, 0.0);
}

