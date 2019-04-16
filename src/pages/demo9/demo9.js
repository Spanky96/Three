// 旋转
const THREE = require('three');
const Stats = require('stats-js');

var stats;
var camera, scene, renderer;

init();
animate();

var boxMesh, boxHelper, pivot;
function init() {
  var container = document.getElementById('canvas-frame');
  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0";
  stats.domElement.style.top = "0";
  container.appendChild(stats.domElement);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.x = 50;
  camera.position.y = 50;
  camera.position.z = 200;
  scene = new THREE.Scene();

  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  var axes = new THREE.AxisHelper(1000);
  scene.add(axes);
  var girdHelp = new THREE.GridHelper(400, 20);
  scene.add(girdHelp);

  //initObjects
  var geometry = new THREE.BoxGeometry(30, 30, 30);
  for (var i = 0; i < geometry.faces.length; i += 2) {
    var hex = Math.random() * 0xffffff;
    geometry.faces[i].color.setHex(hex);
    geometry.faces[i + 1].color.setHex(hex);
  }

  var material = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
  boxMesh = new THREE.Mesh(geometry, material);

  scene.add(boxMesh);

  var geometry = new THREE.CylinderGeometry(0, 15, 30, 3);
  objMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 'red'}));
  
  pivot = new THREE.Group();
  scene.add(pivot);
  pivot.add(objMesh);
  objMesh.translateX(80);
  var pivbtHelper = new THREE.AxisHelper(50);
  pivbtHelper.position.copy(pivot.position);
  scene.add(pivbtHelper);

  boxHelper = new THREE.BoxHelper(objMesh);
  pivot.add(boxHelper);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xf0f0f0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
}

function render() {
  boxMesh.rotateY(0.001);
  pivot.rotateY(0.01);
  objMesh.rotateY(0.2);
  boxHelper.rotateY(0.01);
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}