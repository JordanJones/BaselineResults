/** @jsx React.DOM */
'use strict';

var React = require('react');
var c3 = require('c3');

module.exports = React.createClass({

    propTypes: {
        data: React.PropTypes.array.isRequired
    },

    getInitialState: function () {
        return {
            cahrt: null
        }
    },

    componentWillReceiveProps: function (props) {
        if (this.state.chart != null) {
            this.state.chart.destroy();
        }
    },

    componentWillUnmount: function () {
        if (this.state.chart != null) {
            this.state.chart.destroy();
        }
    }

});
