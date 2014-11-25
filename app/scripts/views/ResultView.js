/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');
var ResourceUsageChart = require('../components/charts/ResourceUsage');

var CPU_COLS = function () {
    return {
        x: ['x'],
        iis: ['IIS Cpu'],
        sql: ['SqlServer Cpu']
    };
};

var MEM_COLS = function () {
    return {
        x: ['x'],
        iis: ['IIS Memory'],
        sql: ['SqlServer Memory']
    };
};

module.exports = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return {perfData: {}};
    },

    componentDidMount: function () {
        this._loadDataOrUpdateCharts();
    },

    componentDidUpdate: function () {
        this._loadDataOrUpdateCharts();
    },

    _loadDataOrUpdateCharts: function () {
        var perfName = this.props.name;
        if (this.state.perfData[perfName]) {
            var perfData = this.state.perfData;
            if (perfData[perfName] && perfData[perfName].parsed && perfData[perfName].parsed.cpu && perfData[perfName].parsed.mem) {
                this._updateCharts(perfData[perfName].original.name, perfData[perfName].parsed.cpu, perfData[perfName].parsed.mem);
            }
            else {
                perfData[perfName].parsed = this._processPerfData(perfData[perfName].original);
                this._setPerfData(perfData);
            }
        }
        else {
            this._loadPerfData();
        }
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

    _setPerfData: function(data) {
        var initialData = this.getInitialState();
        initialData.perfData = data;
        this.setState(initialData);
    },

    _loadPerfData: function () {
        var perfName = this.props.name;
        var This = this;
        var url = 'data/' + perfName + '/Results.json?bust=' + (new Date()).getTime();
        $.get(url, function (data) {
            if (data == null) {
                return;
            }
            var perfData = This.state.perfData;
            perfData[perfName] = {
                original: data,
                parsed: null
            };
            This._setPerfData(perfData);
        })
            .fail(function () {});
    },

    _updateCharts: function (name, cpuData, memData) {
        this.refs.cpuChart.setState({
            data: {
                columns: [
                    cpuData.x,
                    cpuData.iis,
                    cpuData.sql
                ],
                label: name
            },
            render: true
        });
        this.refs.memChart.setState({
            data: {
                columns: [
                    memData.x,
                    memData.iis,
                    memData.sql
                ],
                label: name
            },
            render: true
        });
    },

    _processPerfData: function (data) {
        var cpuCols = CPU_COLS();
        var memCols = MEM_COLS();

        var This = this;

        var perfData = data.summary.perf;

        _.each(perfData, function (o) {
            var d = This._processDataSlice(o);

            var id = d.id;
            cpuCols.x.push(id);
            memCols.x.push(id);

            cpuCols.iis.push(d.iisCpu);
            memCols.iis.push(d.iisMem);

            cpuCols.sql.push(d.sqlCpu);
            memCols.sql.push(d.sqlMem);
        });

        return {
            cpu: cpuCols,
            mem: memCols
        };
    },

    _processDataSlice: function (o) {
        return {
            id: o.id,
            iisCpu: o.iisCpu.toPrecision(3),
            sqlCpu: o.sqlCpu.toPrecision(3),
            iisMem: this._bytesToSize(o.iisMem),
            sqlMem: this._bytesToSize(o.sqlMem)
        };
    },

    _bytesToSize: function (bytes) {
        if (bytes == 0) return bytes;
        var k = 1024;
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(5);
        //return bytes;
    }

});
