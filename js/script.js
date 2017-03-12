var $ = require('jquery');
var glsl = require('glslify');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var controls, renderer;

var geometry,material,cube, light, uniforms;
var audio, analyser;

function init(){
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.minDistance = 0;
            controls.minPolarAngle = 0; // radians
            controls.maxPolarAngle = Math.PI*2

  camera.position.z = -25;

  uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        amplitude:{type: "f", value: 1.0},
        amp0: { type: "f", value: 1.0 },
        amp1: { type: "f", value: 2.0 },
        amp2: { type: "f", value: 3.0 },
        amp3: { type: "f", value: 4.0 },
        amp4: { type: "f", value: 1.0 },
        amp5: { type: "f", value: 2.0 },
        amp6: { type: "f", value: 3.0 },
        amp7: { type: "f", value: 4.0 },

        amp8: { type: "f", value: 1.0 },
        amp9: { type: "f", value: 2.0 },
        amp10: { type: "f", value: 3.0 },
        amp11: { type: "f", value: 4.0 },
        amp12: { type: "f", value: 1.0 },
        amp13: { type: "f", value: 2.0 },
        amp14: { type: "f", value: 3.0 },
        amp15: { type: "f", value: 4.0 },

        amp16: { type: "f", value: 1.0 },
        amp17: { type: "f", value: 2.0 },
        amp18: { type: "f", value: 3.0 },
        amp19: { type: "f", value: 4.0 },
        amp20: { type: "f", value: 1.0 },
        amp21: { type: "f", value: 2.0 },
        amp22: { type: "f", value: 3.0 },
        amp23: { type: "f", value: 4.0 },

        amp24: { type: "f", value: 1.0 },
        amp25: { type: "f", value: 2.0 },
        amp26: { type: "f", value: 3.0 },
        amp27: { type: "f", value: 4.0 },
        amp28: { type: "f", value: 1.0 },
        amp29: { type: "f", value: 2.0 },
        amp30: { type: "f", value: 3.0 },
        amp31: { type: "f", value: 4.0 },
        noise_stage: { type: "f", value: 1.0 },

    };


  geometry = new THREE.SphereGeometry( 1, 16, 16 );
  //material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
  material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
      side: THREE.DoubleSide  
  } );

  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

    var Analyser = require('gl-audio-analyser');
    var audio    = document.getElementById('audio-src');
    audio.play();
    analyser = Analyser(renderer.context, audio);

  // light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  // scene.add( light );
}

function update(){
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  //renderer.render(scene, camera);
}

var numSections = 32;
var averageAmp = 0;

var counter = 0;

function avg(_array){
  var total = 0;
  for(var i = 0;i<_array.length;i++){
    total += _array[i]
  }
  total/=_array.length;
  return total
}

function largest(_array){
  var largest = 0;
  for(var i = 0;i<_array.length;i++){
    if(largest<_array[i]){
      largest = _array[i]
    } 
  }
  return largest
}
var noise_stage = 0;

