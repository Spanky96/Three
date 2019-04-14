const THREE = require('three');
const SceneUtils = require('../../utils/SceneUtils');
const Stats = require('stats-js');
// const dat = require('dat.gui');

var container1, container2, container3, container4, stats;
var scene, renderer;

function init () {
  (() => {
    // stats
    var container = document.getElementsByClassName('container')[0];  
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "1030px";
    stats.domElement.style.top = "0";
    container.appendChild(stats.domElement);
  })();

  container1 = document.getElementById('container1');
  container2 = document.getElementById('container2');
  container3 = document.getElementById('container3');
  container4 = document.getElementById('container4');
  
  (() => {
    // initRenderer
    renderer1 = new THREE.WebGLRenderer({antialias: true});
    renderer1.setSize(500, 250);
    container1.append(renderer1.domElement);

    renderer2 = new THREE.WebGLRenderer({antialias: true});
    renderer2.setSize(500, 250);
    container2.append(renderer2.domElement);

    renderer3 = new THREE.WebGLRenderer({antialias: true});
    renderer3.setSize(500, 250);
    container3.append(renderer3.domElement);

    renderer4 = new THREE.WebGLRenderer({antialias: true});
    renderer4.setSize(500, 250);
    container4.append(renderer4.domElement);

  })();

  (() => {
    // initScene
    scene = new THREE.Scene();
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);
  })();

  (() => {
    // initCamera
    camera1 = new THREE.PerspectiveCamera(45, 500 / 250, 1, 10000);
    camera1.position.z = 1800;

    camera2 = new THREE.PerspectiveCamera(45, 500 / 250, 1, 10000);
    camera2.position.x = 1800;

    camera3 = new THREE.PerspectiveCamera(45, 500 / 250, 1, 10000);
    camera3.position.y = 1800;
    camera3.up.set(0, 0, -1);

    camera4 = new THREE.PerspectiveCamera(45, 500 / 250, 1, 10000);
    camera4.position.z = 800;
    camera4.position.x = 300;
  })();

  (() => {
    // 绘制平面阴影
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0.1, 'rgba(210, 210, 210, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    /*
    context.createRadialGradient(x0,y0,r0,x1,y1,r1);
    参数值
    参数	描述
    x0	渐变的开始圆的 x 坐标
    y0	渐变的开始圆的 y 坐标
    r0	开始圆的半径
    x1	渐变的结束圆的 x 坐标
    y1	渐变的结束圆的 y 坐标
    r1	结束圆的半径
    */

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    // document.getElementById('container5').append(canvas);
    
    // 平面阴影到scene
    var shadowTexture = new THREE.Texture(canvas);
    shadowTexture.needsUpdate = true;

    var shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture});
    var shadowGeo = new THREE.PlaneGeometry(300, 300, 1, 1);

    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.x = -400;
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
    
    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.x = 400;
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    var radius = 200;
    var geometry1 = new THREE.IcosahedronGeometry(radius, 1);
    var geometry2 = new THREE.IcosahedronGeometry(radius, 1);
    var geometry3 = new THREE.IcosahedronGeometry(radius, 1);

    var materials = [
      new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.vertexColors}),
      new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true})
    ];

    group1 = SceneUtils.createMultiMaterialObject(geometry1, materials);
    group1.position.x = -400;
    scene.add(group1);

    group2 = SceneUtils.createMultiMaterialObject(geometry2, materials);
    group2.position.x = 400;
    scene.add(group2);

    group3 = SceneUtils.createMultiMaterialObject(geometry3, materials);
    group3.position.x = 0;
    scene.add(group3);

    var axes = new THREE.AxisHelper(10000);
    scene.add(axes);
  })();
  
  animate();
}

function render () {
  camera1.lookAt(scene.position);
  camera2.lookAt(scene.position);
  camera3.lookAt(scene.position);
  camera4.lookAt(scene.position);
  renderer1.render(scene, camera1);
  renderer2.render(scene, camera2);
  renderer3.render(scene, camera3);
  renderer4.render(scene, camera4);
}

function animate () {
  render();
  stats.update();
  requestAnimationFrame(animate);
}

init();
window.onresize = function () {
};