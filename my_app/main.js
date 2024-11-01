import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import OSM from 'ol/source/OSM';
import ImageWMS from 'ol/source/ImageWMS';
import { fromLonLat } from 'ol/proj';

// Base map layer (OpenStreetMap)
const osmTile = new TileLayer({
  source: new OSM(),
});

// Variables
const geoserverURL = 'http://localhost:8080/geoserver/wms'
const isLayerVisible = false

// GeoServer WMS Layers
const lundAddresses = new ImageLayer({
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': 'lund_web_mapping:addresses_wgs84',
      'TILED': true
    },
  }),
  visible: isLayerVisible,
});

const lundDistricts = new ImageLayer({
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': 'lund_web_mapping:districts_wgs84',
      'TILED': true
    },
  }),
  visible: isLayerVisible,
});

const lundPublicBuildings = new ImageLayer({
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': 'lund_web_mapping:public_buildings_wgs84',
      'TILED': true
    },
  }),
  visible: isLayerVisible,
});

const lundRailroads = new ImageLayer({
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': 'lund_web_mapping:railroads_wgs84',
      'TILED': true
    },
  }),
  visible: isLayerVisible,
});

const lundRoadsAll = new ImageLayer({
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': 'lund_web_mapping:roads_all_wgs84',
      'TILED': true
    },
  }),
  visible: isLayerVisible,
});

const lundRoadsHighway = new ImageLayer({
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': 'lund_web_mapping:roads_highway_wgs84',
      'TILED': true
    },
  }),
  visible: isLayerVisible,
});


const lundRoadsThrough = new ImageLayer({
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': 'lund_web_mapping:roads_throug_wgs84',
      'TILED': true
    },
  }),
  visible: isLayerVisible,
});

const lundRuralBuildings = new ImageLayer({
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': 'lund_web_mapping:rural_buildings_wgs84',
      'TILED': true
    },
  }),
  visible: isLayerVisible,
});


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
    osmTile,
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




// Toggle Layers

const addressesToggle = document.getElementById('addresses-toggle');
addressesToggle.addEventListener('change', function () {
  lundAddresses.setVisible(addressesToggle.checked);
});

const districtsToggle = document.getElementById('districts-toggle');
districtsToggle.addEventListener('change', function () {
  lundDistricts.setVisible(districtsToggle.checked);
});

const publicBuildingsToggle = document.getElementById('publicBuildings-toggle');
publicBuildingsToggle.addEventListener('change', function () {
  lundPublicBuildings.setVisible(publicBuildingsToggle.checked);
});

const ruralBuildingsToggle = document.getElementById('ruralBuildings-toggle');
ruralBuildingsToggle.addEventListener('change', function () {
  lundRuralBuildings.setVisible(ruralBuildingsToggle.checked);
});

const roadsAllToggle = document.getElementById('roadsAll-toggle');
roadsAllToggle.addEventListener('change', function () {
  lundRoadsAll.setVisible(roadsAllToggle.checked);
});

const roadsHighwayToggle = document.getElementById('roadsHighway-toggle');
roadsHighwayToggle.addEventListener('change', function () {
  lundRoadsHighway.setVisible(roadsHighwayToggle.checked);
});

const roadsThroughToggle = document.getElementById('roadsThrough-toggle');
roadsThroughToggle.addEventListener('change', function () {
  lundRoadsThrough.setVisible(roadsThroughToggle.checked);
});

const railroadsToggle = document.getElementById('railroads-toggle');
railroadsToggle.addEventListener('change', function () {
  lundRailroads.setVisible(railroadsToggle.checked);
});
