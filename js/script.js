var $ = require('jquery');
var glsl = require('glslify');
var THREE = require('three');

var container;
        var camera, scene, renderer;
        var uniforms;
        var analyser;
        init();
        animate();

        function init() {
            container = document.getElementById( 'container' );

            camera = new THREE.Camera();
            camera.position.z = 1;

            scene = new THREE.Scene();

            var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

            uniforms = {
                u_time: { type: "f", value: 1.0 },
                u_resolution: { type: "v2", value: new THREE.Vector2() },
                u_mouse: { type: "v2", value: new THREE.Vector2() },
                amp: { type: "f", value: 1.0 }
            };

            var material = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: document.getElementById( 'vertexShader' ).textContent,
                fragmentShader: document.getElementById( 'fragmentShader' ).textContent
            } );

            var mesh = new THREE.Mesh( geometry, material );
            scene.add( mesh );

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio( window.devicePixelRatio );

            container.appendChild( renderer.domElement );

            var Analyser = require('gl-audio-analyser');
            var audio    = document.getElementById('audio-src');
            audio.play();
            console.log(renderer)
            analyser = Analyser(renderer.context, audio);

            onWindowResize();
            window.addEventListener( 'resize', onWindowResize, false );

            document.onmousemove = function(e){
              uniforms.u_mouse.value.x = e.pageX
              uniforms.u_mouse.value.y = e.pageY
            }
        }

        function onWindowResize( event ) {
            renderer.setSize( window.innerWidth, window.innerHeight );
            uniforms.u_resolution.value.x = renderer.domElement.width;
            uniforms.u_resolution.value.y = renderer.domElement.height;
        }

        function animate() {
            requestAnimationFrame( animate );
            render();
        }

        var waveform = analyser.waveform();
        var freqs=[];

        var waveLength = waveform.length;
        var numSections = 4;

        for(var f = 0;f<numSections;f++){
          freqs.push(0)
        }
        console.log(freqs)
        var bandwidth = waveLength/numSections;
        var averageAmp = 0;

        function render() {
            waveform = analyser.waveform();
            averageAmp = 0;
            for(var w=0;w<numSections;w++){
              for(var b = 0;b<bandwidth;b++){
                var band = b*(w+1);
                freqs[w] += waveform[band];
              }
              freqs[w] /= bandwidth;              
            }
            //averageAmp/=waveLength;
            //averageAmp -= 128;
            var moveAmnt = (averageAmp-127)/10; 
            //console.log(moveAmnt)
            //console.log(freqs[0])
            //uniforms.amp.value = freqs[0];
            uniforms.u_time.value += 0.05;
            renderer.render( scene, camera );
        }
// fork getUserMedia for multiple browser versions, for the future
// when more browsers support MediaRecorder
/*
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

var camera = new THREE.PerspectiveCamera( 75, 16/9, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerHeight*(16/9), window.innerHeight );
document.body.appendChild( renderer.domElement );

var Analyser = require('gl-audio-analyser');
var audio    = document.getElementById('audio-src');
audio.play();
console.log(renderer)
var analyser = Analyser(renderer.context, audio);


//console.log('analyser '+analyser)

// load a texture, set wrap mode to repeat
// var texture = new THREE.VideoTexture(video);
// texture.wrapS = THREE.ClampToEdgeWrapping;
// texture.wrapT = THREE.ClampToEdgeWrapping;
var texture = new THREE.VideoTexture( video );
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.format = THREE.RGBFormat;
//texture.repeat.set( 1, 1 ); 

var geometry = new THREE.PlaneGeometry(1.75,1.75,64,36);
//var material = new THREE.MeshLambertMaterial( { map: texture, shading: THREE.FlatShading } );
var material = new THREE.ShaderMaterial( {
        uniforms: {
            time: { type: "f", value: 1.0 },
            webcam: { type: "t", value: texture},
            amp: {type: "f", value:1.0}
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.DoubleSide  
    } );
var planeMat = new THREE.MeshBasicMaterial( {color:0xffffff} );
geometry.computeFaceNormals();
geometry.computeVertexNormals();
//material.side = THREE.DoubleSide;
//material.map.minFilter = THREE.LinearFilter;
var plane = new THREE.Mesh( geometry, material );
plane.matrixAutoUpdate = true;
//plane.position.z = -20;
//plane.rotation.y = Math.PI/4;
scene.add( plane );

camera.position.z = 10;
camera.position.y = 1;

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
var waveform = analyser.waveform();
var waveLength = waveform.length;
var averageAmp = 0;
function render() {
  waveform = analyser.waveform();
  averageAmp = 0;
  for(var w=0;w<waveLength;w++){
    averageAmp+=waveform[w];
  }
  averageAmp/=waveLength;
  //averageAmp -= 128;
  var moveAmnt = (averageAmp-127)/10; 
  //console.log(moveAmnt)
  material.uniforms.amp = 1.0;
  console.log(material.uniforms.amp)
  //plane.scale.x =1+moveAmnt;
  //console.log()
  //camera.position.z += 
  //console.log('averageAmp '+averageAmp)
  requestAnimationFrame(render);
  // plane.geometry.computeFaceNormals();
  // plane.geometry.computeVertexNormals();
  // sphere.rotation.x += 0.001;
  //plane.rotation.y += 0.001;
  texture.needsUpdate = true;
  //plane.geometry.verticesNeedUpdate = true;
  renderer.render(scene, camera);

}

render();

window.addEventListener('resize', function(){

    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerHeight*(16/9), window.innerHeight );
    //renderer.setSize( window.innerWidth, window.innerHeight );
  }, false);

}
*/

