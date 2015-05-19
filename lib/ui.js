var React = require('react');
var Map = require('./map');
var Modal = require('./modal');
var util = require('./util');
var mapids = require('./mapids');
var Keybinding = require('react-keybinding');
var today = new Date();
var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

var UI = React.createClass({
  mixins: [Keybinding],
  getInitialState: function() {
    return {
      time: 0,
      date: 0,
      showModal: true,
      geocodeResult: '',
      mapid: mapids[(Math.floor(Math.random() * mapids.length - 1) + 1)].id
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

  keybindings: {
    '⌘A': function() {
      chrome.tabs.update({ url: 'chrome://apps/' });
    },
    '⌘B': function() {
      chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' });
    }
  },

  toggleModal: function() {
    document.getElementById('settings').classList.toggle('active');
  },

  handleGeocode: function(geocode) {
    this.setState({geocodeResult: geocode });
  },

  handleOpenApp() {
    chrome.tabs.update({ url: 'chrome://apps/' });
  },

  handleOpenDefault() {
    chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' });
  },

  render: function() {
    return (
      <div>
        <a href='#' id='show-settings' className='icon sprocket pin-right pad2 zIndex row2 quiet' onClick={this.toggleModal}></a>
        <div className='pin-left pad2 zIndex row2'>
          <a href='#' title='View Chrome app tab. Or press ⌘A.' className='icon menu quiet' onClick={this.handleOpenApp}></a>
          <a href='#' title='View default Chrome tab.  Or press ⌘B.' className='icon bookmark quiet' onClick={this.handleOpenDefault}></a>
        </div>
        <div className='vingette fancy'>
          <div className='info shadow color'>
            <h1 className='fancy space-bottom2 shadow3'>{this.state.time}</h1>
            <h2 className='shadow3 pad2'>{this.state.date}</h2>
          </div>
          <div className='pin-bottom center pad4y dark pad4 color'>
            <h3 className='center shadow3'>{this.state.geocodeResult}</h3>
          </div>
        </div>
        <Map onGeocode={this.handleGeocode} randomMapId={this.state.mapid} />
        <Modal randomMapId={this.state.mapid} />
      </div>
    )
  }

});


module.exports = UI;
