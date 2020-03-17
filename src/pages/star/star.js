// 拾取
const THREE = require('three');

var camera, scene, raycaster, renderer;

var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100;
var particles;
var PARTICLE_SIZE = 5;
var _THETA = 0.0001;
var theta = _THETA;
var __THETA = _THETA;
var containerWidth = window.innerWidth;
var containerHeight = window.innerHeight * 0.75;
init();
animate();

function init () {
  var container = document.getElementById('container');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight / 0.75, 100, 10000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 0;
  camera.lookAt(scene.position);
  camera.updateMatrixWorld();
  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);
  var length = 10000;
  var positions = new Float32Array( length * 3 );
  var colors = new Float32Array( length * 3 );
  var sizes = new Float32Array( length );
  var color = new THREE.Color();
  var vertex;
  for ( var i = 0, l = length; i < l; i ++ ) {
    // vertex = new THREE.Vector3(THREE.Math.randFloatSpread(window.innerWidth / 2), Math.random() * 0.75 / 4 * window.innerHeight, THREE.Math.randFloatSpread(window.innerWidth / 2));
    var ramdomX = (Math.random() * containerWidth / 2) * (Math.random() > 0.5 ? 1 : -1);
    var ramdomY = (Math.random() * containerWidth / 2) * (Math.random() > 0.5 ? 1 : -1);
    var ramdomZ = (Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1);
    vertex = new THREE.Vector3(ramdomX, ramdomY, ramdomZ);

    vertex.toArray( positions, i * 3 );

    color.setRGB( 1.0 * Math.random(), 1.0, 1.0 );
    color.toArray( colors, i * 3 );

    sizes[ i ] = PARTICLE_SIZE;

  }
  var starsGeometry = new THREE.BufferGeometry();
  starsGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  starsGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
  starsGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  var material = new THREE.ShaderMaterial( {

    uniforms: {
      color: { value: new THREE.Color( 0xffffff ) },
      texture: { value: new THREE.TextureLoader().load(require("./disc.png")) }
    },
    vertexShader: document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

    alphaTest: 0.9

  } );

  particles = new THREE.Points(starsGeometry, material);
  scene.add(particles);


  raycaster = new THREE.Raycaster();
  renderer = new THREE.WebGLRenderer({ antialias: true,alpha:true });
  // renderer.setClearColor(0x050505);
  renderer.setSize(containerWidth, containerHeight);
  renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

  renderer.domElement.addEventListener('click', (event) => {
    if (INTERSECTED) {
      alert('星星:' + INTERSECTED);
    }
  }, false);

  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / containerWidth) * 2 - 1;
    mouse.y = -(event.clientY / containerHeight) * 2 + 1;
  }, false);
}

function render () {
  // theta += _THETA;
  // camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
  // camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
  // camera.position.z = radius;

  // camera.lookAt(scene.position);
  // camera.updateMatrixWorld();
  particles.rotation.x += _THETA;
  particles.rotation.y -= _THETA;
  particles.rotation.z += (_THETA * (Math.random() > 0.5 ? 1 : -1));
  raycaster.setFromCamera(mouse, camera);

  // debugger
  // var intersects = raycaster.intersectObject(particles);
  // if (intersects.length > 0) {
  //   // debugger
  //   if (INTERSECTED != intersects[0].object) {
  //     if (INTERSECTED) {
  //       // INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
  //       INTERSECTED.material.color = new THREE.Color(0xffffff);
  //     }
  //     // debugger
  //     INTERSECTED = intersects[0].object;
  //     // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
  //     INTERSECTED.material.color = new THREE.Color(0xff0000);
  //     // INTERSECTED.material.emissive.setHex(0xff0000);
  //   }
  // } else {
  //   if (INTERSECTED) {
  //     // INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
  //     INTERSECTED.material.color = new THREE.Color(0xffffff);
  //   }
  //   INTERSECTED = null;
  // }


  var geometry = particles.geometry;
  var attributes = geometry.attributes;
  var intersects = raycaster.intersectObject(particles);
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].index ) {

      attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;

      INTERSECTED = intersects[ 0 ].index;

      attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE * 1.5;

      attributes.size.needsUpdate = true;
      _THETA = __THETA / 10;
    }

  } else if ( INTERSECTED !== null ) {
    attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
    attributes.size.needsUpdate = true;
    INTERSECTED = null;
    _THETA = __THETA;
  }

  renderer.render(scene, camera);
}

function animate () {
  requestAnimationFrame(animate);
  render();
}

window.onresize = function () {
  containerWidth = window.innerWidth;
  containerHeight = window.innerHeight * 0.75;
  camera.aspect = containerWidth / containerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(containerWidth, containerHeight);
}
