/** @jsx React.DOM */

var React = window.React = require('react');
var Router = require('react-router');
var routes = require('./routes');

Router.run(routes, function (Handler) {
    React.render(<Handler />, document.getElementById('app-host'));
});
