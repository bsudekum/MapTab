require('mapbox.js');
var corslite = require('corslite');
var userLoc = null;
var date = new Date();
var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};
document.getElementById('date').innerHTML = date.toLocaleDateString('en-us', options);

L.mapbox.accessToken = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';

var geocoder = L.mapbox.geocoder('mapbox.places');
var map = L.mapbox.map('map', 'bobbysud.79c006a5', {
    zoomControl: false
});

chrome.cookies.get({
    url: 'http://maptab.com',
    name: 'location',
}, function(loc) {
    if (!loc) {
        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);
        map.locate({
            setView: true,
            maxZoom: 16
        });
    } else {
        var values = JSON.parse(loc.value);
        map.fitBounds([
            [values._northEast.lat, values._northEast.lng],
            [values._southWest.lat, values._southWest.lng]
        ]);
        getWeather(map.getCenter().lat, map.getCenter().lng);
    }
});

map.whenReady(function() {
    geocode();
});

map.on('moveend', function(e) {
    geocode();
    getWeather(map.getCenter().lat, map.getCenter().lng);
    setCookie(map.getBounds());
});


function onLocationFound(e) {
    setCookie(map.getBounds());
}

function onLocationError(e) {
    alert(e.message);
}

(function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    if (h > 12) {
        var ampm = 'pm';
        h = h - 12;
    } else {
        var ampm = 'am';
    }
    m = checkTime(m);
    document.getElementById('time').innerHTML = h + ':' + m + ' ' + ampm;
    var t = setTimeout(function() {
        startTime()
    }, 500);
})();

function checkTime(i) {
    if (i < 10) {
        i = '0' + i
    };
    return i;
}

function geocode() {
    geocoder.reverseQuery(map.getCenter(), function(err, data) {
        if (err) return;
        document.getElementById('location').innerHTML = data.features[0].place_name;
    });
}

function setCookie(location) {
    chrome.cookies.set({
        url: 'http://maptab.com',
        name: 'location',
        value: JSON.stringify(location)
    });
}

function getWeather(lat, lng) {
    corslite('http://api.wunderground.com/api/764087090e3c0b23/forecast/q/' + lat + ',' + lng + '.json', function(err, data) {
        if(err) return err;
        var weather = document.getElementById('weather');
        weather.innerHTML = '';
        var fc = JSON.parse(data.response).forecast.simpleforecast.forecastday;
        for (var i = 0; i < fc.length; i++) {
            var low = fc[i].low.fahrenheit;
            var high = fc[i].high.fahrenheit;
            var icon = fc[i].icon;
            var day = fc[i].date.weekday;
            weather.innerHTML += '<a href="#"><h2 class="pad2 wi wi-day-' + icon + ' white"></h2><div><span class="white pad5">' + high + '</span><span class="grey pad5">' + low + '</span><div class="white pad5">' + day + '</div></div></a>';
        }
    });
}
