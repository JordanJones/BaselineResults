/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');
var ResourceUsageChart = require('../components/charts/ResourceUsage');
var ResultData = require('../models/resultData');

module.exports = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return {perfData: new ResultData({})};
    },

    componentDidMount: function () {
        this._loadDataOrUpdateCharts();
    },

    componentDidUpdate: function () {
        this._loadDataOrUpdateCharts();
    },

    _loadDataOrUpdateCharts: function () {
        var perfName = this.props.name;
        this.state.perfData.load(perfName, 'data/' + perfName + '/Results.json?bust=' + (new Date()).getTime())
            .then(_.bind(this.state.perfData.process, this.state.perfData))
            .then(this._updateReports);
    },

    render: function() {
        var cpuId = this.props.name + '-cpuChart';
        var memId = this.props.name + '-memChart';
        return (
            <div>
                <h1 className="page-header">{this.props.title}</h1>
                <ResourceUsageChart chartId={cpuId} yLabel="Percent" xLabel="Time" ref="cpuChart" />
                <ResourceUsageChart chartId={memId} yLabel="MB" xLabel="Time" ref="memChart" />
            </div>
        );
    },

    _updateReports: function (reportData) {
        var chartData = reportData.parsed;
        this.refs.cpuChart.setState({
            data: {
                columns: [
                    chartData.cpu.x,
                    chartData.cpu.iis,
                    chartData.cpu.sql
                ],
                label: chartData.name
            },
            render: true
        });
        this.refs.memChart.setState({
            data: {
                columns: [
                    chartData.mem.x,
                    chartData.mem.iis,
                    chartData.mem.sql
                ],
                label: chartData.name
            },
            render: true
        });
    }

});
