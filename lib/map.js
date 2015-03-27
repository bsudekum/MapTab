require('mapbox.js');
var util = require('./util');
var places = require('gazetteer');
var mapids = require('./mapids');

module.exports = function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';

    var geocoder = L.mapbox.geocoder('mapbox.places');

    util.getCookie('settings', function(set) {
        if (!set) {
            var mapid = 'bobbysud.79c006a5';
        } else {
            var settings = JSON.parse(set.value)
            if (settings.map === 'random-map') {
                var index = Math.floor(Math.random() * mapids.length - 1) + 1;
                var mapid = mapids[index].id;
                if (mapids[index].color) {
                    document.getElementsByClassName('color')[0].style.color = mapids[index].color;
                    document.getElementsByClassName('color')[1].style.color = mapids[index].color;
                }
                document.getElementById('save-current').addEventListener('click', function() {
                    document.getElementById('save').removeAttribute('disabled');
                    document.getElementById('custom').checked = 'checked';
                    document.getElementById('custom-mapid').value = mapid;
                });
            } else if (settings.map === 'sat') {
                var mapid = 'bobbysud.79c006a5';
            } else if (settings.map === 'streets') {
                var mapid = 'bobbysud.j1o8j5bd';
            } else if (settings.map === 'custom') {
                var mapid = document.getElementById('custom-mapid').value;
            }
        }
        var map = L.mapbox.map('map', mapid, { zoomControl: false });

        map.setMaxBounds([
            [90, -180],
            [-90, 180]
        ]);

        map.whenReady(function() {
            geocode();
        });

        map.on('moveend', function(e) {
            geocode();
            util.setCookie('location', null, map.getBounds());
        });

        function geocode() {
            geocoder.reverseQuery(map.getCenter(), function(err, data) {
                if (err || !data.features) return false;
                if (data.features[0].place_name.split(',').length === 4) {
                    var name = data.features[0].place_name.split(',')[0] + ', ' + data.features[0].place_name.split(',')[2] + ', ' + data.features[0].place_name.split(',')[3];
                } else if (data.features[0].place_name.split(',').length === 5) {
                    var name = data.features[0].place_name.split(',')[1] + ', ' + data.features[0].place_name.split(',')[3] + ', ' + data.features[0].place_name.split(',')[4];
                } else {
                    var name = data.features[0].place_name;
                }
                document.getElementById('location').innerHTML = name;
            });
        }

        function onLocationError(e) {
            alert(e.message);
        }

        function onLocationFound(e) {
            var icon = L.divIcon({
                className: 'location-icon',
                iconSize: [20, 20]
            });
            L.marker(e.latlng, {
                icon: icon,
                clickable: false
            }).addTo(map);

            util.setCookie('user-loc', null, [e.latlng.lat, e.latlng.lng, 16]);
        }

        util.getCookie('settings', function(set) {
            var settings = JSON.parse(set.value)
            if (settings.loc === 'random') {
                var index = Math.floor(Math.random() * places.length - 1) + 1;
                if (mapid === 'bobbysud.79c006a5' && places[index].zoom > 14) {
                    var zoom = 14;
                } else {
                    var zoom = places[index].zoom;
                }
                map.setView([places[index].center[0], places[index].center[1]], zoom);
            } else if (settings.loc === 'last-pos') {
                util.getCookie('location', function(loc) {
                    var values = JSON.parse(loc.value);
                    map.fitBounds([
                        [values._northEast.lat, values._northEast.lng],
                        [values._southWest.lat, values._southWest.lng]
                    ]);
                });
            } else if (settings.loc === 'user-loc') {
                util.getCookie('user-loc', function(loc) {
                    if (loc) {
                        var values = JSON.parse(loc.value);
                        map.setView([values[0], values[1]], values[2]);
                    }
                    map.on('locationerror', onLocationError);
                    map.on('locationfound', onLocationFound);
                    map.locate({
                        setView: true,
                        maxZoom: 16,
                        watch: false
                    });
                });
            }
        });
    });
}
