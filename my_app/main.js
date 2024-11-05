import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import OSM from 'ol/source/OSM';
import ImageWMS from 'ol/source/ImageWMS';
import { fromLonLat, toLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Icon } from 'ol/style';
import ScaleLine from 'ol/control/ScaleLine';
import { defaults as defaultControls } from 'ol/control';

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

function createWMSLayer(layerName, styleName, geoserverURL = _lundProjectGeoserverURL, isVisible = _isLayerVisible) {
  return new ImageLayer({
    source: new ImageWMS({
      url: geoserverURL,
      params: {
        'LAYERS': `lund_web_mapping:${layerName}`,
        'STYLES': styleName,
        'TILED': true
      },
    }),
    visible: isVisible,
  });
}

const lundAddresses = createWMSLayer('addresses_wgs84', 'lund_web_mapping:addresses');
const lundDistricts = createWMSLayer('districts_wgs84', 'lund_web_mapping:districts');
const lundPublicBuildings = createWMSLayer('public_buildings_wgs84', 'lund_web_mapping:public_buildings');
const lundRailroads = createWMSLayer('railroads_wgs84', 'lund_web_mapping:railroads');
const lundRoadsAll = createWMSLayer('roads_all_wgs84', 'lund_web_mapping:roads_all');
const lundRoadsHighway = createWMSLayer('roads_highway_wgs84', 'lund_web_mapping:roads_highway');
const lundRoadsThrough = createWMSLayer('roads_throug_wgs84', 'lund_web_mapping:roads_through');
const lundRuralBuildings = createWMSLayer('rural_buildings_wgs84', 'lund_web_mapping:rural_buildings');

const mapView = new View({
  center: fromLonLat([13.1906, 55.7060]),
  zoom: 12,
});

const scaleLineControl = new ScaleLine({
  units: 'metric',
  bar: false,
  steps: 4,
  text: true,
  minWidth: 100,
  maxWidth: 110,
  target: 'scale-line',
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
  ],
  controls: defaultControls().extend([scaleLineControl])
});

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

// Display cursor coordinates and click to open new window for coordinates
const coordText = document.getElementById('coord-text');
map.on('pointermove', function(event) {
  const coordinate = toLonLat(event.coordinate); // Convert to LonLat
  const lon = coordinate[0].toFixed(7);
  const lat = coordinate[1].toFixed(7);
  coordText.innerText = `${lat}, ${lon}`; // Update text in coord-text span
});

// Display clicked coordinates and copy option
const clickedCoordinatesDiv = document.getElementById('clicked-coordinates');

// Initialize a vector source to hold the point feature
const markerSource = new VectorSource();

// Create a vector layer for the marker and add it to the map
const markerLayer = new VectorLayer({
  source: markerSource,
  style: new Style({
    image: new Icon({
      src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      scale: 0.06,
      anchor: [0.5, 1],
    }),
  }),
});
map.addLayer(markerLayer);

// Map click event to display clicked coordinates and place a marker
map.on('click', function(event) {
  const coordinate = toLonLat(event.coordinate); // Convert to LonLat
  const lon = coordinate[0].toFixed(7);
  const lat = coordinate[1].toFixed(7);

  // Update the coordinates in the clickedCoordinatesDiv
  clickedCoordinatesDiv.innerHTML = `Clicked Coordinates: Lat/Lon: ${lat}, ${lon} <span class="copy-icon" id="copy-coord">📝</span>`;
  clickedCoordinatesDiv.dataset.coords = `${lat}, ${lon}`; // Store the coordinates for copying

  // Clear previous marker
  markerSource.clear();

  // Create a new point feature at the clicked location
  const marker = new Feature({
    geometry: new Point(event.coordinate),
  });
  markerSource.addFeature(marker);
});

// Copy coordinates to clipboard functionality
clickedCoordinatesDiv.addEventListener('click', function(event) {
  // Check if the clicked element is the copy icon
  if (event.target.id === 'copy-coord') {
    const textToCopy = clickedCoordinatesDiv.dataset.coords; // Retrieve only the coordinates
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Coordinates copied to clipboard:', textToCopy);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
});

// Select the Remove Marker button
const removeMarkerButton = document.getElementById('remove-marker');

// Add an event listener to clear the marker when the button is clicked
removeMarkerButton.addEventListener('click', () => {
  markerSource.clear(); // Clear all markers from the marker source
  clickedCoordinatesDiv.innerHTML = "Clicked Coordinates (Lat/Lon): -, - <span class='copy-icon' id='copy-coord'>📝</span>"; // Reset clicked coordinates display
});