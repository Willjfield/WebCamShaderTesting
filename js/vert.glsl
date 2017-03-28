varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float u_slider;

void main()
{

	float numberSections = 32.;

	vUv = uv;

	vec4 mvPosition = modelViewMatrix * vec4( vec3(position.x,position.y,position.z), 1.0 );
	//vNormal = normalMatrix * normal;
	vNormal = normal;
		
	
	vec4 pos = projectionMatrix * mvPosition;
	vPosition = position.xyz;
	gl_Position = pos;//vec4( originalPosition, 1.0 );
}