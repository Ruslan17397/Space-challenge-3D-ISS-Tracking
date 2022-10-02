import * as jeolok from 'jeolok'

export class Locator{

constructor(){
}
getPosition(callback){
jeolok.getCurrentPosition( { enableHighAccuracy: true }, function( error, position ) {
    if( error ) {
        return console.error( "Shit happens!", error );
    }
   callback({latitude:position.coords.latitude, longitude:position.coords.longitude})
} );
}


deg2rad(degrees){
	return degrees * (Math.PI/180);
}
rad2deg(radians){
	return radians * 180 / Math.PI;
}

getDistanceToUser(lat,lng){

	let dLat = this.radLat - lat;
	let dLon = this.radLong - lng; 
	let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat) * Math.cos(this.radLat) * Math.sin(dLon/2) * Math.sin(dLon/2) ;
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	return earthRadius * c; 
}

}
