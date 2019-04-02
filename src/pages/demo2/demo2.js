// 画一条线
const THREE = require('three');
// 画布（长宽） 渲染器 摄像头 场景 灯光 物件
var width;
var height;
var renderer;
var camera;
var scene;
var light;

const initThree = function () {
  width = document.getElementById('canvas-frame').clientWidth;
  height = document.getElementById('canvas-frame').clientHeight;
  renderer = new THREE.WebGLRenderer({
    antialias: true // 弱锯齿 降低锯齿感 占更大性能
  });
  renderer.setSize(width, height);
  document.getElementById('canvas-frame').appendChild(renderer.domElement);
  renderer.setClearColor(0xFFFFFF, 1.0);
};

const initCamera = function () {
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.x = 0;
  camera.position.y = 1000;
  camera.position.z = 0;

  // camera.up.x = 0;
  // camera.up.y = 0;
  // camera.up.z = 1;

  // camera.lookAt({
  //   x: 0, y: 0, z: 0
  // });
}

const initScene = function () {
  scene = new THREE.Scene();
};

const initLight = function () {
  light = new THREE.DirectionalLight(0xFF0000, 1.0); // 平行光
  light.position.set(100, 100, 200);
  scene.add(light);
};
 
const initObject = function () {
  var geometry = new THREE.Geometry();
  var p1 = new THREE.Vector3(-100, 0, 0);
  var p2 = new THREE.Vector3(100, 0, 0);
  geometry.vertices.push(p1); // 顶点
  geometry.vertices.push(p2);
  geometry.colors.push(new THREE.Color(0x444444), new THREE.Color(0xFF0000));

  var material = new THREE.LineBasicMaterial({vertexColors: true});

  var line = new THREE.Line(geometry, material, THREE.LineSegments);
  scene.add(line);
};

initThree();
initCamera();
initScene();
initLight();
initObject();
//坐标轴辅助
var axes = new THREE.AxisHelper(100);
scene.add(axes)
renderer.clear();
renderer.render(scene, camera);