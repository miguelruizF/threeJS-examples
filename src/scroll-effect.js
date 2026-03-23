import * as THREE from "three";
import getLayer from "../asset/getLayer.js";
import getStarfield from "../asset/getStartfield.js"
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { getParticleSystem } from "../public/getParticleSystem.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(w, h);
// document.querySelector('#app')?.appendChild(renderer.domElement);

/* const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true; */
let scrollPosY = 0;
function initScene({ geo }) {
    // const geometry = new THREE.BoxGeometry();
    const geometry = geo;
    geometry.center();
    const texLoader = new THREE.TextureLoader();
    const material = new THREE.MeshMatcapMaterial({
        matcap: texLoader.load('../asset/textures/blue.jpg')
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(1.5, -0.5, 0);
    scene.add(mesh);

    /* const smokeEffect = getParticleSystem({
        camera,
        emitter: cube,
        parent: scene,
        rate: 10,
        // texture: '../asset/textures/smoke.png'
        //texture: '../asset/textures/fire.png'
    }); */

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
    // scene.add(gradientBackground);

    const stars = getStarfield({ numStars: 4500 });
    scene.add(stars);

    let goalPos = 0;
    const rate = 0.1;
    function animate() {
        requestAnimationFrame(animate);
        // smokeEffect.update(0.016);
        /*  cube.rotation.x += 0.01;
        cube.rotation.y += 0.02; */
        goalPos = Math.PI * scrollPosY;
        mesh.rotation.y -= (mesh.rotation.y - (goalPos * 1.0)) * rate;
        stars.position.z -= (stars.position.z - goalPos * 8) * rate;
        // mesh.rotation.y = goalPos;
        // stars.position.z = goalPos * 10;
        renderer.render(scene, camera);
        // ctrls.update();
    }
    animate();
}

const manager = new THREE.LoadingManager();
const loader = new OBJLoader(manager);
let sceneData = {};
manager.onLoad = () => initScene(sceneData);
loader.load("../asset/astronaut.obj", (object) => {
    let geometry;
    object.traverse((child) => {
        if (child.type === "Mesh") {
        geometry = child.geometry;
        }
    });
    sceneData.geo = geometry;
});

window.addEventListener("scroll", () => {
    scrollPosY = window.scrollY / document.body.clientHeight;
  // cube.position.z = scrollPosY * 5;
});

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
