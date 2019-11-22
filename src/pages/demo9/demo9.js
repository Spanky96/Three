// 粒子系统
const THREE = require('three');
const JSONLoader = require('../../utils/JSONLoader');
const BinaryLoader = require('../../utils/BinaryLoader');
var SCREEN_HEIGHT = window.innerHeight;
var SCREEN_WIDTH = window.innerWidth;
var container;
var camera, scene, renderer;
var aloader, bloader;
var clock = new THREE.Clock();
var meshes = [];
var clonedGeo = [];
init();
animate();
var parent;

function init() {
  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 20, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 50000 );
  camera.position.set(100, 700, 5000 );

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );

  camera.lookAt( scene.position );

  aloader = new JSONLoader();
  parent = new THREE.Object3D();
  scene.add(parent);
  aloader.load( "/static/42/terrain.js", function( geometry ) {
    // 地形
    var mesh = createMesh(geometry, 'yellow', 1, [0, 0, 0], [30, 0.1, 100], false);
    mesh.rotation.x = Math.PI / 2;
    parent.add(mesh);
  });

  bloader = new BinaryLoader();
  // 汽车
  bloader.load( "/static/42/veyron/VeyronNoUv_bin.js", function( geometry ) {
    var mesh = createMesh(geometry, 0x00ff00, 1, [1000, 0, -3000], [5, 5, 5], false);
    mesh.rotation.y = 0.5;
    parent.add(mesh);
  });

  bloader.load( "/static/42/female02/Female02_bin.js", function( geometry ) {
    // 女人
    parent.add(createMesh(geometry, 0x00ffff, 1, [300, 0, 0], [3, 3, 3], true));
    parent.add(createMesh(geometry, Math.random() * 0xffffff, 1, [2000 * (0.5 - Math.random()), 10 * (0.5 - Math.random()), 2000 * (0.5 - Math.random())], [3, 3, 3], true));
    parent.add(createMesh(geometry, Math.random() * 0xffffff, 1, [2000 * (0.5 - Math.random()), 10 * (0.5 - Math.random()), 2000 * (0.5 - Math.random())], [3, 3, 3], true));
  });

  bloader.load( "/static/42/male02/Male02_bin.js", function( geometry ) {
    //男人
    var mesh = createMesh(geometry, 0xffff00, 1, [-300, 0, 0], [3, 3, 3], true);
    parent.add(mesh);
    parent.add(createMesh(geometry, Math.random() * 0xffffff, 1, [2000 * (0.5 - Math.random()), 10 * (0.5 - Math.random()), 2000 * (0.5 - Math.random())], [3, 3, 3], 12));
    parent.add(createMesh(geometry, Math.random() * 0xffffff, 1, [2000 * (0.5 - Math.random()), 10 * (0.5 - Math.random()), 2000 * (0.5 - Math.random())], [3, 3, 3], 12));
  });

  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  renderer.autoClear = false;
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );
}
function createMesh(geometry, color, size, position, scale, dynamic) {
  var material = new THREE.PointsMaterial({color: color, size: 10});
  var mesh = new THREE.Points(geometry, material);
  mesh.scale.x = scale[0];
  mesh.scale.z = scale[1];
  mesh.scale.y = scale[2];
  mesh.position.x = position[0];
  mesh.position.y = position[1];
  mesh.position.z = position[2];
  if (dynamic) {
    meshes.push(geometry);
    var vertices = geometry.vertices;
    var geo = new THREE.Geometry();
    for ( i = 0; i < vertices.length; i ++ ) {
      var p = vertices[ i ];
      geo.vertices[ i ] = p.clone();
    }
    clonedGeo.push({
      geometry: geo,
      waiting: 10,
      method: 1,
      speed: isNaN(parseInt(dynamic)) ? 10 : dynamic,
      wait: 30,
      methodCompleted: false
    });
  }
  return mesh;
}
function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.clear();
  var delta = 10 * clock.getDelta();
  delta = delta < 2 ? delta : 2;
  for (var i = 0; i < clonedGeo.length; i++) {
    if (clonedGeo[i].waiting > 0) {
      clonedGeo[i].waiting -= delta;
      continue;
    }
    var vertices = meshes[i].vertices;
    var speed = clonedGeo[i].speed;
    var wait = clonedGeo[i].wait;
    clonedGeo[i].methodCompleted = true;
    if (clonedGeo[i].method == 1) {
      for (var j = 0; j < vertices.length; j++) {
        var p = vertices[j];
        if (p.y > 0) {
          clonedGeo[i].methodCompleted = false;
          p.x += (0.5 -Math.random()) * delta * speed;
          p.z += (0.5 -Math.random()) * delta * speed;
          p.y += (0.15 -Math.random()) * delta * speed;
        } else {
          p.y = 0;
        }
      }
      if (clonedGeo[i].methodCompleted) {
        clonedGeo[i].waiting = wait;
        clonedGeo[i].method = 2;
      }
    } else if (clonedGeo[i].method == 2) {
      for (var j = 0; j < vertices.length; j++) {
        var p = vertices[j];
        var target = clonedGeo[i].geometry.vertices[j]; // 目标位置
        if (Math.abs(p.x - target.x) +  Math.abs(p.y - target.y) + Math.abs(p.z - target.z) > 5) {
          clonedGeo[i].methodCompleted = false;
          p.x += (((target.x - p.x) > 0) ? 1 : -1) * (Math.random() - 0.15) *  delta * speed;
          p.y += (((target.y - p.y) > 0) ? 1 : -1) * (Math.random() - 0.15) *  delta * speed;
          p.z += (((target.z - p.z) > 0) ? 1 : -1) * (Math.random() - 0.15) *  delta * speed;
        } else {
          p.x = target.x;
          p.y = target.y;
          p.z = target.z;
        }
      }
      if (clonedGeo[i].methodCompleted) {
        clonedGeo[i].waiting = wait;
        clonedGeo[i].method = 1;
      }
    }
    meshes[i].verticesNeedUpdate = true;
    
  }
  parent.rotation.y += 0.01;
  renderer.render(scene, camera);
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}