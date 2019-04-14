// 画很多三角 BufferGeometry
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

  var triangles = 350000;
  
  var geometry = new THREE.BufferGeometry();
  
  var positions = new Float32Array(triangles * 3 * 3);
  
  // 这里是每个顶点一个法线， 也可以是每个面一个法线
  var normals = new Float32Array(triangles * 3 * 3);
  
  // 每个顶点一个颜色
  var colors = new Float32Array(triangles * 3 * 3);

  var color = new THREE.Color();

  var n = 600, n2 = n/2; // 立方体空间
  var d = 25, d2 = d/2; // 单个三角形大小

  // 三个顶点
  var pA = new THREE.Vector3();
  var pB = new THREE.Vector3();
  var pC = new THREE.Vector3();

  // 法线向量
  var cb = new THREE.Vector3();
  var ab = new THREE.Vector3();

  for (var i = 0; i < positions.length; i += 9) {
    // 位置
    var x = Math.random() * n - n2;
    var y = Math.random() * n - n2;
    var z = Math.random() * n - n2;

    var ax = x + Math.random() * d - d2;
    var ay = y + Math.random() * d - d2;
    var az = z + Math.random() * d - d2;

    var bx = x + Math.random() * d - d2;
    var by = y + Math.random() * d - d2;
    var bz = z + Math.random() * d - d2;

    var cx = x + Math.random() * d - d2;
    var cy = y + Math.random() * d - d2;
    var cz = z + Math.random() * d - d2;

    positions[  i  ] = ax;
    positions[i + 1] = ay;
    positions[i + 2] = az;
    positions[i + 3] = bx;
    positions[i + 4] = by;
    positions[i + 5] = bz;
    positions[i + 6] = cx;
    positions[i + 7] = cy;
    positions[i + 8] = cz;

    // 计算面的法向量
    pA.set(ax, ay, az);
    pB.set(bx, by, bz);
    pC.set(cx, cy, cz);

    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);
    cb.cross(ab);
    cb.normalize();

    var nx = cb.x;
    var ny = cb.y;
    var nz = cb.z;

    normals[  i  ] = nx;
    normals[i + 1] = ny;
    normals[i + 2] = ny;
    normals[i + 3] = nx;
    normals[i + 4] = ny;
    normals[i + 5] = nz;
    normals[i + 6] = nx;
    normals[i + 7] = ny;
    normals[i + 8] = nz;

    // 颜色
    var vx = (x / n) + 0.5;
    var vy = (y / n) + 0.5;
    var vz = (z / n) + 0.5;
    
    color.setRGB(vx, vy, vz);

    colors[   i   ] = color.r;
    colors[ i + 1 ] = color.g;
    colors[ i + 2 ] = color.b;
    colors[ i + 3 ] = color.r;
    colors[ i + 4 ] = color.g;
    colors[ i + 5 ] = color.b;
    colors[ i + 6 ] = color.r;
    colors[ i + 7 ] = color.g;
    colors[ i + 8 ] = color.b;
  }

  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

  geometry.computeBoundingSphere();

  var material = new THREE.MeshPhongMaterial(
    {
      color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
      side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    }
  );

  mesh = new THREE.Mesh(geometry, material);
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