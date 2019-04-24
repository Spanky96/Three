// 游戏
const THREE = require('three');
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
    this.render();
  }
  // 初始化游戏
  init() {
    this.startContainer.style.display = "block";
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true // to allow screenshot
    });
    renderer.setClearColor(0xbbbbbb, 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
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
    shadowLight.onlyShadow = true;
    shadowLight.shadowCameraNear = 2;
    shadowLight.shadowCameraFar = 200;
    shadowLight.shadowCameraLeft = -10;
    shadowLight.shadowCameraRight = 10;
    shadowLight.shadowCameraTop = 10;
    shadowLight.shadowCameraBottom = -10;
    shadowLight.shadowCameraVisible = false;
    shadowLight.shadowBias = 0;
    shadowLight.shadowDarkness = 0.5;
    shadowLight.shadowMapWidth = 512;
    shadowLight.shadowMapHeight = 512;
    scene.add(shadowLight);

    // 天空
    THREE.ImageUtils.loadTextureCube(
      ['/static/imgs/skybox/posx.jpg', '/static/imgs/skybox/negx.jpg', '/static/imgs/skybox/posy.jpg',
      '/static/imgs/skybox/negy.jpg', '/static/imgs/skybox/posz.jpg', '/static/imgs/skybox/negz.jpg'],
      THREE.CubeRefractionMapping, function(texture) {
        var shader = THREE.ShaderLib.cube;
        shader.uniforms['tCube'].texture = texture;
        shader.uniforms['tFlip'].texture = -1;
        var cubeMaterial = new THREE.ShaderMaterial({
          fragmentShader: shader.fragmentShader,
          vertexShader: shader.vertexShader,
          uniforms: shader.uniforms,
          depthWrite: false,
          side: THREE.DoubleSide
        });

        cubeMaterial.overdraw = true;
        var skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(5000, 5000, 5000), cubeMaterial);
        skyboxMesh.flipSided = true;
        skyboxMesh.castShadow = false;
        skyboxMesh.receiveShadow = false;
        scene.add(skyboxMesh);
      }
    );
    
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
