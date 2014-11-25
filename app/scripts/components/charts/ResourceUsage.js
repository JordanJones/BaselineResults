/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');
var c3 = require('c3');

module.exports = React.createClass({

    _chart: null,

    propTypes: {
        data: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string
        ]),
        chart: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            data: [],
            chart: {destroy: function () {}}
        };
    },

    componentDidMount: function () {
        if (this.isMounted()) {
            this._loadDataOrRenderGraphic();
        }
    },

    componentDidUpdate: function() {
        if (this._chart && this._chart.destroy) {
            this._chart.destroy();
        }
        this._loadDataOrRenderGraphic();
    },

    render: function() {
        return (
            <div id="chart" className="resourceChart">
            </div>
        );
    },

    _loadDataOrRenderGraphic: function() {

        var data = this.props.data;

        if (!_.isArray(data)) {
            var This = this;
            d3.json('/data/' + data + '/Results.json', function (data) {
                var perfData = [];
                if (data == null) {
                    perfData = testData();
                }
                else {
                    perfData = _.map(data.summary.perf, function (o) {
                        return {
                            id: o.id,
                            x: o.id,
                            y: o.iisCpu,
                            sql: o.sqlCpu
                        };
                    });
                }
                This._renderGraphic(perfData);
            });
            //data = testData();
        }
        else {
            this._renderGraphic(data);
        }
    },

    _renderGraphic: function (data) {

        var columns = [
            ['x'],
            ['IIS Cpu'],
            ['SQL Cpu']
        ];
        _.each(data, function (o, idx) {
            if (idx > 0 && (idx % 5) != 0) return;
            columns[0].push(o.x)
            columns[1].push(o.y)
            columns[2].push(o.sql)
        });

        this._chart = c3.generate({
            bindTo: '#resourceChart',
            data: {
                x: 'x',
                columns: columns,
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
    }

});
