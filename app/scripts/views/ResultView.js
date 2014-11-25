/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');
var ResourceUsageChart = require('../components/charts/ResourceUsage');

//var CPU_COLS = [
//    ['x'],
//    ['IIS Cpu #1'],
//    ['IIS Cpu #2'],
//    ['IIS Cpu #3'],
//    ['SqlServer Cpu #1'],
//    ['SqlServer Cpu #2'],
//    ['SqlServer Cpu #3']
//];
var CPU_COLS = {
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

var MEM_COLS = {
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

//var MEM_COLS = [
//    ['x'],
//    ['IIS Memory #1'],
//    ['IIS Memory #2'],
//    ['IIS Memory #3'],
//    ['SqlServer Memory #1'],
//    ['SqlServer Memory #2'],
//    ['SqlServer Memory #3']
//];

module.exports = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    },

    componentDidMount: function () {
        this._loadPerfData();
    },

    componentDidUpdate: function () {
        this._loadPerfData();
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

    _loadPerfData: function () {
        var This = this;
        $.get('/data/' + this.props.name + '/Results.json?bust=' + (new Date()).getTime(), This._onPerfData)
            .fail(function () {This._onPerfData(null)});
    },

    _onPerfData: function (data) {
        var cpuCols = _.clone(CPU_COLS);
        var memCols = _.clone(MEM_COLS);

        if (data != null) {
            var This = this;

            for (var i = 0; i < 1; i++) {
                var perfData = _.first(data.perf[i], 230);

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
            //if (i < (perfData.length - 2)) {
            //    var d = this._processDataSlice(perfData[perfData.length - 1]);
            //    cpuCols[0].push(d.id);
            //    memCols[0].push(d.id);
            //
            //    cpuCols[1].push(d.iisCpu);
            //    cpuCols[2].push(d.sqlCpu);
            //    memCols[1].push(d.iisMem);
            //    memCols[2].push(d.sqlMem);
            //}
        }

        this.refs.cpuChart.replaceState({data: [
            cpuCols.x,
            cpuCols.iis[0],
            //cpuCols.iis[1],
            //cpuCols.iis[2],
            cpuCols.sql[0],
            //cpuCols.sql[1],
            //cpuCols.sql[2]
        ]});
        this.refs.memChart.replaceState({data: [
            memCols.x,
            memCols.iis[0],
            //memCols.iis[1],
            //memCols.iis[2],
            memCols.sql[0],
            //memCols.sql[1],
            //memCols.sql[2]
        ]});
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
