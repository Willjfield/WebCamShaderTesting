//#extension GL_OES_standard_derivatives : enable

varying vec3 vNormal;
varying vec2 vUv;
uniform vec2 u_resolution;

//#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);

uniform float u_time;


uniform float amplitude;
uniform float noise_stage;



void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //
    //float numberSections = 8.;
   
    //float appliedAmp = log(getData(section)/128.)*pow(amplitude,4.);

    float noise = snoise4(vec4(vNormal.x,vNormal.y,vNormal.z,(u_time*.01)+noise_stage*.025));
    //float noise = snoise(vec3(vNormal));
    float originalNoise = noise;
    noise = (noise+1.)/2.;
    noise=floor(mod(noise*50.,2.));

    vec3 noiseMix = vec3(noise+((originalNoise)/2.));
    vec3 lightSource = vec3(sin(u_time*.025),.1,cos(u_time*.025));
    vec3 color = noiseMix+(dot(vNormal,lightSource)/2.);
    gl_FragColor=vec4(vec3(color+.1),1.0);
}