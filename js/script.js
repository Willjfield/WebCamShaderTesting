// fork getUserMedia for multiple browser versions, for the future
// when more browsers support MediaRecorder

navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

//main block for doing the audio recording

if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: false,
         video: true
      },

      // Success callback
      function(stream) {
      
        var videoURL = window.URL.createObjectURL(stream);
        var video = document.createElement('video');
        video.src = videoURL;
        video.onloadedmetadata = function() {
         video.play(); 
         threeRender(video);
        };
      },

      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
   console.log('getUserMedia not supported on your browser!');
}

// three.js cube drawing
var teapot, material;
function threeRender(video) {

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// load a texture, set wrap mode to repeat
// var texture = new THREE.VideoTexture(video);
// texture.wrapS = THREE.ClampToEdgeWrapping;
// texture.wrapT = THREE.ClampToEdgeWrapping;
var texture = new THREE.VideoTexture( video );
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.format = THREE.RGBFormat;
texture.needsUpdate = true;
//texture.repeat.set( 1, 1 ); 

//var geometry = new THREE.PlaneGeometry(16,9,64,36);
//var material = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide,  shading: THREE.FlatShading } );
material = new THREE.ShaderMaterial( {
        uniforms: {
            time: { type: "f", value: 1 },
            webcam: { type: "t", value: texture}
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.DoubleSide  
    } );

// //material.side = THREE.DoubleSide;
// //material.map.minFilter = THREE.LinearFilter;
// var plane = new THREE.Mesh( geometry, material );
// //plane.rotation.y = Math.PI/4;
// scene.add( plane );

var loader = new THREE.OBJLoader( );
        loader.load( 'teapot.obj', function ( object ) {
          console.log(object);
          object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {
              child.material = material;
              child.material.map = texture;
              child.geometry.computeFaceNormals();
              child.geometry.computeVertexNormals();
              child.material.needsUpdate = true;
              child.geometry.uvsNeedUpdate = true;
              child.geometry.buffersNeedUpdate = true;
            }

          } );
          object.children[0].material.needsUpdate = true;
          teapot = object;
          teapot.position.z = -100;
          teapot.position.x = -50;
          scene.add( teapot );
        });
        
camera.position.z = 100;
camera.position.y = 100;
camera.rotation.x = -.25;
//camera.position.x = 25;

var light = new THREE.AmbientLight( 'rgb(255,255,255)' ); // soft white light
scene.add( light );

// White directional light at half intensity shining from the top.
//var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
//directionalLight.position.set( 0, 1, 0 );
//scene.add( directionalLight );

// white spotlight shining from the side, casting shadow
var spotLight = new THREE.SpotLight( 'rgb(255,255,255)' );
spotLight.position.set( 100, 1000, 1000 );
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
scene.add( spotLight );

 // geometrys
var geos={};
var mats={};
var materialType = 'MeshBasicMaterial';
var ToRad = 0.0174532925199432957;
var grounds = [];
function basicTexture(n){
    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext( '2d' );
    var color;
    if(n===0) color = "#3884AA";// sphere58AA80
    if(n===1) color = "#61686B";// sphere sleep
    if(n===2) color = "#AA6538";// box
    if(n===3) color = "#61686B";// box sleep
    if(n===4) color = "#AAAA38";// cyl
    if(n===5) color = "#61686B";// cyl sleep
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);
    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}

geos['sphere'] = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry(1,16,10));
geos['box'] = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry(1,1,1));
geos['cylinder'] = new THREE.BufferGeometry().fromGeometry(new THREE.CylinderGeometry(1,1,1));
// materials
mats['sph']    = new THREE[materialType]( {shininess: 10, map: basicTexture(0), name:'sph' } );
mats['box']    = new THREE[materialType]( {shininess: 10, map: basicTexture(2), name:'box' } );
mats['cyl']    = new THREE[materialType]( {shininess: 10, map: basicTexture(4), name:'cyl' } );
mats['ssph']   = new THREE[materialType]( {shininess: 10, map: basicTexture(1), name:'ssph' } );
mats['sbox']   = new THREE[materialType]( {shininess: 10, map: basicTexture(3), name:'sbox' } );
mats['scyl']   = new THREE[materialType]( {shininess: 10, map: basicTexture(5), name:'scyl' } );
mats['ground'] = new THREE[materialType]( {shininess: 10, color:0x3D4143, transparent:true, opacity:0.5 } );

function addStaticBox(size, position, rotation) {
        var mesh = new THREE.Mesh( geos.box, mats.ground );
        mesh.scale.set( size[0], size[1], size[2] );
        mesh.position.set( position[0], position[1], position[2] );
        mesh.rotation.set( rotation[0]*ToRad, rotation[1]*ToRad, rotation[2]*ToRad );
        scene.add( mesh );
        grounds.push(mesh);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
}

addStaticBox([40, 40, 390], [-180,20,0], [0,0,0]);
addStaticBox([40, 40, 390], [180,20,0], [0,0,0]);
addStaticBox([400, 80, 400], [0,-40,0], [0,0,0]);


//render the scene
var counter=0;
function render() {
  counter++;
  requestAnimationFrame(render);
  // plane.geometry.computeFaceNormals();
  // plane.geometry.computeVertexNormals();
  // // sphere.rotation.x += 0.001;
  if(teapot){
    teapot.rotation.y += 0.005;
    teapot.children[0].material.uniforms.time=counter;
    teapot.children[1].material.uniforms.time=counter;
  }
  
  texture.needsUpdate = true;
  // plane.geometry.verticesNeedUpdate = true;
  renderer.render(scene, camera);
}

render();

}