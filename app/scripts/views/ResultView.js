/** @jsx React.DOM */
var React = require('react');
var ResourceUsageChart = require('../components/charts/ResourceUsage');
var PerformanceResult = require('../components/PerformanceResult');
var ResultDataStore = require('../models/resultData');

module.exports = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return ResultDataStore.getState();
    },

    componentWillMount: function () {
        this.setStateWithName(this.props.name);
    },

    componentWillReceiveProps: function (next){
        this.setStateWithName(next.name);
    },

    setStateWithName: function (name) {
        ResultDataStore.getAsyncState(name)
            .then(this.setState.bind(this));
    },

    render: function() {
        var cpuId = this.props.name + '-cpuChart';
        var memId = this.props.name + '-memChart';
        return (
            <div>
                <h1 className="page-header">{this.props.title}</h1>
                <div className="performanceSection">
                    <PerformanceResult
                        data={this.state.data}
                    />
                </div>
                <div header="Cpu Graph" className="performanceSection">
                    <ResourceUsageChart chartId={cpuId}
                        data={this.state.data.cpu}
                        yLabel="Percent"
                        xLabel="Time"/>
                </div>
                <div header="Memory Graph"className="performanceSection">
                    <ResourceUsageChart chartId={memId}
                        data={this.state.data.mem}
                        yLabel="MB"
                        xLabel="Time"/>
                </div>
            </div>
        );
    }

});
