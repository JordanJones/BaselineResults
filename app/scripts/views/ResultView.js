/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');
var ResourceUsageChart = require('../components/charts/ResourceUsage');

var CPU_COLS = function () {
    return {
        x: ['x'],
        iis: [
            ['IIS Cpu #1'],
            ['IIS Cpu #2'],
            ['IIS Cpu #3']
        ],
        sql: [
            ['SqlServer Cpu #1'],
            ['SqlServer Cpu #2'],
            ['SqlServer Cpu #3']
        ]
    };
};

var MEM_COLS = function () {
    return {
        x: ['x'],
        iis: [
            ['IIS Memory #1'],
            ['IIS Memory #2'],
            ['IIS Memory #3']
        ],
        sql: [
            ['SqlServer Memory #1'],
            ['SqlServer Memory #2'],
            ['SqlServer Memory #3']
        ]
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
                <ResourceUsageChart objectId={cpuId} ref="cpuChart" />
                <ResourceUsageChart objectId={memId} ref="memChart" />
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
        var url = '/data/' + perfName + '/Results.json?bust=' + (new Date()).getTime();
        console.log('Fetching data for %s', url);
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
                    cpuData.iis[0],
                    //cpuData.iis[1],
                    //cpuData.iis[2],
                    cpuData.sql[0],
                    //cpuData.sql[1],
                    //cpuData.sql[2]
                ],
                label: name
            },
            render: true
        });
        this.refs.memChart.setState({
            data: {
                columns: [
                    memData.x,
                    memData.iis[0],
                    //memData.iis[1],
                    //memData.iis[2],
                    memData.sql[0],
                    //memData.sql[1],
                    //memData.sql[2]
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

        for (var i = 0; i < 1; i++) {
            var perfData = _.first(data.perf[i], 1800);

            _.each(perfData, function (o) {
                //if (idx > 0 && (idx % 10) != 0) return;
                //i = idx;
                var d = This._processDataSlice(o);

                if (i == 0) {
                    cpuCols.x.push(d.id);
                    memCols.x.push(d.id);
                }

                cpuCols.iis[i].push(d.iisCpu);
                memCols.iis[i].push(d.iisMem);

                cpuCols.sql[i].push(d.sqlCpu);
                memCols.sql[i].push(d.sqlMem);
            });
        }

        return {
            cpu: cpuCols,
            mem: memCols
        };
    },

    _processDataSlice: function (o) {
        return {
            id: o.id,
            iisCpu: o.iisCpu.toPrecision(2),
            sqlCpu: o.sqlCpu.toPrecision(2),
            iisMem: this._bytesToSize(o.iisMem),
            sqlMem: this._bytesToSize(o.sqlMem)
        };
    },

    _bytesToSize: function (bytes) {
        if (bytes == 0) return 0;
        var k = 1000;
        //var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3);
    }

});