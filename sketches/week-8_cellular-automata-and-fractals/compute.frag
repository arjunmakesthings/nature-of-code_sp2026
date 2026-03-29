#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform vec2 u_res;
uniform sampler2D u_prev;
uniform vec2 u_mouse;

void main() {
    // sample previous frame
    vec4 prev = texture2D(u_prev, vTexCoord);

    // convert UV → pixel coords (to match mouse)
    vec2 fragCoord = vTexCoord * u_res;

    float d = distance(fragCoord, u_mouse);

    vec4 color = prev;

    // inject white where mouse is
    if(d < 20.0) {
        color = vec4(1.0);
    }

    gl_FragColor = color;
}