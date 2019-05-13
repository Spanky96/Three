const THREE = require('three');
const Stats = require('stats-js');
var OrbitControls = require('@src/utils/OrbitControls');

function togglePins() {
    //
}

var restDistance = 25;
var xSegs = 10;
var ySegs = 10;
var clothFunction = plane( restDistance * xSegs, restDistance * ySegs );
function plane( width, height ) {
	return function ( u, v, target ) {
		var x = ( u - 0.5 ) * width;
		var y = ( v + 0.5 ) * height;
		var z = 0;
		target.set( x, y, z );
	};
}
var container, stats;
var camera, scene, renderer;
var object;
init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  // scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcce0ff);
  scene.fog = new THREE.Fog(0xcce0ff, 500, 10000); // 500以内无雾色 >10000是纯雾色

  // camera

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(1000, 50, 1500);

  // lights
  // 环境光会均匀的照亮场景中的所有物体。 环境光不能用来投射阴影，因为它没有方向。
  scene.add(new THREE.AmbientLight(0x666666)); // 灰色

  var light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);

  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  var d = 300;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.far = 1000;

  scene.add(light);

  var loader = new THREE.TextureLoader();
  // cloth material
  var clothTexture = loader.load(require('./circuit_pattern.png'));
  clothTexture.anisotropy = 16; // 更清晰 默认值为1
  var clothMaterial = new THREE.MeshLambertMaterial({ // 一种非光泽表面的材质，没有镜面高光。
    map: clothTexture,
    side: THREE.DoubleSide,
    alphaTest: 0.5 // 设置运行alphaTest时要使用的alpha值。如果不透明度低于此值，则不会渲染材质。默认值为0。
  });
  var clothGeometry = new THREE.ParametricBufferGeometry(clothFunction, 10, 10 );
  // cloth mesh
  object = new THREE.Mesh( clothGeometry, clothMaterial );
  object.position.set( 0, 0, 0 );
  object.castShadow = true;
  scene.add( object );

  object.customDepthMaterial = new THREE.MeshDepthMaterial( {
    depthPacking: THREE.RGBADepthPacking,
    map: clothTexture,
    alphaTest: 0.5
  } );

  // sphere 球
  // 球缓冲几何体 半径 水平分段数字 垂直分段数
  var ballGeo = new THREE.SphereBufferGeometry(60, 32, 16);
  var ballMaterial = new THREE.MeshLambertMaterial();
  var sphere = new THREE.Mesh(ballGeo, ballMaterial);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  global.sphere = sphere;
  scene.add(sphere);


  // ground
  var groundTexture = loader.load(require('./grasslight-big.jpg'));
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(25, 25);
  groundTexture.anisotropy = 16; // /docs/#api/zh/textures/Texture
  var groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
  var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
  mesh.position.y = -250;
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // poles 杆子
  // 左
  var poleGeo = new THREE.BoxBufferGeometry(5, 375, 5); // x,y,z
  var poleMat = new THREE.MeshLambertMaterial();
  var poleMesh = new THREE.Mesh(poleGeo, poleMat);
  poleMesh.position.x = -125;
  poleMesh.position.y = -62;
  poleMesh.receiveShadow = true;
  poleMesh.castShadow = true;
  scene.add(poleMesh);

  // 右
  poleMesh = new THREE.Mesh(poleGeo, poleMat);
  poleMesh.position.x = 125;
  poleMesh.position.y = -62;
  poleMesh.receiveShadow = true;
  poleMesh.castShadow = true;
  scene.add(poleMesh);

  // 上
  poleMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(255, 5, 5), poleMat);
  poleMesh.position.x = 0;
  poleMesh.position.y = -250 + ( 750 / 2);
  poleMesh.receiveShadow = true;
  poleMesh.castShadow = true;
  scene.add(poleMesh);

  // 左脚
  var gg = new THREE.BoxBufferGeometry( 10, 10, 10 );
  poleMesh = new THREE.Mesh( gg, poleMat );
  poleMesh.position.y = - 250;
  poleMesh.position.x = 125;
  poleMesh.receiveShadow = true;
  poleMesh.castShadow = true;
  scene.add( poleMesh );

  // 右脚
  poleMesh = new THREE.Mesh( gg, poleMat );
  poleMesh.position.y = - 250;
  poleMesh.position.x = - 125;
  poleMesh.receiveShadow = true;
  poleMesh.castShadow = true;
  scene.add( poleMesh );

  // renderer

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMap.enabled = true;

  // controls
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5; // 最大仰视角 90度
  controls.minDistance = 1000;
  controls.maxDistance = 5000;

  // helper
  // var axesHelper = new THREE.AxesHelper(10000);
  // scene.add(axesHelper);

  // performance monitor

  stats = new Stats();
  container.appendChild(stats.dom);

  //
  sphere.visible = ! true;

  window.addEventListener('resize', onWindowResize, false);

}

//

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
