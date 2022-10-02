import * as THREE from 'three'
import * as locCountry from 'which-country'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import * as satellite from 'satellite.js/lib/index';
import { earthRadius } from "satellite.js/lib/constants";

import {Locator} from './locator.js';

import {MapEngine} from './MapEngine.js';
import {VisualizeData} from './VisualizeData.js';

import ctrNames from './json/slim-3.json';

export class SatelliteEngine{

constructor(TLE){
	this.satrec = satellite.twoline2satrec(TLE.line1, TLE.line2);
	this.group = new THREE.Group();
	this.sizes = {width: window.innerWidth, height: window.innerHeight}
	this.minutesPerDay = 120;
	this.locator = new Locator();
	this.gltf = new GLTFLoader();
	this.visualizeData = new VisualizeData(['.lat','.lng','.ctrName','.nowTime','.overTime']);
	this.date = new Date()
	const mapPos = this.getPosLatLong(this.date);
	this.map = new MapEngine({lat:this.locator.rad2deg(mapPos.latitude),lng:this.locator.rad2deg(mapPos.longitude)});
	this.trig = true;
	this.lastCountry = "Water";

}
_init(){
	this.scene = new THREE.Scene()
	this.addRender();
	this.createSatellite(()=>{


			this.createCamera();
	this.createSkyBox();
	this.createEarth();
	this.createAtmosphere();
	
	this.drawOrbit();

	this.overUser();
	this.scene.add(this.group);

	let ambientLight = new THREE.AmbientLight(0xffffff, 2);
  this.scene.add(ambientLight);
	this.tick();



	});







}
calcCrow(lat1, lon1, lat2, lon2) 
    {
      var dLat = this.locator.deg2rad(lat2-lat1);
      var dLon = this.locator.deg2rad(lon2-lon1);
      var lat1 = this.locator.deg2rad(lat1);
      var lat2 = this.locator.deg2rad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = earthRadius * c;
      return d;
    }
overUser(){
	let time;
this.locator.getPosition((position)=>{
 let points = this.countOrgit(1,7 * 1440);
 	// console.log(position)
 for(let i = 0; i < points.length; ++i){
 	let el = points[i];
if(this.calcCrow(position.latitude,position.longitude,el.lat,el.lng) < 100){
	console.log("ISSSGOOOD")
	time = i+1;
	let dotPos = {
    longitude: this.locator.deg2rad(el.lng),
    latitude: this.locator.deg2rad(el.lat),
    height: 0
};
	break;

}

 	 }
let formattedTime;
 	 if(time){ 
 	 let toView = new Date(time * 60000);
 	 formattedTime = `${toView.getDay()}d ${toView.getHours()}h ${toView.getMinutes()}m`;
 	}else{
 		formattedTime = "more than one week"
 	}
 	 this.visualizeData.setOverTime(formattedTime)


let observerGd = {
    longitude: this.locator.deg2rad(position.longitude),
    latitude: this.locator.deg2rad(position.latitude),
    height: 0
};
		let userLocation = this.toThree(satellite.geodeticToEcf(observerGd))

		this.user = new THREE.Mesh( new THREE.SphereGeometry( 40, 50, 50 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) );
	this.user.position.set(userLocation.x,userLocation.y,userLocation.z);
	this.scene.add(this.user)


	})

}
toThree(v){
    return { x: v.x, y: v.z, z: -v.y };
}
setSizes(w,h){
	this.sizes = {width: w, height: h}
}

getPositionISS(date){
	let posVelocity = satellite.propagate(this.satrec, date)
	this.gmst = satellite.gstime(date);
	const positionEcf = satellite.eciToEcf(posVelocity.position, this.gmst);

	return this.toThree(positionEcf);
}
addRender(){
	this.renderer = new THREE.WebGLRenderer({
    antialias: true
})

this.renderer.setSize(this.sizes.width, this.sizes.height)

this.renderer.setPixelRatio(window.devicePixelRatio)
this.renderer.domElement.classList.add('main')
document.body.appendChild( this.renderer.domElement );
		 this.renderer.domElement.addEventListener("pointerup",()=>this.trig = true);
		 this.renderer.domElement.addEventListener("pointerdown",()=>this.trig = false);

}
createCamera(){

	this.camera = new THREE.PerspectiveCamera( 54, this.sizes.width / this.sizes.height, 0.2, 1e27 );
	this.camera.position.z = -15000;
	this.camera.position.x = 15000;

	this.controls = new OrbitControls( this.camera, this.renderer.domElement );
	this.controls.maxDistance = 5000;
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 10 );
// this.scene.add( directionalLight );		
}
createSkyBox(){
	    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './skybox/space_ft.png',
      './skybox/space_bk.png',
      './skybox/space_up.png',
      './skybox/space_dn.png',
      './skybox/space_rt.png',
      './skybox/space_lf.png',
    ]);
    this.scene.background = texture;
}
createEarth(){

	this.earthMaterial = new THREE.ShaderMaterial({
   vertexShader,
   fragmentShader,
   uniforms: {
    globeTexture: {
        value: new THREE.TextureLoader().load('./img/low.jpg')
    }
   }
});


this.earth = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 50, 50), this.earthMaterial);
this.group.add(this.earth);

}

