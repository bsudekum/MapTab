require('mapbox.js');
var weather = require('./weather');
var util = require('./util');
var places = require('./places');
var mapids = require('./mapids');

module.exports = function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';

    var geocoder = L.mapbox.geocoder('mapbox.places');

    util.getCookie('settings', function(set) {
        var settings = JSON.parse(set.value)
        if (settings.map === 'random-map') {
            var index = Math.floor(Math.random() * mapids.length - 1) + 1;
            var mapid = mapids[index].id;
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
        var map = L.mapbox.map('map', mapid, {
            zoomControl: false,
        });

        map.setMaxBounds([
            [90, -180],
            [-90, 180]
        ]);

        map.whenReady(function() {
            geocode();
        });

        map.on('moveend', function(e) {
            geocode();
            // weather.getForecast(map.getCenter().lat, map.getCenter().lng);
            util.setCookie('location', map.getBounds());
        });

        function geocode() {
            geocoder.reverseQuery(map.getCenter(), function(err, data) {
                if (err) return;
                document.getElementById('location').innerHTML = data.features[0].place_name;
            });
        }

        function onLocationError(e) {
            alert(e.message);
        }

        util.getCookie('settings', function(set) {
            var settings = JSON.parse(set.value)
            if (settings.loc === 'random') {
                var index = Math.floor(Math.random() * places.length - 1) + 1;
                map.setView([places[index].center[0], places[index].center[1]], places[index].zoom);
            } else if (settings.loc === 'last-pos') {
                util.getCookie('location', function(loc) {
                    var values = JSON.parse(loc.value);
                    map.fitBounds([
                        [values._northEast.lat, values._northEast.lng],
                        [values._southWest.lat, values._southWest.lng]
                    ]);
                });
            } else if (settings.loc === 'user-loc') {
                map.on('locationerror', onLocationError);
                map.locate({
                    setView: true,
                    maxZoom: 16
                });
            }
        });
    });
}
