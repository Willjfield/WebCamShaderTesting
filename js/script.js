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
          teapot.position.z = -200;
          scene.add( teapot );

        });
camera.position.z = 15;
camera.position.y = 25;
camera.position.x = 25;

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