changeEarthQuality(val){
        if(val == "5k"){
            this.earthMaterial.uniforms.globeTexture.value = new THREE.TextureLoader().load('./img/low.jpg');
        }
        if(val == "10k"){
            this.earthMaterial.uniforms.globeTexture.value = new THREE.TextureLoader().load('./img/medium.jpg');
        }
        if(val == "16k"){
            this.earthMaterial.uniforms.globeTexture.value = new THREE.TextureLoader().load('./img/high.jpg');
        }
}

createAtmosphere(){
	this.atmosphere = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 50, 50), new THREE.ShaderMaterial({
vertexShader:atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
})
)
	this.atmosphere.scale.set(1.1,1.1,1.1)
	this.group.add(this.atmosphere)
}




createSatellite(callback){
	this.gltf.load('./models/ISS_stationary.glb', ( gltf ) => {
	this.sat = gltf.scene;
	this.sat.rotation.y = this.locator.deg2rad(90);
	this.group.add(this.sat);

	this.projection = new THREE.Mesh( new THREE.SphereGeometry( 10, 50, 50 ), new THREE.MeshBasicMaterial( { color: 0xff0000,transparent: true, opacity: 0.5 } ) );
	this.group.add(this.projection);
	callback();
});

	// this.sat = new THREE.Mesh( new THREE.SphereGeometry( 100, 50, 50 ), new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
	// this.group.add(this.sat)
}
countOrgit(mode, minutes = 120){
		let points = [];
	let mapPoints = [];
	    for (let i = 0; i < minutes; i += 1) {
    	const date = new Date(this.date.getTime() + i * 60000);
        const pos = this.getPositionISS(date);
        const mapPos = this.getPosLatLong(date);
        mapPoints.push({lat:this.locator.rad2deg(mapPos.latitude),lng:this.locator.rad2deg(mapPos.longitude)});
        points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        }
        if(mode == 0){
        	return points;
        }else if(mode==1){
        	return mapPoints;
        }else{
        	return [points,mapPoints]
        }

}
drawOrbit(){
	let points = this.countOrgit(3);
	console.log(points)
     this.map.loadMap(points[1])
    const materialLine = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    const geometryLine = new THREE.BufferGeometry().setFromPoints(points[0] );
    const line = new THREE.Line( geometryLine, materialLine );
    this.group.add(line)
}


updateSatellitePos() {
	this.date = new Date()
	let camDate = new Date();
	camDate.setSeconds(camDate.getSeconds() - 40);
    this.posISS = this.getPositionISS(this.date);
    this.camPos = this.getPositionISS(camDate);
    let camGeo = this.getPosLatLong(camDate)
    let camGeoPos = {
    longitude:camGeo.longitude,
    latitude: camGeo.latitude,
    height: camGeo.height + 200
};
let resultCamPos = this.toThree(satellite.geodeticToEcf(camGeoPos));

    this.sat.position.set(this.posISS.x, this.posISS.y, this.posISS.z);
    let projectionGeo = this.getPosLatLong(this.date)


//     console.log(projectionGeo)
let observerGd = {
    longitude:projectionGeo.longitude,
    latitude: projectionGeo.latitude,
    height: 2
};
let ctrPos = [this.locator.rad2deg(projectionGeo.longitude),this.locator.rad2deg(projectionGeo.latitude)];
this.visualizeData.setPosISS(ctrPos);
this.visualizeData.setTime(this.date);
let nowCountry = locCountry(ctrPos);


if(nowCountry != this.lastCountry){
	if(!nowCountry){
		this.lastCountry = nowCountry = null;
		this.visualizeData.setCtrName("Water");
}
this.lastCountry = nowCountry;
let countryName = ctrNames.filter((el)=>{return el['alpha-3'] == nowCountry})
this.visualizeData.setCtrName(countryName[0].name);

}

		let projectionLocation = this.toThree(satellite.geodeticToEcf(observerGd))



				this.projection.position.set(projectionLocation.x,projectionLocation.y,projectionLocation.z);


    if (this.trig) {
      this.camera.position.set(resultCamPos.x, resultCamPos.y, resultCamPos.z);
      this.camera.lookAt(this.posISS.x, this.posISS.y, this.posISS.z);
    } else {
      this.controls.target.set(this.posISS.x, this.posISS.y, this.posISS.z);
      this.controls.update();
    }

  }
getPosLatLong(date){
	let positionEci = satellite.propagate(this.satrec, date);
	let gmst = satellite.gstime(date);
	return satellite.eciToGeodetic(positionEci.position, gmst);
}


tick(){
	requestAnimationFrame(this.tick.bind(this));
	const mapPos = this.getPosLatLong(this.date);
	this.map.updatePosition({lat:this.locator.rad2deg(mapPos.latitude),lng:this.locator.rad2deg(mapPos.longitude)})
	this.controls.update();
	this.updateSatellitePos();
    this.renderer.render(this.scene, this.camera)
    // this.cloudMesh.rotation.y-=0.0004
}

}