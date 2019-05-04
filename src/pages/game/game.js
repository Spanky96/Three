// 游戏
const THREE = require('three');
const dat = require('dat.gui');
var gui = new dat.GUI();
var ColladaLoader = require('@src/utils/ColladaLoader');
var param = {
  rotation: {
    x: -1.5707963267948963,
    y: 0,
    z: 0
  }
};

class Game {
  constructor(container, start, win, loose) {
    this.container = document.getElementById(container);
    this.startContainer = document.getElementById(start);
    this.winContainer = document.getElementById(win);
    this.looseContainer = document.getElementById(loose);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  };

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.changeParam();
    this.render();
  }
  changeParam() {
    var vm = this;
    if (vm.tuxScene) {
      vm.tuxScene.rotation.x = param.rotation.x;
      vm.tuxScene.rotation.y = param.rotation.y;
      vm.tuxScene.rotation.z = param.rotation.z;
    }
  }
  // 初始化游戏
  init() {
    var vm = this;
    this.startContainer.style.display = "block";
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true // to allow screenshot
    });
    renderer.setClearColor(0xbbbbbb, 1);
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer = renderer;
    this.container.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    this.scene  = scene;

    var camera = new THREE.PerspectiveCamera(35, window.innerWidth/ window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 5);
    camera.updateMatrix();
    scene.add(camera);
    this.camera = camera;

    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xff6600, 1, 50);
    scene.add(pointLight);

    var spotLight = new THREE.SpotLight(0xaaaaaa, 2, 0, Math.PI / 4, 1);
    spotLight.position.set(0, 0, -1);
    spotLight.castShadow = false;
    scene.add(spotLight);

    var shadowLight = new THREE.DirectionalLight(0xaaaaaa, 4, 1);
    shadowLight.position.set(0, 0, -1);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.near = 2;
    shadowLight.shadow.camera.far = 200;
    shadowLight.shadow.camera.left = -10;
    shadowLight.shadow.camera.right = 10;
    shadowLight.shadow.camera.top = 10;
    shadowLight.shadow.camera.bottom = -10;
    shadowLight.shadow.bias = 0;
    shadowLight.shadow.mapSize.width = 512;
    shadowLight.shadow.mapSize.height = 512;
    scene.add(shadowLight);

    // 飞机模型
    var colladaLoader = new ColladaLoader();
    colladaLoader.load('/static/tux/tux.dae', function colladaReady(collada) {
      var tuxScene = collada.scene;
      tuxScene.scale.x = tuxScene.scale.y = tuxScene.scale.z = 1;
      tuxScene.updateMatrix();
      spotLight.target = tuxScene;
      shadowLight.target = tuxScene;
      tuxScene.children[0].castShadow = true;
      tuxScene.children[0].receiveShadow = true;
      scene.add(tuxScene);
      vm.tuxScene = tuxScene;
      var f = gui.addFolder('飞机');
      f.add(param.rotation, 'x', -Math.PI, Math.PI).name('旋转X');
    });

    // 背景
    var loader = new THREE.CubeTextureLoader();
    var textureCube = loader.load( [
      '/static/imgs/skybox/posx.jpg', '/static/imgs/skybox/negx.jpg', '/static/imgs/skybox/posy.jpg',
      '/static/imgs/skybox/negy.jpg', '/static/imgs/skybox/posz.jpg', '/static/imgs/skybox/negz.jpg'
    ] );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, side: THREE.DoubleSide } );
    var skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(5000, 5000, 5000), material);
    scene.add(skyboxMesh);

    var vm = this;
    window.onresize = function () {
      vm.camera.aspect = window.innerWidth / window.innerHeight;
      vm.camera.updateProjectionMatrix();
      vm.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    this.animate();
  }

  // 开始游戏
  start() {
    this.startContainer.style.display = "none";
  }

  // 重新开始
  restart() {
    this.winContainer.style.display = "none";
    this.looseContainer.style.display = "none";
  }

  win() {
    this.winContainer.style.display = "block";
  }
  fail() {
    this.looseContainer.style.display = "block";
  }
}

global.game = new Game('container', 'start', 'win', 'loose');
game.init();
// game.start();
