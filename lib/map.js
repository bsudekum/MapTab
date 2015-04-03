var React = require('react');
require('mapbox.js');
var util = require('./util');
var places = require('gazetteer');
var mapids = require('./mapids');

var Map = React.createClass({

  getInitialState: function() {
    return {
      mapid: this.props.radomMapid,
      geocodeResult: ''
    }
  },

  componentDidMount: function() {
    var self = this;
    util.getCookie('settings', function(settings) {
      if (settings && settings.mapSettings[0].checked) {
        self.state.mapid = 'bobbysud.79c006a5';
      } else if (settings && settings.mapSettings[1].checked) {
        self.state.mapid = 'bobbysud.j1o8j5bd';
      } else if (settings && settings.mapSettings[3].checked) {
        self.state.mapid = settings.customMapId
      }

      L.mapbox.accessToken = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';
      self.geocoder = L.mapbox.geocoder('mapbox.places');

      self.map = L.mapbox.map(self.refs.map.getDOMNode(), self.state.mapid, {
        zoomControl: false,
      });

      self.map.setMaxBounds([ [90, -180], [-90, 180] ]);

      self.map.on('moveend', function(e) {
          self.onGeocode();
          util.setCookie('location', null, [self.map.getCenter().lat, self.map.getCenter().lng, self.map.getZoom()]);
      });
    });

    util.getCookie('settings', function(settings) {
      if (settings && settings.locationSettings[1].checked) {
        util.getCookie('location', function(location) {
          if (location) self.map.setView([location[0], location[1]], location[2]);
        });
      } else if (settings && settings.locationSettings[0].checked) {
        util.getCookie('location', function(location) {
          if (location) self.map.setView([location[0], location[1]], 16);
          self.map.on('locationerror', self.onLocationError);
          self.map.on('locationfound', self.onLocationFound);
          self.map.locate({
            setView: true,
            maxZoom: 16
          });
        });
      } else {
        var index = Math.floor(Math.random() * places.length - 1) + 1;
        var zoom = (self.state.mapid === 'bobbysud.79c006a5' && places[index].zoom > 14) ? 14 : places[index].zoom;
        self.map.setView([places[index].center[0], places[index].center[1]], zoom);
      }
    });
  },

  onLocationError: function(e) {
    alert(e.message);
  },

  onLocationFound: function(e) {
    var self = this;
    var icon = L.divIcon({
      className: 'location-icon',
      iconSize: [20, 20]
    });
    L.marker(e.latlng, {
        icon: icon,
        clickable: false
    }).addTo(self.map);

    util.setCookie('location', null, [self.map.getCenter().lat, self.map.getCenter().lng, 16]);
  },

  onGeocode: function() {
    var self = this;
    self.geocoder.reverseQuery(self.map.getCenter(), function(err, data) {
      if (err || !data.features) return false;
      if (data.features[0] && data.features[0].place_name.split(',').length === 4) {
          var name = data.features[0].place_name.split(',')[0] + ', ' + data.features[0].place_name.split(',')[2] + ', ' + data.features[0].place_name.split(',')[3];
      } else if (data.features[0] && data.features[0].place_name.split(',').length === 5) {
          var name = data.features[0].place_name.split(',')[1] + ', ' + data.features[0].place_name.split(',')[3] + ', ' + data.features[0].place_name.split(',')[4];
      } else if (data.features[0]) {
          var name = data.features[0].place_name;
      }
      self.props.onGeocode(name);
    });
  },

  render: function() {
    return (
      <div id='map' ref='map'></div>
    )
  }

});

module.exports = Map;