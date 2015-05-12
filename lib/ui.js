var React = require('react');
var Map = require('./map');
var Modal = require('./modal');
var util = require('./util');
var mapids = require('./mapids');
var today = new Date();
var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

var UI = React.createClass({


  getInitialState: function() {
    return {
      time: 0,
      date: 0,
      showModal: true,
      geocodeResult: ''
    }
  },

  componentDidMount: function() {
    var self = this;

    this.setState({ date: today.toLocaleDateString('en-us', options) });

    (function startTime() {
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
      self.setState({time: h + ':' + m + ' ' + ampm});
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

  },

  toggleModal: function() {
    document.getElementById('settings').classList.toggle('active');
  },

  handleGeocode: function(geocode) {
    this.setState({geocodeResult: geocode });
  },

  render: function() {
    var index = Math.floor(Math.random() * mapids.length - 1) + 1;
    return (
      <div>
        <a href='#' id='show-settings' className='icon sprocket pin-right pad2 row2' onClick={this.toggleModal}></a>
        <div className='vingette fancy'>
          <div className='info shadow color'>
            <h1 className='fancy space-bottom2 shadow3'>{this.state.time}</h1>
            <h2 className='shadow3 pad2'>{this.state.date}</h2>
          </div>
          <div className='pin-bottom center pad4y dark pad4 color'>
            <h3 className='center'>{this.state.geocodeResult}</h3>
          </div>
        </div>
        <Map onGeocode={this.handleGeocode} radomMapid={mapids[index].id} />
        <Modal radomMapId={mapids[index].id} />
      </div>
    )
  }

});


module.exports = UI;
