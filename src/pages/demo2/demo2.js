// 画一条线
const THREE = require('three');
const Stats = require('stats-js');
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
  camera.position.x = 50;
  camera.position.y = 50;
  camera.position.z = 200;

  // camera.up.x = 1;
  // camera.up.y = 1;
  // camera.up.z = 2;

  // camera.lookAt({
  //   x: 0, y: 0, z: 50
  // });
}

const initScene = function () {
  scene = new THREE.Scene();
};

const initLight = function () {
  light = new THREE.DirectionalLight(0x00ffff, 1.0); // 平行光
  light.position.set(100, 100, 20);
  scene.add(light);
};

const initObject = function () {
  var geometry = new THREE.Geometry();
  var p1 = new THREE.Vector3(0, 0, 0);
  var p2 = new THREE.Vector3(100, 100, 30);
  geometry.vertices.push(p1); // 顶点
  geometry.vertices.push(p2);
  geometry.vertices.push(new THREE.Vector3(0, 100, 30));
  geometry.colors.push(new THREE.Color(0xFF0000),
    new THREE.Color(0x00FF00),
    new THREE.Color(0x0000FF));
  // 使用定点颜色
  var material = new THREE.LineBasicMaterial({vertexColors: true});
  // 不适用定点颜色
  // var material = new THREE.LineBasicMaterial({vertexColors: false, color: 'blue'});
  var line = new THREE.Line(geometry, material, THREE.LineSegments);
  scene.add(line);


  var curve = new THREE.SplineCurve3([
    new THREE.Vector3(-10, 10, 10),
    new THREE.Vector3(10, 0, 10)
  ]);

  var geometry2 = new THREE.Geometry();
  geometry2.vertices = curve.getPoints(50);
  debugger
  var material = new THREE.LineBasicMaterial({color : 0x000000});
  var line2 = new THREE.Line(geometry2, material);
  scene.add(line2);

};

initThree();
initCamera();
initScene();
initLight();
initObject();
//坐标轴辅助
var axes = new THREE.AxisHelper(10000);
scene.add(axes);

function render () {
  stats.begin();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  stats.end();
}
render();
