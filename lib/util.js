var package = require('../package.json');
var version = package.version;

module.exports = {
    setCookie: setCookie,
    getCookie: getCookie
}

function setCookie(key, expiration, value) {
    chrome.cookies.set({
        url: 'http://maptab.com/version/' + version,
        name: key,
        expirationDate: expiration,
        value: JSON.stringify(value)
    });
}


function getCookie(key, callback) {
    chrome.cookies.get({
        url: 'http://maptab.com/' + version,
        name: key,
    }, function(data) {
        return callback(data);
    });
}
