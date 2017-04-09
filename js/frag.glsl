//#extension GL_OES_standard_derivatives : enable

varying vec3 vNormal;
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_slider;
uniform vec3 s_color;
uniform float u_tolerance;

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

    float fbm_val = (fbm(vec2(fbm(vUv)))*2.);

    //vec3 sampleColor = vec3(0.9176,0.70588,0.);
    vec3 sampleColor = s_color;
    float tolerance = u_tolerance;
    st.x+=sin(fbm_val)*.01*u_slider;
    st.y+=cos(fbm_val)*.01*u_slider;
    // st -= .5;
    // st = rotate2d(sin(fbm_val)*.01*u_slider)*st;
    // st += .5;

    vec3 camColor = texture2D( webcam, vec2(vUv.x,1.-vUv.y) ).rgb;
    vec3 distortedColor = texture2D( webcam, vec2(st.x,1.-st.y) ).rgb;
    float distance_from_sample = distance(sampleColor,distortedColor);
    //camColor = distortedColor*distance_from_sample;
    //if(distance_from_sample<tolerance){
        distortedColor = texture2D( webcam, vec2(vUv.x+(distance_from_sample*fbm_val),1.-vUv.y+(distance_from_sample*fbm_val)) ).rgb;
        camColor = distortedColor;
    //}

    gl_FragColor= vec4(vec3(camColor),1.);
}