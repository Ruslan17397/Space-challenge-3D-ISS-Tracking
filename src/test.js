import './style.css'
import * as THREE from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
import { earthRadius } from "satellite.js/lib/constants";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/OBJLoader'

import * as satellite from 'satellite.js/lib/index';
// const loader = new GLTFLoader();
//TLE ISS
const toThree = (v) => {
    return { x: v.x, y: v.z, z: -v.y };
}
const group = new THREE.Group();
const ISS = {
    line1: "1 25544U 98067A   22270.90703402  .00010643  00000-0  19197-3 0  9992",
    line2: "2 25544  51.6442 187.6695 0002438 302.1381 175.4033 15.50331817361110"
}
let satrec = satellite.twoline2satrec(ISS.line1, ISS.line2);
let getPositionISS = ()=>{
    let posVelocity = satellite.propagate(satrec, new Date())
const gmst = satellite.gstime(new Date());
const positionEcf = satellite.eciToEcf(posVelocity.position, gmst);
return toThree(positionEcf);
}
const geometry = new THREE.SphereGeometry( 100, 50, 50 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sat = new THREE.Mesh( geometry, material );
let posISS = getPositionISS();
sat.position.set(posISS.x, posISS.y, posISS.z);

// Scene
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//camera
const camera = new THREE.PerspectiveCamera( 54, sizes.width / sizes.height, 0.2, 1e27 );
camera.position.z = -15000;
camera.position.x = 15000;
camera.lookAt(0, 0, 0);



const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)

renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 50, 50), new THREE.ShaderMaterial({
   vertexShader,
   fragmentShader,
   uniforms: {
    globeTexture: {
        value: new THREE.TextureLoader().load('./img/uv.jpg')
    }
   }
})
)


//atmosphere
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 50, 50), new THREE.ShaderMaterial({
vertexShader:atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
})
)
 atmosphere.scale.set(1.1,1.1,1.1)
// loader.load( './models/ISS_stationary.glb', function ( gltf ) {

//     scene.add( gltf.scene );

// }, undefined, function ( error ) {

//     console.error( error );

// } );
scene.add(atmosphere)
group.add(sat);
group.add(sphere);  
scene.add(group)
// camera.position.z = 15

const tick = () =>
{
    requestAnimationFrame(tick)
    let posISS = getPositionISS();
    console.log(posISS)
sat.position.set(posISS.x, posISS.y, posISS.z);

    renderer.render(scene, camera)
}

tick()