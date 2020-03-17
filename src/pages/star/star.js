// 拾取
const THREE = require('three');
const Stats = require('stats-js');
// const dat = require('dat.gui');

var stats;
var camera, scene, raycaster, renderer;

var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
var particles;
var PARTICLE_SIZE = 5;
init();
animate();

function init () {
  var container = document.createElement('div');
  document.body.appendChild(container);

  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0";
  stats.domElement.style.top = "0";
  container.appendChild(stats.domElement);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 200, 10000);
  scene = new THREE.Scene();

  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // for ( var i = 0; i < 10000; i ++ ) {
  //   var starsGeometry = new THREE.Geometry();
  //   var star = new THREE.Vector3();
  //   starsGeometry.vertices.push( star );
  //   var material = new THREE.PointsMaterial({color: 0xffffff, size: 1});
  //   var object = new THREE.Points(starsGeometry, material);
  //   object.position.x = THREE.Math.randFloatSpread(400);
  //   object.position.y = Math.random() * 200 - 50;
  //   object.position.z = THREE.Math.randFloatSpread(400);
  //   scene.add(object);
  // }

  // var starsGeometry = new THREE.Geometry();

  // for ( var i = 0; i < 10000; i ++ ) {
  //   var star = new THREE.Vector3();
  //   star.x = THREE.Math.randFloatSpread(400);
  //   star.y = THREE.Math.randFloatSpread(400);
  //   star.z = THREE.Math.randFloatSpread(400);
  //   starsGeometry.vertices.push(400);
  // }
  var length = 1000;
  var positions = new Float32Array( length * 3 );
  var colors = new Float32Array( length * 3 );
  var sizes = new Float32Array( length );
  var color = new THREE.Color();
  var vertex;
  for ( var i = 0, l = length; i < l; i ++ ) {

    vertex = new THREE.Vector3(THREE.Math.randFloatSpread(400), THREE.Math.randFloatSpread(400), THREE.Math.randFloatSpread(400));
    vertex.toArray( positions, i * 3 );

    color.setHSL( 1.0, 1.0, 1.0 );
    color.toArray( colors, i * 3 );

    sizes[ i ] = PARTICLE_SIZE;

  }
  var starsGeometry = new THREE.BufferGeometry();
  starsGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  starsGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
  starsGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  var starsMaterial = new THREE.PointsMaterial({color: 0xffffff})
  particles = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(particles);
 

  raycaster = new THREE.Raycaster();
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x050505);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, false);
}

function render () {
  theta += 0.01;
  camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
  camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
  camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
  camera.lookAt(scene.position);
  camera.updateMatrixWorld();
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
    debugger
    if ( INTERSECTED != intersects[ 0 ].index ) {

      attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;

      INTERSECTED = intersects[ 0 ].index;

      attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE * 100;
      attributes.size.needsUpdate = true;

    }

  } else if ( INTERSECTED !== null ) {

    attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
    attributes.size.needsUpdate = true;
    INTERSECTED = null;

  }

  renderer.render(scene, camera);
}

function animate () {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}