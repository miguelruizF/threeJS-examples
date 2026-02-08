import * as THREE from 'three';
import getLayer from "../asset/getLayer.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfield from '../asset/getStartfield.js';
import GeoJsonGeometry from 'three-geojson-geometry';
import { LineSegments, LineBasicMaterial } from 'three';


const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.2);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.querySelector('#app')?.appendChild(renderer.domElement);

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

const geometry = new THREE.SphereGeometry(2);
const lineMat = new THREE.LineBasicMaterial( { 
    color: 0xffffff,
    transparent: true,
    opacity: 0.25
} );
const edges = new THREE.EdgesGeometry(geometry, 1);
const line = new THREE.LineSegments( edges, lineMat );
scene.add( line );

async function loadCountries() {
  // Recomendado: poner el .geojson en `public/` y usar '/countries.geojson'
    const res = await fetch('/countries.geojson');
    const world = await res.json();

    const mat = new LineBasicMaterial({ 
        color: 0xffffff, 
        opacity: 1, 
        transparent: true,
        linewidth: 2,
        fog: true
    });
    const radius = 2;    // igual que tu SphereGeometry(2)
    const resolution = 1; // grados; baja = más detaile, alto = menos vertices

    world.features.forEach(feature => {
    const geom = new GeoJsonGeometry(feature.geometry, radius, resolution);
    const lines = new LineSegments(geom, mat);
    scene.add(lines);
    });
}
loadCountries();


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
const stars = getStarfield({ numStars: 1000 });
scene.add(stars);

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