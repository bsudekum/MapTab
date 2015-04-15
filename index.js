var React = require('react');
var UI = require('./lib/ui');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <UI/>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
