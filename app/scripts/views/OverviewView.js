/** @jsx React.DOM */
'use strict';

var React = require('react');
var ResultModel = require('../models/ResultModel');
var NavigationModel = require('../models/NavigationModel');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            preloaded: false
        }
    },

    componentWillMount: function () {
        if (this.state.preloaded === true) return;

        ResultModel.preload(NavigationModel.getResultRoutes());
        this.setState({preloaded: true});
    },

    render: function () {
        return (
            <div className="summary-container">
                <div className="page-header"><h1>Overview</h1></div>
            </div>
        );
    }

});
