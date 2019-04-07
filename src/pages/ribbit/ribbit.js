// 画一条线
const THREE = require('three');
require('three-ply-loader')(THREE);
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
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
  camera.position.x = 0.2;
  camera.position.y = 0.2;
  camera.position.z = 0.5;

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
  light = new THREE.DirectionalLight(0x00ffff, 1.0); // 平行光
  light.position.set(100, 100, 20);
  scene.add(light);
};
var mesh;
const initObject = function () {
  var material =new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.FrontSide});
  var loader = new THREE.PLYLoader();
  loader.load('/static/models/bunny.ply', function (geometry) {
    geometry.computeVertexNormals();
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -0.09;
    scene.add(mesh);
  })
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
  //mesh && (mesh.rotateY(0.1));
  renderer.render(scene, camera);
  stats.end();
}
render();