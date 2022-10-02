import { Loader } from '@googlemaps/js-api-loader';

export class MapEngine{
	constructor(pos){

this.loader = new Loader({
  apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
});

const mapOptions = {
  center: pos,
  zoom: 3,
        disableDefaultUI: true,
        draggable: false,
        language: 'en'
};

this.loader.load()
  .then((google) => {
    this.map = new google.maps.Map(document.querySelector(".map"), mapOptions);
  })
  .catch(e => {
    // do something
  });

	}
loadMap(points){


    const svgMarker = {
    path: "M428.483,73.516C381.076,26.108,318.045,0,251,0C183.956,0,120.924,26.108,73.516,73.516S0,183.956,0,251 s26.108,130.076,73.516,177.484S183.956,502,251,502c67.045,0,130.076-26.108,177.483-73.516 C475.892,381.076,502,318.044,502,251S475.892,120.924,428.483,73.516z M251,482C123.626,482,20,378.374,20,251 S123.626,20,251,20s231,103.626,231,231S378.374,482,251,482z M251,87c-90.43,0-164,73.57-164,164s73.57,164,164,164s164-73.57,164-164S341.43,87,251,87z M251,395 c-79.402,0-144-64.598-144-144s64.598-144,144-144s144,64.598,144,144S330.402,395,251,395z M251,180c-39.149,0-71,31.851-71,71s31.851,71,71,71s71-31.851,71-71S290.149,180,251,180z M251,302 c-28.122,0-51-22.878-51-51s22.878-51,51-51c28.121,0,51,22.878,51,51S279.121,302,251,302z M251,180c-39.149,0-71,31.851-71,71s31.851,71,71,71s71-31.851,71-71S290.149,180,251,180z M251,302 c-28.122,0-51-22.878-51-51s22.878-51,51-51c28.121,0,51,22.878,51,51S279.121,302,251,302z M73.366,148.116c-4.908-2.536-10.939-0.614-13.475,4.292c-9.238,17.873-15.9,36.933-19.8,56.652 c-1.071,5.418,2.452,10.679,7.87,11.75c0.655,0.129,1.308,0.192,1.951,0.192c4.678,0,8.857-3.299,9.799-8.062 c3.535-17.873,9.573-35.149,17.947-51.35C80.193,156.685,78.272,150.652,73.366,148.116z M91.813,121.437c1.911,1.717,4.301,2.563,6.682,2.563c2.738,0,5.466-1.118,7.44-3.314C142.89,79.577,195.764,56,251,56 c44.33,0,86.103,14.494,120.803,41.915c4.334,3.423,10.621,2.687,14.046-1.646s2.688-10.622-1.646-14.046 C345.937,51.983,299.876,36,251,36c-60.901,0-119.197,25.993-159.938,71.314C87.37,111.421,87.706,117.744,91.813,121.437z",
    fillColor: "red",
    fillOpacity: 0.8,
    strokeWeight: 0,
    rotation: 0,
    scale: 0.05,
    anchor: new google.maps.Point(0, 450),
  };
 this.marker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map,
      icon: svgMarker,
      title: "ISS"
    });

this.flightPath = new google.maps.Polyline({
    path: points,
    strokeColor: "#0000FF",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });
this.flightPath.setMap(this.map);

	}
	updatePosition(pos){
		this.marker.setPosition(pos);
        this.map.setCenter(pos)
	}
}