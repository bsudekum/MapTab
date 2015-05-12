var React = require('react');
var util = require('./util');
var mapids = require('./mapids');


var Modal = React.createClass({

  getInitialState: function(e) {
    return {
      locationSettings: [{
        checked: false,
        id: 'userLoc',
        name: 'User'
      }, {
        checked: false,
        id: 'lastPos',
        name: 'Last'
      }, {
        checked: true,
        id: 'random',
        name: 'Random'
      }],
      mapSettings: [{
        checked: false,
        id: 'sat',
        name: 'Satellite'
      }, {
        checked: false,
        id: 'street',
        name: 'Street'
      }, {
        checked: true,
        id: 'randomMap',
        name: 'Random'
      }, {
        checked: false,
        id: 'customMap',
        name: 'Custom'
      }],
      showModal: false,
      customMapId: '',
      disabled: true
    };
  },

  componentDidMount: function(e) {
    util.getCookie('settings', (values) => {
      if (this.isMounted() && values) {
        this.setState(values);
      }
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({ disabled: true });
    var self = this
    setTimeout(function(){ // race condition
      util.setCookie('settings', null, self.state);
      location.reload();
    }, 50);
  },

  handleChangeMap: function(id) {
    var mapSettings = this.state.mapSettings.map(function(d) {
      return {
        id: d.id,
        checked: (d.id === id ? true : false),
        name: d.name
      };
    });
    this.setState({
      mapSettings: mapSettings,
      disabled: false
    });
  },

  handleChangeLocation: function(id) {
    var locationSettings = this.state.locationSettings.map(function(d) {
      return {
        id: d.id,
        checked: (d.id === id ? true : false),
        name: d.name
      };
    });
    this.setState({
      locationSettings: locationSettings,
      disabled: false
    });
  },

  handleSaveCurrent: function(e, d) {
    var id = 'customMap';
    var mapSettings = this.state.mapSettings.map(function(d) {
      return {
        id: d.id,
        checked: (d.id === id ? true : false),
        name: d.name
      };
    });
    this.setState({
      mapSettings: mapSettings,
      disabled: false,
      customMapId: this.refs.customMapId.getDOMNode().value
    });
  },

  toggleModal: function(e) {
    document.getElementById('settings').classList.toggle('active');
  },

  render: function() {
    return (
      <div className='modal pad4 fill-white keyline-all round' id='settings'>
        <a href='#' className='pin-right icon close pad1 row1 quiet' id='close' onClick={this.toggleModal}></a>
        <h3 className='space-bottom2'>Settings</h3>
        <form id='form-settings' onSubmit={this.handleSubmit}>
          <fieldset name='loc'>
            <label>Initial Position</label>
            <div className='radio-pill pill clearfix col12' name='locationSettings'>
              {this.state.locationSettings.map(item => {
                return <span key={item.id}>
                <input type='radio' name='locationSettings' value={item.id} id={item.id} checked={item.checked} onChange={this.handleChangeLocation.bind(this, item.id)} />
                <label htmlFor={item.id} className='col4 button icon check'>{item.name}</label>
                </span>
              })}
            </div>
          </fieldset>
          <fieldset  name='map'>
            <label>Map Type</label>
            <div className='radio-pill pill clearfix col12' name='map'>
              {this.state.mapSettings.map(item => {
                return <span key={item.id}><input type='radio' name='map' value={item.id} id={item.id} checked={item.checked} onChange={this.handleChangeMap.bind(this, item.id)} /><label htmlFor={item.id} className='col3 button icon check'>{item.name}</label></span>
              })}
            </div>
          </fieldset>
          <fieldset>
            <label htmlFor='custom-mapid' className='quiet'>Custom <a href='https://mapbox.com' target='_blank'>Mapbox</a> mapid or <a id='save-current' href='#' onClick={this.handleSaveCurrent}>save current</a>
            </label>
            <input type='text' defaultValue={this.props.randomMapId} className='col6' name='custom-mapid' ref='customMapId' disabled placeholder="Enable 'Custom' to edit" />
          </fieldset>
          <input type='submit' className='fl' defaultValue='Save Changes' name='' id='save' disabled={this.state.disabled} />
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