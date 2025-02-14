import gsap from 'gsap';
import * as dat from 'dat.gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

console.log(gsap);

// =================================================
// SCENE, CAMERA, AND RENDERER SETUP
// =================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x503070);
scene.fog = new THREE.FogExp2(0x503070, 0.1);

const camera = new THREE.PerspectiveCamera(
  85,
  window.innerWidth / window.innerHeight,
  1,
  100
);
camera.position.z = 10;

const canvas = document.querySelector('.WebGl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true // Enable background transparency
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// =================================================
// FONT & TEXT SETUP
// =================================================

const fontLoader = new FontLoader();
fontLoader.load(
  'https://threejs.org/examples/fonts/optimer_bold.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry('XR', {
      font: font,
      size: 5,
      height: 0.0001,
      curveSegments: 12,
      bevelEnabled: false,
      wireframe: true
    });
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 0, -50);
    scene.add(textMesh);
  }
);

// =================================================
// OBJECTS
// =================================================

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x1509ff,
  wireframe: true,
  roughness: 0.5,
  metalness: 1
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(3, 1, 3);
sphere.castShadow = true;
scene.add(sphere);

// Box
const boxGeometry = new THREE.BoxGeometry(40, 40, 0.5);
const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1,
  metalness: 0
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-2, 0.5, 0);
box.rotation.set(0, 0, 0);
box.castShadow = false;
scene.add(box);
box.position.z = -10;
box.position.y = 0;

// Pyramid
const pyramidGeometry = new THREE.ConeGeometry(1.5, 3, 30);
const pyramidMaterial = new THREE.MeshStandardMaterial({
  color: 0x653069,
  roughness: 2,
  metalness: 0.5
});
const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
pyramid.position.set(0, 3, 3);
pyramid.rotation.set(0, 0, 1);
pyramid.castShadow = true;
scene.add(pyramid);

// Plane (for shadows)
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1.5;
plane.receiveShadow = true;
scene.add(plane);

// =================================================
// LIGHTING
// =================================================

const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);
pointLight.position.set(-10, 20, 5);
pointLight.castShadow = true;
pointLight.shadow.bias = 0.9;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.radius = 25;
scene.add(pointLight);

const ambientLightObj = new THREE.AmbientLight(0x707070);
scene.add(ambientLightObj);

// =================================================
// MOUSE MOVEMENT FOR CAMERA INTERPOLATION
// =================================================

document.addEventListener('mousemove', onDocumentMouseMove, false);
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
function onDocumentMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 5 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 5 + 1;
}

// =================================================
// DAT.GUI SETUP WITH FOLDERS
// =================================================

// Create a parameters object for controls
const parameters = {
  color: 0xffffff,
  metalness: sphereMaterial.metalness,
  rotatePyramid: true
};

const gui = new dat.GUI();

// --- Sphere Controls Folder ---
const sphereFolder = gui.addFolder('Sphere Controls');
sphereFolder.addColor(parameters, 'color')
  .name('Color')
  .onChange((value) => {
    sphereMaterial.color.set(value);
  });
sphereFolder.add(parameters, 'metalness', 0, 1)
  .name('Metalness')
  .onChange((value) => {
    sphereMaterial.metalness = value;
  });
sphereFolder.add(sphereMaterial, 'wireframe')
  .name('Wireframe');
sphereFolder.open();

// --- Pyramid Controls Folder ---
const pyramidFolder = gui.addFolder('Pyramid Controls');
pyramidFolder.add(pyramid.position, 'x', -10, 10, 0.001)
  .name('X-Axis');
pyramidFolder.add(pyramid, 'visible')
  .name('Visible');
pyramidFolder.add(parameters, 'rotatePyramid')
  .name('Rotate Pyramid');
pyramidFolder.open();

// =================================================
// ANIMATION LOOP
// =================================================

const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  // Animate sphere
  sphere.position.y = Math.sin(time) * 0.2;
  sphere.position.x = Math.cos(time);
  sphere.position.z = Math.cos(time) * 2;

  // Conditionally rotate pyramid based on dat.GUI toggle
  if (parameters.rotatePyramid) {
    pyramid.rotation.y = time;
  }

  // Smoothly interpolate camera position based on mouse
  targetX = mouseX;
  targetY = mouseY;
  camera.position.x += (targetX - camera.position.x) * 0.1;
  camera.position.y += (targetY - camera.position.y) * 0.1;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
};

animate();

// =================================================
// WINDOW RESIZE HANDLER
// =================================================

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
