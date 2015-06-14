var React = require('react');

var Globe = React.createClass({

  getInitialState() {
    return {
      planet : planetaryjs.planet()
    }
  },

  componentDidMount: function() {
    
    // load the earth plugin
    this.state.planet.loadPlugin(planetaryjs.plugins.earth(
    {
      topojson: { file:   'assets/js/world-110m.json' },
      oceans:   { fill:   'RGBA(20,  39,  54, 0.85)' },
      land:     { fill:   'RGBA(86, 184, 129, 1)' },
      borders:  { stroke: 'RGBA(34,  43,  48, 1)', lineWidth: 0.35, type: 'both'}
    }));

    // load the pings plugin
    this.state.planet.loadPlugin(planetaryjs.plugins.pings());

    var canvas = document.getElementById('globe');

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
      this.state.planet.plugins.pings.add(lon, lat, { color: '#E55E5E', ttl: 1100, angle: 10 });
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
      <div id='globe-div'>
        <canvas style={{width: '150px', height: '150px'}} id='globe' width='150' height='150'></canvas>
      </div>
    );
  }
});

module.exports = Globe;
