import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import OSM from 'ol/source/OSM';
import ImageWMS from 'ol/source/ImageWMS';
import { fromLonLat, toLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';

// Basemap layers
const osmLayer = new TileLayer({
  source: new OSM(),
  visible: true,  // Make OSM layer visible by default
});

const cartoLayer = new TileLayer({
  source: new XYZ({
    url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    attributions: '© CartoDB',
  }),
  visible: false, // Not visible initially
});

const googleMapLayer = new TileLayer({
  source: new XYZ({
    url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
    attributions: '© Google',
  }),
  visible: false, // Not visible initially
});

const googleSatelliteLayer = new TileLayer({
  source: new XYZ({
    url: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
    attributions: '© Google',
  }),
  visible: false, // Not visible initially
});

// GeoServer WMS Layers (as defined in your original code)
const _lundProjectGeoserverURL = 'http://localhost:8080/geoserver/wms';
const _isLayerVisible = false;

function createWMSLayer(layerName, geoserverURL = _lundProjectGeoserverURL, isVisible = _isLayerVisible) {
  return new ImageLayer({
    source: new ImageWMS({
      url: geoserverURL,
      params: {
        'LAYERS': `lund_web_mapping:${layerName}`,
        'TILED': true
      },
    }),
    visible: isVisible,
  });
}

const lundAddresses = createWMSLayer('addresses_wgs84');
const lundDistricts = createWMSLayer('districts_wgs84');
const lundPublicBuildings = createWMSLayer('public_buildings_wgs84');
const lundRailroads = createWMSLayer('railroads_wgs84');
const lundRoadsAll = createWMSLayer('roads_all_wgs84');
const lundRoadsHighway = createWMSLayer('roads_highway_wgs84');
const lundRoadsThrough = createWMSLayer('roads_throug_wgs84');
const lundRuralBuildings = createWMSLayer('rural_buildings_wgs84');

// Set up the map view
const mapView = new View({
  center: fromLonLat([13.1906, 55.7060]),
  zoom: 12,
});

// Initialize the map
const map = new Map({
  target: 'map',
  view: mapView,
  layers: [
    osmLayer,
    cartoLayer,
    googleMapLayer,
    googleSatelliteLayer,
    lundAddresses,
    lundDistricts,
    lundPublicBuildings,
    lundRailroads,
    lundRoadsAll,
    lundRoadsHighway,
    lundRoadsThrough,
    lundRuralBuildings
  ]
});

// Function to handle basemap visibility
function toggleBasemap(selectedLayer) {
  const layers = [osmLayer, cartoLayer, googleMapLayer, googleSatelliteLayer];
  
  layers.forEach(layer => {
    layer.setVisible(layer === selectedLayer);
  });
}

// Event listeners for the basemap toggle
document.getElementById('osm-toggle').addEventListener('change', function() {
  if (this.checked) toggleBasemap(osmLayer);
});
document.getElementById('carto-toggle').addEventListener('change', function() {
  if (this.checked) toggleBasemap(cartoLayer);
});
document.getElementById('googleMap-toggle').addEventListener('change', function() {
  if (this.checked) toggleBasemap(googleMapLayer);
});
document.getElementById('googleSatellite-toggle').addEventListener('change', function() {
  if (this.checked) toggleBasemap(googleSatelliteLayer);
});

// Toggle Layers
const layerToggles = [
  { id: 'addresses-toggle', layer: lundAddresses },
  { id: 'districts-toggle', layer: lundDistricts },
  { id: 'publicBuildings-toggle', layer: lundPublicBuildings },
  { id: 'ruralBuildings-toggle', layer: lundRuralBuildings },
  { id: 'roadsAll-toggle', layer: lundRoadsAll },
  { id: 'roadsHighway-toggle', layer: lundRoadsHighway },
  { id: 'roadsThrough-toggle', layer: lundRoadsThrough },
  { id: 'railroads-toggle', layer: lundRailroads }
];

// Add event listeners to each toggle checkbox
layerToggles.forEach(({ id, layer }) => {
  const checkbox = document.getElementById(id);
  checkbox.addEventListener('change', () => {
    layer.setVisible(checkbox.checked);
  });
});

// Display cursor coordinates
const coordText = document.getElementById('coord-text');
map.on('pointermove', function(event) {
  const coordinate = toLonLat(event.coordinate); // Convert to LonLat
  const lon = coordinate[0].toFixed(4);
  const lat = coordinate[1].toFixed(4);
  coordText.innerText = `${lat}, ${lon}`; // Update text in coord-text span
});
});
