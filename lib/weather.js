var corslite = require('corslite');
var util = require('./util');

module.exports = {
    getForecast: getForecast
}

function getForecast(lat, lng) {
    var units = 'imperial';
    util.getCookie('settings', function(data) {
        if(data) units = JSON.parse(data.value).units;
        corslite('http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lng + '&cnt=10&mode=json&cnt=4&units=' + units, function(err, data) {
            if (err) return err;
            var weather = document.getElementById('weather');
            weather.innerHTML = '';
            var fc = JSON.parse(data.response)
            _parseForecast(fc);
        });
    });
}

function _parseForecast(data) {
    for (var i = 0; i < data.list.length; i++) {
        var low = data.list[i].temp.min.toFixed(0);
        var high = data.list[i].temp.max.toFixed(0);
        var icon = data.list[i].weather[0].main.toLowerCase();;
        weather.innerHTML += '<a href="#"><h2 class="pad2 wi wi-day-' + icon + ' white"></h2><div><span class="red pad5">' + high + '&#xb0;</span><span class="blue pad5">' + low + '&#xb0;</span><div class="white pad5"></div></div></a>';
    }
}
