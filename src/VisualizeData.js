export class VisualizeData{
	constructor(selectors){
	this.latISS = document.querySelector(selectors[0]);
	this.lngISS = document.querySelector(selectors[1]);
	this.ctrName = document.querySelector(selectors[2]);
	this.nowTime = document.querySelector(selectors[3]);
	this.overTime = document.querySelector(selectors[4]);
	}
	setPosISS(val){
		this.latISS.innerText = `Longitude: ${val[0].toFixed(2)}`;
		this.lngISS.innerText = `Latitude: ${val[1].toFixed(2)}`;
	}
	setCtrName(val){
		this.ctrName.innerText = `Country: ${val}`;
	}
	setTime(val){
		this.nowTime.innerText = `Time: ${val.getUTCHours()}:${val.getUTCMinutes()}:${val.getUTCSeconds()} (${val.getHours()}:${val.getMinutes()}:${val.getSeconds()})`;
	}
	setOverTime(val){
		this.overTime.innerText = `Over your city: ${val}`;
	}
}