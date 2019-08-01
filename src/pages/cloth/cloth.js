const THREE = require('three');
const Stats = require('stats-js');
var OrbitControls = require('@src/utils/OrbitControls');

function togglePins() {
  // 
}

var clothFunction = function ( u, v, target ) {
  var x = ( u - 0.5 ) * 25 * 10;
  var y = ( v + 0.5 ) * 25 * 10;
  var z = 0;
  target.set( x, y, z );
};

// 微粒 x,y,z 质量
function Particle( x, y, z, mass ) {

	this.position = new THREE.Vector3();
	this.previous = new THREE.Vector3();
	this.original = new THREE.Vector3();
	this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
	this.mass = mass;
	this.invMass = 1 / mass;
	this.tmp = new THREE.Vector3();
	this.tmp2 = new THREE.Vector3();

	// init

	clothFunction( x, y, this.position ); // position
	clothFunction( x, y, this.previous ); // previous
	clothFunction( x, y, this.original );

}

// Force -> Acceleration

Particle.prototype.addForce = function ( force ) {

	this.a.add(
		this.tmp2.copy( force ).multiplyScalar( this.invMass )
	);

};

Particle.prototype.integrate = function ( timesq ) {
  var DAMPING = 0.03;
  var DRAG = 1 - DAMPING;
	var newPos = this.tmp.subVectors( this.position, this.previous );
	newPos.multiplyScalar( DRAG ).add( this.position );
	newPos.add( this.a.multiplyScalar( timesq ) );

	this.tmp = this.previous;
	this.previous = this.position;
	this.position = newPos;

	this.a.set( 0, 0, 0 );

};


var diff = new THREE.Vector3();
var tmpForce = new THREE.Vector3();
function satisfyConstraints( p1, p2, distance ) {
	diff.subVectors( p2.position, p1.position );
	var currentDist = diff.length();
	if ( currentDist === 0 ) return; // prevents division by 0
	var correction = diff.multiplyScalar( 1 - distance / currentDist );
	var correctionHalf = correction.multiplyScalar( 0.5 );
	p1.position.add( correctionHalf );
	p2.position.sub( correctionHalf );

}

function Cloth( w, h ) {
  var restDistance = 25;
  var MASS = 0.1;
	w = w || 10;
	h = h || 10;
	this.w = w;
	this.h = h;

	var particles = []; // 颗粒
	var constraints = []; // 限制

	var u, v;

	// Create particles
	for ( v = 0; v <= h; v ++ ) {

		for ( u = 0; u <= w; u ++ ) {

			particles.push(
				new Particle( u / w, v / h, 0, MASS )
			);

		}

	}

	// Structural

	for ( v = 0; v < h; v ++ ) {

		for ( u = 0; u < w; u ++ ) {

			constraints.push( [
				particles[ index( u, v ) ],
				particles[ index( u, v + 1 ) ],
				restDistance
			] );

			constraints.push( [
				particles[ index( u, v ) ],
				particles[ index( u + 1, v ) ],
				restDistance
			] );

		}

	}

	for ( u = w, v = 0; v < h; v ++ ) {

		constraints.push( [
			particles[ index( u, v ) ],
			particles[ index( u, v + 1 ) ],
			restDistance

		] );

	}

	for ( v = h, u = 0; u < w; u ++ ) {

		constraints.push( [
			particles[ index( u, v ) ],
			particles[ index( u + 1, v ) ],
			restDistance
		] );

	}

	this.particles = particles;
	this.constraints = constraints;

	function index( u, v ) {

		return u + v * ( w + 1 );

	}

	this.index = index;

}
var cloth = new Cloth(10, 10);

var container, stats;
var camera, scene, renderer;
var object;

// 风力
global.wind = false;
var windStrength = 2;
var windForce = new THREE.Vector3( 0, 0, 0 );
var clothGeometry;

