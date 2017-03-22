//#extension GL_OES_standard_derivatives : enable

varying vec3 vNormal;
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_slider;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);

uniform float u_time;

uniform sampler2D webcam;
uniform sampler2D colorMap;

//uniform float amplitude;
//uniform float noise_stage;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitud = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitud * snoise3(vec3(st.x,u_time*.025,st.y));
        st *= 3.;
        amplitud *= .5;
    }
    return value;
}

void main() {
    vec2 st = vUv;//gl_FragCoord.xy/u_resolution.xy;

    float fbm_val = (fbm(vec2(fbm(vUv)))*2.)-1.;

    st -= vec2(0.5);
    // rotate the space
    st = rotate2d( sin(fbm_val)*3.141592*u_slider ) * st;
    // move it back to the original place
    st += vec2(0.5);
    vec3 light_source = vec3(sin(u_time*.1),0.2,cos(u_time*.1));
    vec3 camColor = texture2D( colorMap, vec2(st.x,st.y) ).rgb;
    float diffuse = max((dot(light_source,vNormal)+1.)/2.,.2);
    gl_FragColor= vec4(vec3(camColor*diffuse),1.);
    //vec3 imgColor = texture2D(colorMap,vec2(vUv.x,vUv.y)).rgb;
    //gl_FragColor= vec4(vec3(imgColor),1.);
}