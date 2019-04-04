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
var gui = new dat.GUI();
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
  camera.position.x = 200;
  camera.position.y = 200;
  camera.position.z = 500;

  // camera.up.x = 0;
  // camera.up.y = 1;
  // camera.up.z = 0;

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var f = gui.addFolder('视角');
  f.add(param.camera, 'fov', 0, 180).name('视角大小');
};


var ParamObj = function () {
  this.camera = {
    fov: 45
  };
  this.p3 = {
    x: -100,
    y: 0,
    z: 100
  };
  this.light = {
    x: 0,
    y: 0,
    z: 100,
    color: '#ffffff',
    intensity: 1,
  };
};
var param = new ParamObj();

const initScene = function () {
  scene = new THREE.Scene();
};

const initLight = function () {
  light = new THREE.DirectionalLight(0x00ffff, 1.0); // 平行光
  light.position.set(100, 100, 20);
  scene.add(light);
};
var p3, geometry;
const initObject = function () {
  geometry = new THREE.Geometry();
  var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, wireframe: false});
  var p1 = new THREE.Vector3(100, 0, 0);
  var p2 = new THREE.Vector3(0, 100, 0);
  p3 = new THREE.Vector3(param.p3.x, param.p3.y, param.p3.z);  // 要逆时针，面的法向量对相机
  
  var f = gui.addFolder('p3');
  f.add(param.p3, 'x', -200, 200).name('x');
  f.add(param.p3, 'y', -200, 200).name('y');
  f.add(param.p3, 'z', -200, 200).name('z');
  
  var color1 = new THREE.Color(0xFF0000);
  var color2 = new THREE.Color(0x00FF00);
  var color3 = new THREE.Color(0x0000FF);

  geometry.vertices.push(p1, p2, p3); 
  geometry.colors.push(color1, color2, color3);
  var face = new THREE.Face3(0, 1, 2);
  face.vertexColors.push(color1, color2, color3);
  geometry.faces.push(face);
  var object = new THREE.Mesh(geometry, material);
  scene.add(object);
};
function setCameraFov(cameraParam) {
  camera.fov = cameraParam.fov;
  camera.updateProjectionMatrix();
}
function setLight(Lightparam) {
  light.position.set(Lightparam.x, Lightparam.y, Lightparam.z);
  light.intensity = Lightparam.intensity;
  light.color.set(Lightparam.color);
}
function setP3(P3Param) {
  p3.x = P3Param.x;
  p3.y = P3Param.y;
  p3.z = P3Param.z;
  geometry.elementsNeedUpdate = true
}

const changeParam = function () {
  setCameraFov(param.camera);
  setLight(param.light);
  setP3(param.p3);
};

initThree();
initCamera();
initScene();
initLight();
initObject();
//坐标轴辅助
var axes = new THREE.AxesHelper(10000);
scene.add(axes);

function render () {
  stats.begin();
  changeParam();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  stats.end();
}
render();