// 重力
var gravity = new THREE.Vector3( 0, -981 , 0 ).multiplyScalar( 0.1 );
var lastTime = 0;

var TIMESTEP_SQ = Math.pow(18 / 1000, 2);
var ballPosition = new THREE.Vector3( 0, - 45, 0 );

var pinsFormation = [];
var pins = [ 6 ];

pinsFormation.push( pins );

pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
pinsFormation.push( pins );

pins = [ 0 ];
pinsFormation.push( pins );

pins = []; // cut the rope ;)
pinsFormation.push( pins );

pins = [ 0, cloth.w ]; // classic 2 pins
pinsFormation.push( pins );

pins = pinsFormation[ 1 ];


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
  clothGeometry = new THREE.ParametricBufferGeometry(clothFunction, 10, 10 );
  // cloth mesh
  object = new THREE.Mesh( clothGeometry, clothMaterial );
  object.customDepthMaterial = new THREE.MeshDepthMaterial( {
    depthPacking: THREE.RGBADepthPacking,
    map: clothTexture,
    alphaTest: 0.5
  } );
  object.position.set( 0, 0, 0 );
  object.castShadow = true;
  scene.add( object );

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
  var axesHelper = new THREE.AxesHelper(10000);
  scene.add(axesHelper);

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
  var time = Date.now();
  var windStrength = Math.cos( time / 7000 ) * 20 + 40;   // 风力大小 [-20, 60]
  windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) );
  windForce.normalize();
  windForce.multiplyScalar(windStrength);  // 风力向量
  simulate(time);

  render();
  stats.update();
}

function render() {
  var p = cloth.particles;
  for ( var i = 0, il = p.length; i < il; i ++ ) {

    var v = p[ i ].position;

    clothGeometry.attributes.position.setXYZ( i, v.x, v.y, v.z );

  }

  clothGeometry.attributes.position.needsUpdate = true;

  clothGeometry.computeVertexNormals();
  sphere.position.copy( ballPosition );
  renderer.render(scene, camera);
}

function simulate(time) {
  if (!lastTime) {
    lastTime = time;
    return;
  }
  var i, il, j, particles, particle, constraints, constraint;
  if ( wind ) {

		var indx;
		var normal = new THREE.Vector3();
		var indices = clothGeometry.index;
		var normals = clothGeometry.attributes.normal;

		particles = cloth.particles;

		for ( i = 0, il = indices.count; i < il; i += 3 ) {

			for ( j = 0; j < 3; j ++ ) {

				indx = indices.getX( i + j );
				normal.fromBufferAttribute( normals, indx )
				tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
				particles[ indx ].addForce( tmpForce );

			}

		}

  }
  for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

		particle = particles[ i ];
		particle.addForce( gravity );

		particle.integrate( TIMESTEP_SQ );

	}

	// Start Constraints

	constraints = cloth.constraints;
	il = constraints.length;

	for ( i = 0; i < il; i ++ ) {

		constraint = constraints[ i ];
		satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );

	}

  // Ball Constraints
  ballPosition.z = - Math.sin( Date.now() / 600 ) * 90; //+ 40;
  ballPosition.x = Math.cos( Date.now() / 400 ) * 70;

  if ( sphere.visible ) {

		for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

			particle = particles[ i ];
			var pos = particle.position;
			diff.subVectors( pos, ballPosition );
			if ( diff.length() < 60 ) {

				// collided
				diff.normalize().multiplyScalar( 60 );
				pos.copy( ballPosition ).add( diff );

			}

		}

  }

  // Floor Constraints

	for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

		particle = particles[ i ];
		pos = particle.position;
		if ( pos.y < - 250 ) {

			pos.y = - 250;

		}

	}

	// Pin Constraints

	for ( i = 0, il = pins.length; i < il; i ++ ) {

		var xy = pins[ i ];
		var p = particles[ xy ];
		p.position.copy( p.original );
		p.previous.copy( p.original );

	}

}

