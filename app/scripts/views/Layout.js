/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('react-router');
var {RouteHandler, Navigation} = Router;
var NavigationModel = require('../models/NavigationModel');
var NavigationBar = require('../components/NavigationBar');

var App = React.createClass({

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
            <div className="row">
                <NavigationBar categories={NavigationModel.routes} />
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <RouteHandler />
                </div>
            </div>
        );
    }

});

module.exports = App;
