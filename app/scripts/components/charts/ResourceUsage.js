/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');
var c3 = require('c3');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            data: null,
            chart: null,
            render: true
        };
    },

    componentWillUpdate: function (nextProps, nextState) {
        if (this.state.chart != null && nextState.render) {
            this.state.chart.destroy();
        }
    },

    componentDidUpdate: function () {
        if (this.state.render && _.isObject(this.state.data) && _.isArray(this.state.data.columns)) {
            this._renderGraphic();
        }
    },

    componentWillUnmount: function () {
        if (this.state.chart != null) {
            this.state.chart.destroy();
        }
    },

    render: function() {
        return (<div id={this.props.objectId} className="resourceChart"></div>);
    },

    _renderGraphic: function () {
        var chart = c3.generate({
            axis: {
                x: {
                    label: 'Seconds',
                    show: true,
                    tick: {
                        fit: false
                    }
                }
            },
            bindto: '#' + this.props.objectId,
            data: {
                x: 'x',
                columns: this.state.data.columns,
                type: 'spline'
            },
            grid: {
                x: {
                    lines: false,
                    show: false
                }
            },
            point: {
                show: false
            },
            subchart: {
                show: false
            },
            tooltip: {
                show: true
            },
            zoom: {
                enabled: false
            }
        });

        this.setState({chart: chart, render: false});
    }

});
