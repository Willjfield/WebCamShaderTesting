//#extension GL_OES_standard_derivatives : enable

varying vec3 vNormal;
varying vec2 vUv;
uniform vec2 u_resolution;

//#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);

uniform float u_time;

uniform sampler2D webcam;

uniform float amplitude;
uniform float noise_stage;



void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //
    //float numberSections = 8.;
   
    //float appliedAmp = log(getData(section)/128.)*pow(amplitude,4.);

    float noiseR = snoise4(vec4(vNormal.x,vNormal.y,vNormal.z,(u_time*.01)+noise_stage*.025));
    float noiseG = snoise4(vec4(vNormal.x,vNormal.y,vNormal.z,100.+(u_time*.01)+noise_stage*.025));
    float noiseB = snoise4(vec4(vNormal.x,vNormal.y,vNormal.z,1000.+(u_time*.01)+noise_stage*.025));
    //float noise = snoise(vec3(vNormal));
    float originalNoise = noiseR;
    vec3 noises=vec3(noiseR,noiseG,noiseB);
    noises = (noises+2.)/2.;
    //noises = pow(noises,2.);
    //noises=mod(noises*5.,2.);
    vec3 random;
    //if(noiseR>.5)
    vec3 camColor = texture2D( webcam, vec2(vUv.x,vUv.y) ).rgb;
    vec3 noiseMix = noises;
    vec3 lightSource = vec3(sin(u_time*.025),.1,cos(u_time*.025));
    vec3 color = noiseMix*(dot(vNormal,lightSource));
    gl_FragColor= vec4(camColor*noises,1.0);//vec4(vec3(color+.5),1.0);
}