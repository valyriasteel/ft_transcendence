// Scene setup
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create sphere geometry and apply material
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green for better visibility
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// Create a point light with shadows
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 10, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// Camera position
camera.position.z = 20;

// Renderer settings for shadows
renderer.shadowMap.enabled = true;

// Render loop
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
