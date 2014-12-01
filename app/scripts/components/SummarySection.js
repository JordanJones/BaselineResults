/** @jsx React.DOM */
'use strict';
var React = require('react');
var when = require('when');
var d3 = require('d3');
var c3 = require('c3');
var Colors = require('../models/ColorModel');

module.exports = React.createClass({

    propTypes: {
        sectionId: React.PropTypes.string.isRequired,
        heading: React.PropTypes.string.isRequired,
        items: React.PropTypes.array.isRequired,
        itemLoader: React.PropTypes.func.isRequired,
        stateLoader: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {chart: []};
    },

    componentWillMount: function () {
        this.loadState(this.props.items, this.props.itemLoader, this.props.stateLoader);
    },

    componentWillReceiveProps: function (next){
        if (this.state.chart != null && this.state.chart.destroy) {
            this.state.chart.destroy();
        }
        this.loadState(
            next.items || this.props.items,
            next.itemLoader || this.props.itemLoader,
            next.stateLoader || this.props.stateLoader
        );
    },

    componentWillUnmount: function () {
        if (this.state.chart != null && this.state.chart.destroy) {
            this.state.chart.destroy();
        }
    },

    loadState: function (items, itemLoader, stateLoader) {
        when.all(this.each(items || [], itemLoader))
            .then(ignored => stateLoader())
            .then(this.renderChart.bind(this, items));
    },

    each: function (items, itemLoader) {
        return (items || []).map(x => {
            return itemLoader(x.name, x.title);
        });
    },

    render: function () {
        var sectionId = this.props.sectionId;
        var panelId = sectionId + "-panel";
        return (
            <div id={panelId} className="panel panel-default">
                <div className="panel-heading">{this.props.heading}</div>
                <div className="panel-body">
                    <div id={sectionId}></div>
                </div>
            </div>
        );
    },

    renderChart: function (items, rawData) {
        var data = items.map(function (x) {
            return rawData[x.name];
        }.bind(this));

        var total = data.length;
        var idx = 0;

        var chart = c3.generate({
            bindto: '#' + this.props.sectionId,
            data: {
                json: data,
                type: 'bar',
                labels: true,
                keys: {
                    x: 'title',
                    value: ['value']
                },
                color: function () {
                    var i = idx++;
                    var item = (i % total);
                    return Colors[item];
                }
            },
            axis: {
                x: {
                    type: 'category',
                    height: 40
                }
            },
            tooltip: {show: false},
            legend: {show: false}
        });

        this.setState({chart: chart});
    }

});
