var React = require('react');
var Modal = require('./modal');

var App = React.createClass({
  render: function() {
    return (
      <Modal />
    );
  }
});

React.render(<App />, document.getElementById('app'));
