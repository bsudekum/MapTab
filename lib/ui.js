var serialize = require('form-serialize');
var util = require('./util');
var date = new Date();
var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

module.exports = function() {

    document.getElementById('date').innerHTML = date.toLocaleDateString('en-us', options);

    document.getElementById('form-settings').addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var settings = serialize(e.target, {
            hash: true,
            empty: true,
            disabled: true
        });
        if (settings.map === 'custom' && !document.getElementById('custom-mapid').value) {
            return alert('Please provide a mapid')
        }
        util.setCookie('settings', null, settings);
        showHide();
        location.reload();
    });

    util.getCookie('settings', function(set) {
        if(!set) return false;
        var settings = JSON.parse(set.value);
        for (var k in settings) {
            if (settings.hasOwnProperty(k)) {
                if (!document.getElementById(settings[k])) {
                    document.getElementById('custom-mapid').value = settings['custom-mapid'];
                } else {
                    document.getElementById(settings[k]).checked = 'checked';
                }
            }
        }
        checkForCustomMapId();
    });

    document.getElementById('show-settings').addEventListener('click', function(e) {
        showHide();
    });

    document.getElementById('close').addEventListener('click', function(e) {
        showHide();
    });

    function showHide() {
        var settings = document.getElementById('settings');
        if (settings.className.indexOf('active') > 0) {
            settings.classList.remove('active');
        } else {
            settings.classList.add('active');
        }
    }

    document.getElementById('form-settings').addEventListener('change', function(e) {
        document.getElementById('save').removeAttribute('disabled');
        checkForCustomMapId();
    });

    function checkForCustomMapId() {
        if (document.getElementById('custom').checked) {
            document.getElementById('custom-mapid').removeAttribute('disabled');
        } else {
            document.getElementById('custom-mapid').setAttribute('disabled', true);
            document.getElementById('custom-mapid').value = '';
        }
    }

    (function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        if (h > 12) {
            h = h - 12;
            var ampm = 'pm';
        } else if (h === 12) {
            var ampm = 'pm';
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
}
