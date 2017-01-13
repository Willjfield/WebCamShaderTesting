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
//texture.repeat.set( 1, 1 ); 

var geometry = new THREE.PlaneGeometry(16,9,64,36);
//var material = new THREE.MeshLambertMaterial( { map: texture, shading: THREE.FlatShading } );
var material = new THREE.ShaderMaterial( {
        uniforms: {
            time: { type: "f", value: 1.0 },
            webcam: { type: "t", value: texture}
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.DoubleSide  
    } );
geometry.computeFaceNormals();
geometry.computeVertexNormals();
//material.side = THREE.DoubleSide;
//material.map.minFilter = THREE.LinearFilter;
var plane = new THREE.Mesh( geometry, material );
//plane.rotation.y = Math.PI/4;
scene.add( plane );
camera.position.z = 10;
//camera.position.y = 1;

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

function render() {
  requestAnimationFrame(render);
  plane.geometry.computeFaceNormals();
  plane.geometry.computeVertexNormals();
  // sphere.rotation.x += 0.001;
  //plane.rotation.y += 0.001;
  texture.needsUpdate = true;
  plane.geometry.verticesNeedUpdate = true;
  renderer.render(scene, camera);
}

render();

}