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
const _lundProjectGeoserverURL = 'http://localhost:8080/geoserver/wms'
const _isLayerVisible = false

// GeoServer WMS Layers
function createWMSLayer (layerName, geoserverURL = _lundProjectGeoserverURL, isVisible = _isLayerVisible) {
  return new ImageLayer ({
    source: new ImageWMS({
      url: geoserverURL,
      params: {
        'LAYERS': `lund_web_mapping:${layerName}`,
        'TILED': true
      },
    }),
    visible: isVisible,
  })
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

