import "./style.css";
import { SatelliteEngine } from "./SatelliteEngine.js";

let trig = document.querySelector(".trig");
let infoBlock = document.querySelector(".static-menu");
let checkBoxes = document.querySelectorAll("input[type=radio]");

let trig_sizes = {
  width: 300,
  height: 300,
};
const ISS = {
  line1:
    "1 25544U 98067A   22270.90703402  .00010643  00000-0  19197-3 0  9992",
  line2:
    "2 25544  51.6442 187.6695 0002438 302.1381 175.4033 15.50331817361110",
};
let handleResize = (width, height, satellite) => {
  satellite.setSizes(width, height);
  satellite.camera.aspect = satellite.sizes.width / satellite.sizes.height;
  satellite.camera.updateProjectionMatrix();
  satellite.renderer.setSize(satellite.sizes.width, satellite.sizes.height);
  satellite.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

let init = () => {
  const satellite = new SatelliteEngine(ISS);
  satellite._init();
  console.log(ISS);

  window.addEventListener(
    "resize",
    () => handleResize(window.innerWidth, window.innerHeight, satellite),
    false
  );

  checkBoxes.forEach((el) => {
    el.addEventListener("change", (e) => {
      let val = e.target.value;
      satellite.changeEarthQuality(val);
    });
  });
};
fetch("https://api.wheretheiss.at/v1/satellites/25544/tles")
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Something went wrong");
  })
  .then((responseJson) => {
    ISS.line1 = responseJson["line1"];
    ISS.line2 = responseJson["line2"];
    init();
  })
  .catch((error) => {
    console.log(error);
    init();
  });

let main = document.querySelector(".main");

const iframe = document.querySelector(".livestream_iframe");
const streamButton = document.querySelectorAll(".livestream_button");
const CAM1 = "CAM 1";
const CAM2 = "CAM 2";

streamButton.forEach((i) => {
  i.addEventListener("click", (e) => {
    console.log(e.target.innerText);
    if (e.target.innerText === CAM1) {
      iframe.innerHTML = `<iframe class="livestream" width="100%" height="100%" src="https://www.youtube.com/embed/86YLFOog4GM"
      title="🌎 Nasa Live Stream  - Earth From Space :  Live Views from the ISS" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
      streamButton[0].classList.add("active");
      streamButton[1].classList.remove("active");
    } else {
      iframe.innerHTML = `<iframe  class="livestream" width="100%" height="100%" src="https://www.youtube.com/embed/ddZu_1Z3BAc" title="NASA LIVE Stream From The ISS - Live Earth & Space Station Views & Audio" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      streamButton[1].classList.add("active");
      streamButton[0].classList.remove("active");
    }
  });
});

const mapWrap = document.querySelector('.mapWrap')


mapWrap.addEventListener('click', (e) => {
  console.log(e.target.classList);
  mapWrap.classList.toggle('big-map')
})