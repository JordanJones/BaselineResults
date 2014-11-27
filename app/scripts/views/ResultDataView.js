/** @jsx React.DOM */
'use strict';
var React = require('react');
var ResourceUsageChart = require('../components/ResourceUsageChart');
var PerformanceResult = require('../components/PerformanceResult');
var ResultModel = require('../models/ResultModel');

module.exports = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return ResultModel.getState();
    },

    componentWillMount: function () {
        this.setStateWithName(this.props.name);
    },

    componentWillReceiveProps: function (next){
        this.setStateWithName(next.name);
    },

    setStateWithName: function (name) {
        ResultModel.getAsyncState(name)
            .then(this.setState.bind(this));
    },

    render: function() {
        var cpuId = this.props.name + '-cpuChart';
        var memId = this.props.name + '-memChart';
        return (
            <div>
                <div className="page-header">
                    <h1>{this.props.title}</h1>
                </div>
                <PerformanceResult
                    data={this.state.summary} />

                <ResourceUsageChart
                    heading="Cpu Graph"
                    chartId={cpuId}
                    data={this.state.cpu}
                    yLabel="Percent"
                    xLabel="Time"/>

                <ResourceUsageChart
                    heading="Memory Graph"
                    chartId={memId}
                    data={this.state.mem}
                    yLabel="MB"
                    xLabel="Time"/>
            </div>
        );
    }

});
