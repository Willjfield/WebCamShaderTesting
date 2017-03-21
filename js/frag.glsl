#extension GL_OES_standard_derivatives : enable

varying vec3 vNormal;
varying vec2 vUv;
uniform vec2 u_resolution;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);

uniform float u_time;

uniform sampler2D webcam;

uniform float amplitude;
uniform float noise_stage;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    vec2 st = vUv;//gl_FragCoord.xy/u_resolution.xy;
    st *= 5.;
    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);


    // vec2 point[10];
    // point[0] = vec2(0.83,0.75);
    // point[1] = vec2(0.60,0.07);
    // point[2] = vec2(0.28,0.64);
    // point[3] =  vec2(0.31,0.26);
    // point[4] = vec2(0.64,0.2);
    // point[5] = vec2(0.53,0.355);
    // point[6] = vec2(0.30,0.035);
    // point[7] = vec2(0.18,0.34);
    // point[8] =  vec2(0.151,0.16);
    // point[9] = vec2(0.4,0.1);

    vec2 m_point;
    
    float m_dist = 2.;  // minimum distance
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));
            
            // Random position from current + neighbor place in the grid
            m_point = random2(i_st + neighbor);

            // Animate the point
            m_point = 0.5 + 0.5*sin(u_time*.5 + 6.2831*m_point);
            
            // Vector between the pixel and the point
            vec2 diff = neighbor + m_point - f_st;
            
            // Distance to the point
            float dist = length(diff);

            // Keep the closer distance
            m_dist = min(m_dist, dist);
        }
    }

    // for (int i = 0; i < 10; i++) {
    //     float dist = distance(vUv, point[i]);
    //     if ( dist < m_dist ) {
    //         // Keep the closer distance
    //         m_dist = dist;

    //         // Kepp the position of the closer point
    //         m_point = point[i];
    //     }
    // }

    //vec2 color.rg = m_point;
    // float noiseR = snoise4(vec4(vNormal.x,vNormal.y,vNormal.z,(u_time*.01)+noise_stage*.025));
    // float noiseG = snoise4(vec4(vNormal.x,vNormal.y,vNormal.z,100.+(u_time*.01)+noise_stage*.025));
    // float noiseB = snoise4(vec4(vNormal.x,vNormal.y,vNormal.z,1000.+(u_time*.01)+noise_stage*.025));

    //float vernoiTwist = snoise3(vUv.x,u_time,vUv.y);
    vec2 sampleCoords = vUv;
    sampleCoords -= vec2(m_dist);
    // rotate the space
    sampleCoords = rotate2d( u_time*.1*3.14159265358979323 ) * sampleCoords;
    // move it back to the original place
    sampleCoords += vec2(m_dist);
    

    //float noise = snoise(vec3(vNormal));
    //float originalNoise = noiseR;
    //vec3 noises=vec3(noiseR,noiseG,noiseB);
    //noises = (noises+2.)/2.;
    //noises = pow(noises,2.);
    //noises=mod(noises*5.,2.);
    vec3 random;
    //if(noiseR>.5)
    vec3 camColor = texture2D( webcam, vec2(sampleCoords.x,sampleCoords.y) ).rgb;
    vec3 noiseMix = vec3(m_dist,m_dist,1.);
    vec3 lightSource = vec3(sin(u_time*.1),.1,cos(u_time*.1));
    vec3 color = noiseMix*(dot(vNormal,lightSource));

    gl_FragColor= vec4(mix(camColor,color,.2),1.);
    //gl_FragColor= vec4(vec3(.1),1.);
}