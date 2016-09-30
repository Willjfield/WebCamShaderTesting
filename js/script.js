var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var controls, renderer;

var geometry,material,cube, light;

function init(){
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls(camera, renderer.domElement);
						controls.enableDamping = true;
						controls.dampingFactor = 0.25;
						controls.minDistance = 0;
						controls.minPolarAngle = 0; // radians
						controls.maxPolarAngle = Math.PI*2

	camera.position.z = -25;

	geometry = new THREE.BoxGeometry( 10, 10, 10 );
	material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	scene.add( light );
}

function update(){
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	controls.update();
	renderer.render(scene, camera);
}

function render(){
	update();
	requestAnimationFrame( render );
}

init();
render();

window.addEventListener('resize', function(){

		renderer.setSize( window.innerWidth, window.innerHeight );

		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}, false);
