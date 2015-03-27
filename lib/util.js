var package = require('../package.json');
var version = package.version;

module.exports = {
    setCookie: setCookie,
    getCookie: getCookie
}

function setCookie(key, expiration, value) {
    chrome.cookies.set({
        url: 'http://maptab' + version + '.com',
        name: key,
        expirationDate: expiration,
        value: JSON.stringify(value)
    });
}


function getCookie(key, callback) {
    chrome.cookies.get({
        url: 'http://maptab' + version + '.com',
        name: key,
    }, function(data) {
        return callback(data);
    });
}
