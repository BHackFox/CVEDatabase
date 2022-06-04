let userData;
let countries;

const mappa = new Mappa('Leaflet');
let trainMap;
let canvas;

let data = [];

const options = {
  lat: 0,
  lng: 0,
  zoom: 1.5,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function preload() {
  userData = loadTable('js/geo.csv', 'header');
  countries = loadJSON('js/countries.json');

}

function setup() {
  canvas = createCanvas(1000, 700);
  trainMap = mappa.tileMap(options);
  trainMap.overlay(canvas);

  let maxSubs = 0;
  let minSubs = Infinity;

  for (let row of userData.rows) {
    let country = row.get('country_id').toLowerCase();
    let latlon = countries[country];
    if (latlon) {
      let lat = latlon[0];
      let lon = latlon[1];
      let count = Number(row.get('subscribers'));
      data.push({
        lat,
        lon,
        count
      });
      if (count > maxSubs) {
        maxSubs = count;
      }
      if (count < minSubs) {
        minSubs = count;
      }
    }
  }

  let minD = sqrt(minSubs);
  let maxD = sqrt(maxSubs);

  for (let country of data) {
    country.diameter = map(sqrt(country.count), minD, maxD, 1, 20);
  }
}

function draw() {
  clear();
  for (let country of data) {
    const pix = trainMap.latLngToPixel(country.lat, country.lon);
    fill(frameCount % 255, 0, 200, 100);
    const zoom = trainMap.zoom();
    const scl = pow(2, zoom); // * sin(frameCount * 0.1);
    ellipse(pix.x, pix.y, country.diameter * scl);
  }



}
