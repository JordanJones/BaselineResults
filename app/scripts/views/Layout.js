/** @jsx React.DOM */
'use strict';

var $ = require('jquery');

var React = require('react');
var Router = require('react-router');
var {RouteHandler, Navigation} = Router;
var NavigationModel = require('../models/NavigationModel');
var NavigationBar = require('../components/NavigationBar');

module.exports = React.createClass({

    mixins: [Navigation],

    componentDidMount: function () {
        $(document.body).on('click', '#project-link', this.routeToApp);
    },

    componentWillUnmount: function () {
        $(document.body).off('click', '#project-link');
    },

    routeToApp: function () {
        this.transitionTo(NavigationModel.baseName);
    },

    render: function () {
        return (
            <div id="app-host">
                <NavigationBar categories={NavigationModel.routes} />
                <div className="container-fluid">
                    <RouteHandler />
                </div>
            </div>
        );
    }

});
