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
  camera.position.x = 500;
  camera.position.y = 500;
  camera.position.z = 1000;

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
  light = new THREE.PointLight(0xffffff, 1, 500, 0.5);
  // light = new THREE.DirectionalLight(0xffffff, param.intensity);
  light.position.set(param.x, param.y, param.z);
  var f = gui.addFolder('光');
  f.add(param.light, 'x', -200, 200).name('位置：X');
  f.add(param.light, 'y', -200, 200).name('位置：Y');
  f.add(param.light, 'z', -200, 200).name('位置：Z');
  f.add(param.light, 'intensity', 0, 1).name('强度');
  f.addColor(param.light, 'color').name('颜色');
  scene.add(light);
};
var texture;
const initObject = function () {
  var geometry = new THREE.Geometry();
  var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, wireframe: true});
  var p1 = new THREE.Vector3(100, 0, 0);
  var p2 = new THREE.Vector3(-100, 0, 0);
  var p3 = new THREE.Vector3(0, 100, 0);
  var color1 = new THREE.Color(0xFF0000);
  var color2 = new THREE.Color(0x00FF00);
  var color3 = new THREE.Color(0x0000FF);

  geometry.vertices.push(p1, p2, p3);
  geometry.colors.push(color1, color2, color3);
  var face = new THREE.Face3(0, 1, 2);
  face.vertexColors.push(color1, color2, color3);

  geometry.faces.push(face);
  var mesh = new THREE.Mesh(geometry, material);
  console.log(geometry);
  scene.add(mesh);
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

const changeParam = function () {
  setCameraFov(param.camera);
  setLight(param.light);
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