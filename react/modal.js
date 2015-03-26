var React = require('react');
var util = require('./util');

util.getCookie('settings', function(set) {
  console.log(set)
});

var Modal = React.createClass({

  getInitialState: function(e) {
    return {
        'userLoc': false,
        'lastpos': false,
        'random': true
    };
  },

  componentDidMount: function(e) {
    var self = this;
    util.getCookie('settings', function(set) {
      self.setState(set);
      console.log(self)
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var data = [];
    for (var key in this.refs) {
      if (this.refs.hasOwnProperty(key)) {
        console.log(this.refs[key].props)
        if(this.refs[key].props.checked) {
          data.push(key);
        }
      }
    }
  },

  handleChange: function(e) {

  },

  render: function() {
    return (
      <div className='modal pad4 fill-white keyline-all round' id='settings'>
        <a href='#' className='pin-right icon close pad1 row1 quiet' id='close'></a>
        <h3 className='space-bottom2'>Settings</h3>
        <form id='form-settings' onSubmit={this.handleSubmit}>
          <fieldset>
            <label>Initial Position</label>
            <div className='radio-pill pill clearfix col12'>
              <input type='radio' className='stroked' name='loc' value='userLoc' id='userLoc' checked={this.state.userLoc} />
              <label htmlFor='userLoc' className='col4 button icon check'>User location</label>
              <input type='radio' name='loc' className='stroked' value='lastPos' id='lastPos' checked={this.state.lastPos} />
              <label htmlFor='lastPos' className='col4 button icon check'>Last Position</label>
              <input type='radio' name='loc' value='random' id='random' checked={this.state.random} />
              <label htmlFor='random' className='col4 button icon check'>Random</label>
            </div>
          </fieldset>
          <fieldset>
            <label>Map Type</label>
            <div id='layers' className='radio-pill pill clearfix col12'>
              <input type='radio' ref='sat' name='map' value='sat' id='sat'/>
              <label htmlFor='sat' className='col3 button icon check'>Satellite</label>
              <input type='radio' ref='streets' name='map' value='streets' id='streets'/>
              <label htmlFor='streets' className='col3 button icon check'>Streets</label>
              <input type='radio' ref='random-map' name='map' value='random-map' id='random-map'/>
              <label htmlFor='random-map' className='col3 button icon check'>Random</label>
              <input type='radio' ref='custom' name='map' value='custom' id='custom'/>
              <label htmlFor='custom' className='col3 button icon check'>Custom</label>
            </div>
          </fieldset>
          <fieldset>
            <label htmlFor='custom-mapid' className='quiet'>Custom <a href='https://mapbox.com' target='_blank'>Mapbox</a> mapid or <a id='save-current' href='#'>save current</a>
            </label>
            <input type='text' value='' className='col6' name='custom-mapid' id='custom-mapid' disabled placeholder="Enable 'Custom' to edit" />
          </fieldset>
          <input type='submit' className='fl' value='Save Changes' name='' id='save' />
          <span className='fr micro quiet pad1y icon mail'>
            <a href='https://chrome.google.com/webstore/detail/maptab/dmabflbokojjfjicmbjjfnmodihciemo' className='quiet space-right1' target='_blank'>Share</a>
            <a href='https://github.com/bsudekum/MapTab' target='_blank' className='icon github quiet'>Fork</a>
          </span>
        </form>
      </div>
    );
  }
});

module.exports = Modal;