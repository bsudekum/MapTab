var React = require('react');
var Planetaryjs = require('planetary.js');
var util = require('./util');
var worldData = require('../node_modules/planetary.js/dist/world-110m.json')

var Globe = React.createClass({

  getInitialState() {
    return {
      planet : Planetaryjs.planet(),
      showGlobe : false
    }
  },

  componentDidMount: function() {
    
    // load the earth plugin
    this.state.planet.loadPlugin(Planetaryjs.plugins.earth(
    {
      topojson: { world:   worldData },
      oceans:   { fill:   'RGBA(34, 43, 48, 0.4)' },
      land:     { fill:   'white' },
      borders:  { stroke: 'white'}
    }));

    // load the pings plugin
    this.state.planet.loadPlugin(Planetaryjs.plugins.pings());

    // load the drag plugin
    this.state.planet.loadPlugin(Planetaryjs.plugins.drag());    

    var canvas = document.getElementById('globe');

    util.getCookie('settings', (settings) => {
      if (settings && settings.showGlobe) {
        this.setState({ showGlobe : true });
      }
    });

    // handle retina screens
    if (window.devicePixelRatio == 2) {
      canvas.width = 300;
      canvas.height = 300;
      var context = canvas.getContext('2d');
      context.scale(2, 2);
    }

    // draw a ping on the globe at a set interval
    setInterval(this.drawPing, 1100)

    this.state.planet.projection.scale(75).translate([75, 75]);
    this.state.planet.draw(canvas);

  },

  drawPing : function() {
      var lon = this.props.location[1];
      var lat = this.props.location[0];
      this.state.planet.plugins.pings.add(lon, lat, { color: '#3887BE', ttl: 800, angle: 8 });
  },

  updateGlobeRotation : function(lon, lat) {
    var localLat = -lat;
    var localLng = -lon;
    // we do not rotate the globe latitudally more than 25 degrees
    localLat = Math.abs(localLat) > 25 ? Math.sign(localLat)*25 : localLat;
    this.state.planet.projection.rotate([localLng, localLat], 0);
  },

  render: function() {
    return (
      <div id='globe-div' style={ this.state.showGlobe ? {visibility: 'visible'} : {visibility: 'hidden'}}>
        <canvas style={{width: '150px', height: '150px', cursor: 'move'}} id='globe' width='150' height='150'></canvas>
      </div> 
    )
  }

});

module.exports = Globe;
