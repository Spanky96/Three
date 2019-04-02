// 画一条线
const THREE = require('three');
const Stats = require('stats-js');
const dat = require('dat.gui');
// 画布（长宽） 渲染器 摄像头 场景 灯光 物件
var width;
var height;
var renderer;
var camera;
var scene;
var light;
var stats;
const initThree = function () {
  width = document.getElementById('canvas-frame').clientWidth;
  height = document.getElementById('canvas-frame').clientHeight;
  renderer = new THREE.WebGLRenderer({
    antialias: true // 弱锯齿 降低锯齿感 占更大性能
  });
  renderer.setSize(width, height);
  document.getElementById('canvas-frame').appendChild(renderer.domElement);
  renderer.setClearColor(0xFFFFFF, 1.0);

  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0";
  stats.domElement.style.top = "0";
  document.getElementById('canvas-frame').appendChild(stats.domElement);
};

const initCamera = function () {
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
  camera.position.x = 100;
  camera.position.y = 100;
  camera.position.z = 200;

  // camera.up.x = 0;
  // camera.up.y = 1;
  // camera.up.z = 0;

  camera.lookAt(new THREE.Vector3(0, 0, 0));
};

var param;
const createUI = function () {
  var ParamObj = function () {
    this.fov = 45;
  };
  param = new ParamObj();
  var gui = new dat.GUI();
  gui.add(param, 'fov', 0, 180).name('视角大小');
};

const initScene = function () {
  scene = new THREE.Scene();
};

const initLight = function () {
  light = new THREE.DirectionalLight(0x00ffff, 1.0); // 平行光
  light.position.set(100, 100, 1000);
  scene.add(light);
};
 
const initObject = function () {
  var geometry = new THREE.CylinderGeometry(0, 30, 50, 4);
  var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF});
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position = new THREE.Vector3(0, 0, 0);
  scene.add(mesh);
};
function setCameraFov(fov) {
  camera.fov = fov;
  camera.updateProjectionMatrix();
}
const changeParam = function () {
  setCameraFov(param.fov);
};

initThree();
initCamera();
initScene();
initLight();
initObject();
createUI();
//坐标轴辅助
var axes = new THREE.AxisHelper(10000);
scene.add(axes);

function render () {
  stats.begin();
  changeParam();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  stats.end();
}
render();