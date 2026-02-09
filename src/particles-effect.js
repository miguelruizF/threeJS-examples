import * as THREE from "three";
import getLayer from "../asset/getLayer.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getParticleSystem } from "../public/getParticleSystem.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.querySelector('#app')?.appendChild(renderer.domElement);

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, -0.75, 0);
scene.add(cube);

const smokeEffect = getParticleSystem({
    camera,
    emitter: cube,
    parent: scene,
    rate: 10,
    // texture: '../asset/textures/smoke.png'
    texture: '../asset/textures/fire.png'
})

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

// Sprites BG
const gradientBackground = getLayer({
    hue: 0.5,
    numSprites: 8,
    opacity: 0.2,
    radius: 10,
    size: 24,
    z: -15.5,
});
scene.add(gradientBackground);

function animate() {
    requestAnimationFrame(animate);
    smokeEffect.update(0.016)
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    renderer.render(scene, camera);
    ctrls.update();
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);