var $ = require('jquery');
var glslify = require('glslify');
var glShader = require('gl-shader');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var noise = require('fantasy-map-noise');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var controls, renderer;

var geometry,material,cube, light, uniforms, texture, parentObj;
var audio, analyser;

navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

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
        init(video);
        render();
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

function init(_video){
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor (0x020202, 1);
  document.body.appendChild( renderer.domElement );

  controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.minDistance = 0;
            controls.minPolarAngle = 0; // radians
            controls.maxPolarAngle = Math.PI*2

  camera.position.z = -20;
  camera.position.y = 10;
  texture = new THREE.VideoTexture( _video );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  
  var gui = new dat.GUI();
  var params = {
    _light_pos_x: 0,
    _light_pos_y: 0,
    _light_pos_z: 0
  }

  var changingVal = gui.add( params, '_light_pos_x' ).min(-5).max(5).step(0.01).name('_light_pos_x').listen();
  changingVal.onChange(function(value) 
  {   uniforms._light_pos.value.x = value  
      console.log(uniforms._light_pos.value);
  });

  var changing_light_pos_y = gui.add( params, '_light_pos_y' ).min(-5).max(5).step(0.01).name('_light_pos_y').listen();
  changing_light_pos_y.onChange(function(value) 
  {   uniforms._light_pos.value.y = value  
      console.log(uniforms._light_pos.value);
  });

  var changing_light_pos_z = gui.add( params, '_light_pos_z' ).min(-5).max(5).step(0.01).name('_light_pos_z').listen();
  changing_light_pos_z.onChange(function(value) 
  {   uniforms._light_pos.value.z = value  
      console.log(uniforms._light_pos.value);
  });
  

//   var myImage = new THREE.TextureLoader();
  
//   myImage.addEventListener('load', function(event){
//     uniforms.colorMap.value = event.content;
//   });

// myImage.load('img/IMG_20170321_100439.jpg');

// var texloader = new THREE.TextureLoader();
// texloader.load("img/IMG_20170321_100439.jpg", function(tex) {

//   //var mat = new THREE.MeshBasicMaterial({ map: tex });
//   uniforms.colorMap.value = tex;
// });


  uniforms = {
        colorMap: { type: "t", value: new THREE.TextureLoader().load( "./img/1024/1024_5.jpg" ) },
        u_slider: { type: "f", value: 1.0 },
        _light_pos: { type: "v3", value: new THREE.Vector3( 1, 0, 1)},
        webcam: { type: "t", value: texture},
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth,window.innerHeight) },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        /*amplitude:{type: "f", value: 1.0},*/
        uEyePos: { type: "v3", value: camera.position},
        noise_stage: { type: "f", value: 1.0 },
    };


  geometry = new THREE.IcosahedronBufferGeometry(0, 4);
  //geometry = new THREE.PlaneBufferGeometry( 16, 9, 32 );
  //geometry = new THREE.CylinderBufferGeometry( 10, 10, 100, 64, 1, true );
material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: glslify("./vert.glsl"),
      fragmentShader: glslify("./frag.glsl"),
      side: THREE.DoubleSide  
  } );
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  //material = new THREE.MeshBasicMaterial( {color:0x111111} );
  var spread = 5;
  var scaleMax = 5;
  var number = 1;
  parentObj = new THREE.Object3D();
  for(var m=0;m<number;m++){
    var posx=(Math.random()*2-1)*spread;
    var posy=(Math.random()*2-1)*spread;
    var posz=(Math.random()*2-1)*spread;
    var _scale = (Math.random()*2-1)*scaleMax;
    //createMesh(geometry, material, new THREE.Vector3( posx,posy, posz ),new THREE.Vector3( posx,posy, posz ),_scale,parent);
  }
  createMesh(geometry, material, new THREE.Vector3( 0,0, 0 ),new THREE.Vector3( 0,0, 0 ),1,parentObj);
  parentObj.rotateZ(Math.PI)

  scene.add(parentObj);

  //console.log(parent.children)

  var Analyser = require('gl-audio-analyser');
  var audio    = document.getElementById('audio-src');
  audio.play();
  analyser = Analyser(renderer.context, audio);

  // light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  // scene.add( light );
}

function createMesh(_geometry, _material, _position, _rotation, _scale, _parent){
  var _mesh = new THREE.Mesh( _geometry, _material );
  _mesh.position.set(_position.x,_position.y,_position.z);
  _mesh.rotation.set(_rotation.x,_rotation.y,_rotation.z);
  _mesh.scale.set(_scale,_scale,_scale);
  _parent.add( _mesh );
  //console.log(_mesh)
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
var js_noise_stage = 0;
//var noise_light_pos_x;
function render() {
  js_noise_stage+=.01;
  // parentObj.rotateX(.001);
  //parentObj.rotateY(.001);
  // parentObj.rotateZ(.001);
  //console.log(noise_light_pos_x)
  //uniforms._light_pos.value = new THREE.Vector3(Math.sin(js_noise_stage)*.5,Math.cos(js_noise_stage)*.5,.2);
  //uniforms._light_pos.value = new THREE.Vector3(Math.sin(js_noise_stage)*.1,1,Math.cos(js_noise_stage)*.1);
  uniforms.uEyePos.value = camera.position;
  requestAnimationFrame( render );
    texture.needsUpdate = true;
     //controls.rotateUp(noise.perlin2(.1, js_noise_stage));
    controls.update();
    //waveform = analyser.waveform();
    //freq = analyser.frequencies();
    //var amplitude = largest(waveform)/128; //uniforms.amplitude.value = amplitude; //console.log(amplitude) noise_stage += amplitude-1; //uniforms.noise_stage.value = noise_stage; // for(var i=0;i<32;i++){ //   uniforms['amp'+i].value = (freq[i*2]+freq[(i*2)+1])/2; // } // for(var s = 0; s<parent.children.length;s++){ //   noise_light_pos_x = noise.perlin2(s*.1, js_noise_stage); //   parent.children[s].position.x = noise_light_pos_x*10; //   noise_light_pos_x = noise.perlin2(s*.34, js_noise_stage); //   parent.children[s].position.y = noise_light_pos_x*10; //   noise_light_pos_x = noise.perlin2(s*.77, js_noise_stage); //   parent.children[s].position.z = noise_light_pos_x*10; // }

    uniforms.u_time.value += 0.05;
    renderer.render( scene, camera );
    
}



window.addEventListener('resize', function(){

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, false);
