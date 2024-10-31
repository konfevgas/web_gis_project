import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { Draw, Modify } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';

// Set up base layers
const osmLayer = new TileLayer({
  source: new OSM()
});

const cartoLayer = new TileLayer({
  source: new XYZ({
    url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attributions: '© OpenStreetMap contributors, © Carto'
  })
});

// Initialize the map
const map = new Map({
  target: 'map',
  layers: [osmLayer],
  view: new View({
    center: fromLonLat([13.1946, 55.7058]), // Centered on Lund
    zoom: 12
  })
});

// Layer selection logic
const layerSelect = document.getElementById('layer-select');
layerSelect.addEventListener('change', function () {
  map.getLayers().removeAt(0); // Remove current base layer
  switch (layerSelect.value) {
    case 'OSM':
      map.getLayers().insertAt(0, osmLayer);
      break;
    case 'Carto':
      map.getLayers().insertAt(0, cartoLayer);
      break;
  }
});

// Set up vector layer for drawing
const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#ffcc33',
      width: 2
    })
  })
});
map.addLayer(vectorLayer);

// Drawing tools
const draw = new Draw({
  source: vectorSource,
  type: 'Point' // Options: Point, LineString, Polygon
});
map.addInteraction(draw);

// Display coordinates
const coordinatesDisplay = document.getElementById('coordinates');
vectorSource.on('addfeature', function (event) {
  const feature = event.feature;
  const coords = feature.getGeometry().getCoordinates();
  coordinatesDisplay.innerText = `Coordinates: [${coords}]`;
});
