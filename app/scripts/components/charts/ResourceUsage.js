/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');
var c3 = require('c3');

var chartCache = {};

module.exports = React.createClass({

    getInitialState: function () {
        return {
            data: null
        };
    },

    componentDidUpdate: function (prevProps, prevState) {
        this._renderGraphic();
    },

    componentWillUnmount: function () {
        this._tryClearCache();
    },

    render: function() {
        return (
            <div id={this.props.objectId} className="resourceChart"></div>
        );
    },

    _tryClearCache: function () {
        var id = this.props.objectId;

        if (chartCache[id] && chartCache[id].destroy) {
            chartCache[id].destroy();
        }
        return id;
    },

    _renderGraphic: function () {
        var id = this._tryClearCache();
        var chart = c3.generate({
            data: {
                x: 'x',
                columns: this.state.data,
                type: 'spline'
            },
            point: {
                show: false
            },
            subchart: {
                show: false
            },
            zoom: {
                enabled: true
            },
            axis: {
                x: {
                    show: false
                }
            }
        });

        $(this.getDOMNode()).empty().append(chart.element);
        chartCache[id] = chart;
    }

});
