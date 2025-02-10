import gsap from 'gsap';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

console.log(gsap);


// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x503070); // Black background

// Adding fog to the scene
scene.fog = new THREE.FogExp2(0x503070, 0.1);

// Create a camera
const camera = new THREE.PerspectiveCamera(
    85, 
   window.innerWidth / window.innerHeight, 
    1,
    100
);


// Select the existing canvas element
const canvas = document.querySelector('.WebGl');

// Create a renderer using the existing canvas
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true //Enable three.js background transparency
 });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Enable soft shadows



//write text
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/optimer_bold.typeface.json', (font) => {
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
  textMesh.position.set(0, 0, -50); // Adjust position as needed
  scene.add(textMesh);
});


// Create a sphere geometry
const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);

// Create a material for the sphere that supports lighting
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1509ff, // Grey color
    wireframe: true,
    roughness: 0.5,  // Controls the roughness of the material
    metalness: 1   // Controls the metalness of the material
});

// Create a mesh with the geometry and material
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(3, 1, 3);
sphere.castShadow = true; // Enable casting shadows
scene.add(sphere);




// Create a green box geometry
const boxGeometry = new THREE.BoxGeometry(40, 40, 0.5);

// Create a material for the box
const boxMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 1,  // Controls the roughness of the material
    metalness: 0   // Controls the metalness of the material
});

// Create a mesh with the geometry and material
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-2, 0.5, 0); // Position the box beside the sphere
box.rotation.set(0, 0, 0);
box.castShadow = false; // casting shadows
scene.add(box);

box.position.z = -10;
box.position.y = 0;


// Create a pyramid (using a cone with 4 sides)
const pyramidGeometry = new THREE.ConeGeometry(1.5, 3, 30); 

// Create a material for the pyramid
const pyramidMaterial = new THREE.MeshStandardMaterial({
    color: 0x653069,
    roughness: 2,
    metalness: 0.5
});

// Create a mesh with the geometry and material
const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
pyramid.position.set(0, 3, 3);
pyramid.rotation.set(0, 0, 1);
pyramid.castShadow = true;

// Add to scene
scene.add(pyramid);

// Add a plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1.5;
plane.receiveShadow = true; // Enable receiving shadows
scene.add(plane);

// Add a light source
const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000); // White light
pointLight.position.set(-10, 20, 5); // Position the light source
pointLight.castShadow = true; // Enable casting shadows
pointLight.shadow.bias = 0.9;
pointLight.shadow.mapSize.width = 1024; // Increase shadow map resolution
pointLight.shadow.mapSize.height = 1024; // Increase shadow map resolution
pointLight.shadow.radius = 25; // Set shadow blur radius
scene.add(pointLight);

// Add ambient light for softer shadows and more uniform lighting
const ambientLight = new THREE.AmbientLight(0x707070); // Soft white light
scene.add(ambientLight);

// Position the camera
camera.position.z = 10;


// Mouse move event listener
document.addEventListener('mousemove', onDocumentMouseMove, false);

let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 5 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 5 + 1;
}



// Animation loop
const clock = new THREE.Clock();

const animate = () => 
    {

  const time = clock.getElapsedTime();
  // Set the sphere's y position using the sine of the angle.
  // The value oscillates between -1 and 1.
  sphere.position.y = Math.sin(time)*(0.2);
  sphere.position.x = Math.cos(time);
  sphere.position.z = Math.cos(time)*2;

  pyramid.rotation.y = time;

    window.requestAnimationFrame(animate);

    // Smoothly interpolate camera position
    targetX = mouseX * 1; // Adjust multiplier to control the movement range
    targetY = mouseY * 1; // Adjust multiplier to control the movement range

    camera.position.x += (targetX - camera.position.x) * 0.1;
    camera.position.y += (targetY - camera.position.y) * 0.1;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
