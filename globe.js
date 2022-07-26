import * as THREE from 'https://cdn.skypack.dev/three';

const globeElement = document.getElementById('globe');
// mouse scroll
globeElement.addEventListener('wheel',mouseGlobeScroll);
globeElement.addEventListener('mousemove',mouseMoveGlobe);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 3;
camera.position.x = -1;
camera.position.y = 0.5;
const canvas = document.getElementById('globe');
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );

// window resize
window.addEventListener('resize', () => {
	let width = window.innerWidth;
	let height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
});

const loader = new THREE.TextureLoader();

// Globe
const geometry = new THREE.SphereGeometry(1,32,32);
const material = new THREE.MeshStandardMaterial( {map: loader.load('./assets/2k_earth_daymap.jpg'), bumpMap: loader.load('./assets/earthbump1k.jpg'), bumpScale: 0.025 ,roughness: 0.5, emissive: '#000005', emissiveIntensity: 0.5});
const sphere = new THREE.Mesh(geometry, material);
sphere.rotation.z = 0.25
scene.add(sphere);

// Atmosphere
const atmosGeometry = new THREE.SphereGeometry(1,32,32);
atmosGeometry.scale(1.5,1.5,1.5);
const atmosMat = new THREE.MeshBasicMaterial( {map: loader.load('./assets/2k_earth_clouds.jpg'), alphaMap: loader.load('./assets/2k_earth_clouds.jpg'), color: 0xffffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide});
const atmosphere = new THREE.Mesh(geometry, atmosMat);
atmosphere.scale.set(1.008,1.008,1.008);
scene.add(atmosphere);

// Stars
const vertices = [];
const NUM_STARS = 10000
for (let i = 0; i < NUM_STARS; i++) {
	const x = THREE.MathUtils.randFloatSpread(2000);
	const y = THREE.MathUtils.randFloatSpread(2000);
	const z = -THREE.MathUtils.randFloat(500, 10000);

	vertices.push(x,y,z);
}

const starGeom = new THREE.BufferGeometry();
starGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const starMat = new THREE.PointsMaterial({color: 0xffffff});
const stars = new THREE.Points(starGeom, starMat);

scene.add(stars);
// light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(-2,-0.9,3.8);
scene.add(directionalLight);

// Camera scroll
function mouseGlobeScroll(event) {
	const MOUSE_ROTATION = 0.0001
	sphere.rotation.y += event.deltaY * MOUSE_ROTATION;
	atmosphere.rotation.y += event.deltaY * MOUSE_ROTATION;
}
// mousemove
// globe follows the mouse
function mouseMoveGlobe(event) {
	const MOUSE_MOVE = 0.00005;
	sphere.rotation.y += event.movementX * MOUSE_MOVE;
	sphere.rotation.x += event.movementY * MOUSE_MOVE;
	atmosphere.rotation.y += event.movementX * MOUSE_MOVE;
	atmosphere.rotation.x += event.movementY * MOUSE_MOVE;
}

let yVal = -0.4;
let toggle = true;
let count = 0;
const EARTH_ROTATION = 0.1;
function animate() {
    requestAnimationFrame( animate );
	// for stopping earth spin
	if(toggle) {
		sphere.rotation.y += 0.0005;
		atmosphere.rotation.y += 0.00045;
		directionalLight.position.set( -1, yVal, 0.7);
		yVal = Math.sin(count);
		count += 0.001;
		if(count > 6.25) {
			count = 0;
		}
	}
    renderer.render( scene, camera );
}
animate();

