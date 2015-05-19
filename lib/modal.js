var React = require('react');
var util = require('./util');
var mapids = require('./mapids');


var Modal = React.createClass({

  getInitialState() {
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

  componentDidMount() {
    util.getCookie('settings', (values) => {
      if (this.isMounted() && values) {
        this.setState(values);
        if(values.customMapId) this.setState({customMapId: values.customMapId})
      }
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.state.mapSettings.map((d) => {
      if (d.id === 'customMap' && !d.checked) this.setState({customMapId: null });
    });
    var self = this
    setTimeout(function(){ // race condition
      util.setCookie('settings', null, self.state);
      location.reload();
    }, 200);
  },

  handleChangeMap(id) {
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

  handleChangeLocation(id) {
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

  handleCustomChange(e) {
    this.setState({
      customMapId: e.target.value,
      disabled: false
    });
  },

  handleOnClick() {
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
      disabled: false
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
            <label htmlFor='custom-mapid' className='quiet'>Custom <a href='https://mapbox.com' target='_blank'>Mapbox</a> mapid</label>
            <input type='text' value={this.state.customMapId} className='col6' onChange={this.handleCustomChange} onClick={this.handleOnClick} placeholder='Custom Map ID' />
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
