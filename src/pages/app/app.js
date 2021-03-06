var THREE = require('three');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor('#FFFFFF');
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CubeGeometry(2, 2, 2);
var material = new THREE.MeshBasicMaterial({color: 0x00ffff});
var cube = new THREE.Mesh(geometry, material);

scene.add(cube);
camera.position.z = 5;

//坐标轴辅助
var axes = new THREE.AxisHelper(100);
scene.add(axes)

function render () {
    requestAnimationFrame(render);
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
render();