function render() {
    update();
    waveform = analyser.waveform();
    freq = analyser.frequencies();

    var amplitude = largest(waveform)/128;
    uniforms.amplitude.value = amplitude;
    console.log(amplitude)
    noise_stage += amplitude-1;
    uniforms.noise_stage.value = noise_stage;

    for(var i=0;i<32;i++){
      uniforms['amp'+i].value = (freq[i*2]+freq[(i*2)+1])/2;
    }
    

    uniforms.u_time.value += 0.05;
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

// function render(){
  
//   requestAnimationFrame( render );
// }

init();
render();

window.addEventListener('resize', function(){

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, false);
/*
var container;
var camera, scene, renderer, parentOBJ, sphereparentOBJ;
var uniforms;
var analyser, waveform, waveLength,bandwidth;

//navigator.webkitGetUserMedia( {audio:true}, successCallback, errorCallback );
var audio    = document.getElementById('audio-src');
audio.play();
//audio.mute();
init(audio);
animate();

var mesh;
function init(_ac) {
    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    
    console.log(scene)
    camera = new THREE.PerspectiveCamera( 45,  window.innerWidth / window.innerHeight, .1, 1000 );
    scene.add(camera)
    //camera.updateProjectionMatrix ()
    camera.position.z = 20;
    console.log(camera.isPerspectiveCamera)

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        amplitude:{type: "f", value: 1.0},
        amp0: { type: "f", value: 1.0 },
        amp1: { type: "f", value: 2.0 },
        amp2: { type: "f", value: 3.0 },
        amp3: { type: "f", value: 4.0 },
        amp4: { type: "f", value: 1.0 },
        amp5: { type: "f", value: 2.0 },
        amp6: { type: "f", value: 3.0 },
        amp7: { type: "f", value: 4.0 },

        amp8: { type: "f", value: 1.0 },
        amp9: { type: "f", value: 2.0 },
        amp10: { type: "f", value: 3.0 },
        amp11: { type: "f", value: 4.0 },
        amp12: { type: "f", value: 1.0 },
        amp13: { type: "f", value: 2.0 },
        amp14: { type: "f", value: 3.0 },
        amp15: { type: "f", value: 4.0 },

        amp16: { type: "f", value: 1.0 },
        amp17: { type: "f", value: 2.0 },
        amp18: { type: "f", value: 3.0 },
        amp19: { type: "f", value: 4.0 },
        amp20: { type: "f", value: 1.0 },
        amp21: { type: "f", value: 2.0 },
        amp22: { type: "f", value: 3.0 },
        amp23: { type: "f", value: 4.0 },

        amp24: { type: "f", value: 1.0 },
        amp25: { type: "f", value: 2.0 },
        amp26: { type: "f", value: 3.0 },
        amp27: { type: "f", value: 4.0 },
        amp28: { type: "f", value: 1.0 },
        amp29: { type: "f", value: 2.0 },
        amp30: { type: "f", value: 3.0 },
        amp31: { type: "f", value: 4.0 },
        noise_stage: { type: "f", value: 1.0 },

    };

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.DoubleSide  
    } );

    var sphere = new THREE.SphereGeometry( 1, 16, 16 );
    mesh = new THREE.Mesh( sphere, material );
    //mesh.position.z = -100;
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var Analyser = require('gl-audio-analyser');
    audio = _ac;
    analyser = Analyser(renderer.context, audio);

    waveform = analyser.frequencies();
    waveLength = waveform.length;
    bandwidth = waveLength/numSections;

    var boxgeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
    var boxmaterial = new THREE.MeshBasicMaterial( {color:0x00ff00,wireframe:true});
    parentOBJ = new THREE.Object3D();
    for(var i=0;i<1024;i+=16){
     var boxmesh = new THREE.Mesh( boxgeometry, boxmaterial );
     boxmesh.position.x = (i*.05)-25;
     boxmesh.position.z = -30;
     parentOBJ.add(boxmesh);
    }

    var spheregeometry = new THREE.SphereBufferGeometry( .15, 4, 8 );
    var spherematerial = new THREE.MeshBasicMaterial( {color:0xff0000,wireframe:true});
    sphereparentOBJ = new THREE.Object3D();
    for(var i=0;i<1024;i+=16){
     var spheremesh = new THREE.Mesh( spheregeometry, spherematerial );
     spheremesh.position.x = (i*.05)-25;
     spheremesh.position.z = -30;
     sphereparentOBJ.add(spheremesh);
    }

    onWindowResize();

    document.onmousemove = function(e){
      uniforms.u_mouse.value.x = e.pageX
      uniforms.u_mouse.value.y = e.pageY
    }
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
    camera.aspect = window.innerWidth / window.innerHeight;
    console.log(camera)
    camera.updateProjectionMatrix();
}


window.addEventListener('resize', onWindowResize, false);

function animate() {
    requestAnimationFrame( animate );
    render();
}

var numSections = 32;
var averageAmp = 0;

var counter = 0;

function avg(_array){
  var total = 0;
  for(var i = 0;i<_array.length;i++){
    total += _array[i]
  }
  total/=_array.length;
  return total
}

function largest(_array){
  var largest = 0;
  for(var i = 0;i<_array.length;i++){
    if(largest<_array[i]){
      largest = _array[i]
    } 
  }
  return largest
}
var noise_stage = 0;

function render() {
    waveform = analyser.waveform();
    freq = analyser.frequencies();

    var amplitude = largest(waveform)/128;
    uniforms.amplitude.value = amplitude;
    //console.log(amplitude)
    noise_stage += amplitude-1;
    uniforms.noise_stage.value = noise_stage;

    for(var i=0;i<32;i++){
      uniforms['amp'+i].value = (freq[i*2]+freq[(i*2)+1])/2;
    }
    

    uniforms.u_time.value += 0.05;
    renderer.render( scene, camera );
}

function successCallback(stream) {
    //var audioContext = new (window.AudioContext)();

    // Create an AudioNode from the stream.
    //var mediaStreamSource = audioContext.createMediaStreamSource( stream );

    // Connect it to the destination to hear yourself (or any other node for processing!)
    //mediaStreamSource.connect( audioContext.destination );

    init(stream);
    //stream.getAudioTracks()[0].stop();
    animate();

}

function errorCallback() {
    console.log("The following error occurred: " + err);
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

