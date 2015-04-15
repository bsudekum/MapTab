var p = require('../package.json');
var url = 'http://maptab' + p.version + '.com'

module.exports = {
    setCookie: setCookie,
    getCookie: getCookie
}

function setCookie(key, expiration, value) {
    chrome.cookies.set({
        url: url,
        name: key,
        expirationDate: expiration,
        value: JSON.stringify(value)
    });
}


function getCookie(key, callback) {
    chrome.cookies.get({
        url: url,
        name: key,
    }, function(data) {
        if (!data) return callback();
        return callback(JSON.parse(data.value));
    });
}
