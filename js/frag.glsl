//#extension GL_OES_standard_derivatives : enable

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

uniform vec2 u_resolution;
uniform float u_slider;
uniform vec3 uEyePos;
// uniform float _amp;
// uniform float _freq;
// uniform float _val;
uniform vec3 _light_pos;

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

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

#define OCTAVES 6
float fbm (in vec3 st) {
    // Initial values
    float value = 1.;
    float amplitud = 1.;
    float frequency = 1.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitud * snoise4(vec4(st.xyz,.07*u_time))+1.;
        st *= 3.;
        amplitud *= .4;
    }
    return value;
}

void main() {
    vec2 st = vec2(vPosition.xy);
    float fbm_val = pow(fbm(vec3(fbm(vPosition)))*.1,2.);
    float fbm_val_x = pow(fbm(vec3(fbm(vec3(vPosition.x+.1,vPosition.y, vPosition.z))))*.1,2.);
    float fbm_val_y = pow(fbm(vec3(fbm(vec3(vPosition.x,vPosition.y+.1, vPosition.z))))*.1,2.);

    // vec3 p = vec3(vUv.x,vUv.y,fbm_val*.25);
    // vec3 p1 = vec3(vUv.x+.1,vUv.y,fbm_val_x*.25);
    // vec3 p2 = vec3(vUv.x,vUv.y+.1,fbm_val_y*.25);

    vec3 p = vec3(vPosition.x,vPosition.y,vPosition.z+fbm_val*.25);
    vec3 p1 = vec3(vPosition.x+.1,vPosition.y,vPosition.z+fbm_val_x*.25);
    vec3 p2 = vec3(vPosition.x,vPosition.y+.1,vPosition.z+fbm_val_y*.25);

    vec3 new_normal = normalize(cross(p1-p,p2-p));
    new_normal = (new_normal+1.)/2.;
    vec3 reflection_vector = reflect(normalize(uEyePos),new_normal);
    float reflect_normal = (dot(reflection_vector, normalize(_light_pos-vPosition))+1.)/2.;
    reflect_normal = max(reflect_normal,.15);
   // Dir = (B - A) x (C - A)
   // Norm = Dir / len(Dir)

    //fbm_val = pow(fbm_val,5.);
    vec3 color = vec3(new_normal*reflect_normal);
    color*=color;
    color.b*=.2;
    color.g*=.6;
    //color = max(color,.15);
    float specular = 2./distance(_light_pos,vPosition.xyz);

    //specular = pow(specular,2.);
    gl_FragColor= vec4(vec3(color*specular),1.);
}