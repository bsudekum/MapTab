var corslite = require('corslite');

module.exports = {
    getForecast: getForecast
}

function getForecast(lat, lng) {
    corslite('http://api.wunderground.com/api/764087090e3c0b23/forecast/q/' + lat + ',' + lng + '.json', function(err, data) {
        if (err) return err;
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
