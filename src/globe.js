import * as THREE from 'three';
import getLayer from "../asset/getLayer.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

const textureLoad = new THREE.TextureLoader();
// const textureMaterial = textureLoad.load('../asset/textures/bricks.jpg');
/* const textureMaterial = textureLoad.load('../asset/textures/colors.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8,1);
}); */

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { 
    color: 0x00ff00, 
} );

const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1);
keyLight.position.set(-2, 2, 2);
scene.add(keyLight); 

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


camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render( scene, camera );
    ctrls.update();
}
//renderer.setAnimationLoop( animate );
animate()

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);