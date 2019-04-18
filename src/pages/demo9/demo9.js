// 粒子系统
const THREE = require('three');
const JSONLoader = require('../../utils/JSONLoader');
const BinaryLoader = require('../../utils/BinaryLoader');
var SCREEN_HEIGHT = window.innerHeight;
var SCREEN_WIDTH = window.innerWidth;
var container;
var camera, scene, renderer;
var mesh, directionalLight;
var parent, meshes = [], cloneMeshes = [];
var p;
var aloader, bloader;
var composer, effectFoucus;
var clock = new THREE.Clock();

init();
animate();

var boxMesh, boxHelper, pivot;
function init() {
  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 20, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 50000 );
  camera.position.set( 0, 700, 7000 );

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );

  camera.lookAt( scene.position );

  aloader = new JSONLoader();
  aloader.load( "/static/42/terrain.js", function( geometry ) {
    var material =new THREE.PointsMaterial({color: 'yellow', size: 25});
    var mesh = new THREE.Points(geometry, material);
    mesh.scale.x = mesh.scale.z = 30;
    mesh.scale.y = 0.2;
    mesh.position.y =  -300;
    scene.add(mesh);
  });

  bloader = new BinaryLoader();
  bloader.load( "/static/42/veyron/VeyronNoUv_bin.js", function( geometry ) {
    var material = new THREE.PointsMaterial({color: 0x00ff00});
    var mesh = new THREE.Points(geometry, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 3;
    scene.add(mesh);
  });

  bloader.load( "/static/42/female02/Female02_bin.js", function( geometry ) {
    var material = new THREE.PointsMaterial({color: 0x00ffff});
    var mesh = new THREE.Points(geometry, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 3;
    mesh.position.x =  300;
    scene.add(mesh);
  });

  bloader.load( "/static/42/male02/Male02_bin.js", function( geometry ) {
    var material = new THREE.PointsMaterial({color: 0x0000ff});
    var mesh = new THREE.Points(geometry, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 3;
    mesh.position.x =  -300;
    scene.add(mesh);
  });


  var axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);
  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  renderer.autoClear = false;
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.clear();
  renderer.render(scene, camera);
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}