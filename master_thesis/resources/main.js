var mapView = new ol.View ({
    center: ol.proj.fromLonLat([22.400393649826853, 40.08545874790385]),
    zoom: 12,
});

var map = new ol.Map ({
    target: 'map',
    view: mapView,
}); 

var osmTile = new ol.layer.Tile ({
    title: 'Open Street Map',
    visible: true,
    source: new ol.source.OSM()
});

map.addLayer(osmTile);
