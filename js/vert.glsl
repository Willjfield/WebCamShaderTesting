varying vec2 vUv;
varying vec3 vNormal;

uniform float u_slider;
uniform float amp0;
uniform float amp1;
uniform float amp2;
uniform float amp3;
uniform float amp4;
uniform float amp5;
uniform float amp6;
uniform float amp7;

uniform float amp8;
uniform float amp9;
uniform float amp10;
uniform float amp11;
uniform float amp12;
uniform float amp13;
uniform float amp14;
uniform float amp15;

uniform float amp16;
uniform float amp17;
uniform float amp18;
uniform float amp19;
uniform float amp20;
uniform float amp21;
uniform float amp22;
uniform float amp23;

uniform float amp24;
uniform float amp25;
uniform float amp26;
uniform float amp27;
uniform float amp28;
uniform float amp29;
uniform float amp30;
uniform float amp31;

float amps[32];

float getData(int id) {
    for (int i=0; i<32; i++) {
        if (i == id) return amps[i];
    }
}

void main()
{

	float numberSections = 32.;
    
    amps[0] = amp0;
    amps[1] = amp1;
    amps[2] = amp2;
    amps[3] = amp3;
    amps[4] = amp4;
    amps[5] = amp5;
    amps[6] = amp6;
    amps[7] = amp7;

    amps[8] = amp8;
    amps[9] = amp9;
    amps[10] = amp10;
    amps[11] = amp11;
    amps[12] = amp12;
    amps[13] = amp13;
    amps[14] = amp14;
    amps[15] = amp15;

    amps[16] = amp16;
    amps[17] = amp17;
    amps[18] = amp18;
    amps[19] = amp19;
    amps[20] = amp20;
    amps[21] = amp21;
    amps[22] = amp22;
    amps[23] = amp23;

    amps[24] = amp24;
    amps[25] = amp25;
    amps[26] = amp26;
    amps[27] = amp27;
    amps[28] = amp28;
    amps[29] = amp29;
    amps[30] = amp30;
    amps[31] = amp31;

	vUv = uv;

    float dst = pow(distance(position, vec3(0.,0.,-10.)),u_slider);
	vec4 mvPosition = modelViewMatrix * vec4( vec3(position.x,position.y,position.z+dst), 1.0 );
	//vNormal = normalMatrix * normal;
	vNormal = normal;
	
	
	vec4 originalPosition = projectionMatrix * mvPosition;
	int section = int(floor(((vNormal.y+1.)*.5)*numberSections));

	float multiplier = getData(section);
	//vec4 newPosition = projectionMatrix * mvPosition;
	//newPosition.y += multiplier*.02;
    //newPosition.z += distance(originalPosition, vec4(0.));
    //newPosition.z = 
	gl_Position = originalPosition;//vec4( originalPosition, 1.0 );
	//gl_Position = mvPosition;
}