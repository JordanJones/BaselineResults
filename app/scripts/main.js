/** @jsx React.DOM */

var React = window.React = require('react');
var Router = require('react-router');
var routes = require('./routes');
var Chart = require('chartjs');

Router.run(routes, function (Handler) {
    //Chart.defaults.global.responsive = true;

    React.render(<Handler />, document.getElementById('app-host'));
});
