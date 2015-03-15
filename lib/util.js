module.exports = {
    setCookie: setCookie,
    getCookie: getCookie
}

function setCookie(key, value) {
    chrome.cookies.set({
        url: 'http://maptab.com',
        name: key,
        value: JSON.stringify(value)
    });
}

function getCookie(key, callback) {
    chrome.cookies.get({
        url: 'http://maptab.com',
        name: key,
    }, function(data) {
        return callback(data);
    });
}
