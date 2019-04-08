// 画一条线
const THREE = require('three');
require('three-ply-loader')(THREE);
const Stats = require('stats-js');
// const dat = require('dat.gui');

var container, stats;
var camera, scene, renderer;
var mesh;

init();
animate();

function init () {
  container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 3500);
  camera.position.z = 2750;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050505, 2000, 3500);

  scene.add( new THREE.AmbientLight(0xffffff));

  var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.set(0, -1, 0);
  scene.add(light2);

  var particles = 3 * 100000;
  
  var geometry = new THREE.BufferGeometry();
  
  var positions = new Float32Array(particles * 3);

  var colors = new Float32Array(particles * 3);

  var color = new THREE.Color();

  var n = 800, n2 = n/2; // 立方体空间

  for (var i = 0; i < positions.length; i += 3) {
    // 位置
    var x = Math.random() * n - n2;
    var y = Math.random() * n - n2;
    var z = Math.random() * n - n2;

    positions[  i  ] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;

    // 颜色
    var vx = (x / n) + 0.5;
    var vy = (y / n) + 0.5;
    var vz = (z / n) + 0.5;
    
    color.setRGB(vx, vy, vz);

    colors[   i   ] = color.r;
    colors[ i + 1 ] = color.g;
    colors[ i + 2 ] = color.b;
  }

  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

  geometry.computeBoundingSphere();

  var material = new THREE.PointsMaterial(
    {
      size: 1, vertexColors: THREE.VertexColors
    }
  );

  mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({
    antialias: false // 弱锯齿 降低锯齿感 占更大性能
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(scene.fog.color);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  container.appendChild(renderer.domElement);
  
  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0";
  stats.domElement.style.top = "0";
  container.appendChild(stats.domElement);
}

function animate () {
  stats.begin();
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.01;
  mesh.rotation.z += 0.01;
  renderer.render(scene, camera);
  stats.end();
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};