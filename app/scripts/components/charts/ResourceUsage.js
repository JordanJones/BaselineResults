/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');
var c3 = require('c3');
var Chart = require('chartjs');

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
        //var chart = c3.generate({
        //    axis: {
        //        x: {
        //            show: false
        //        }
        //    },
        //    bindto: '#' + this.props.objectId,
        //    data: {
        //        x: 'x',
        //        columns: this.state.data.columns,
        //        type: 'spline'
        //    },
        //    point: {
        //        show: false
        //    },
        //    subchart: {
        //        show: false
        //    },
        //    tooltip: {
        //        show: false
        //    },
        //    zoom: {
        //        enabled: false
        //    }
        //});

        //var data = {
        //    labels: _.rest(this.state.data.columns[0]),
        //    datasets: [
        //        {
        //            label: _.first(this.state.data.columns[1]),
        //            data: _.rest(this.state.data.columns[1])
        //        }
        //    ]
        //};
        //
        //console.log ('Data: %o', data);
        //
        //var ctx = document.getElementById(this.props.objectId).getContext('2d');
        //var chart = new Chart(ctx).Line(data, {pointDot: false, datasetFill: false});

        var data = {
            type: 'line',
            series: [
                {
                    //label: _.first(this.state.data.columns[1]),
                    values: _.rest(this.state.data.columns[1])
                },
                {
                    //label: _.first(this.state.data.columns[2]),
                    values: _.rest(this.state.data.columns[2])
                }
            ]
        };

        //$('#' + this.props.objectId).kendoChart({
        //    //categoryAxis: {
        //    //    categories: _.rest(this.state.data.columns[0]),
        //    //    majorGridLines: {
        //    //        visible: false
        //    //    },
        //    //    majorTicks: {
        //    //        visible: false
        //    //    }
        //    //},
        //    legend: {
        //        position: "bottom",
        //        visible: true
        //    },
        //    seriesDefaults: {
        //        type: 'line',
        //        style: 'smooth',
        //        markers: {
        //            visible: false
        //        }
        //    },
        //    series: data,
        //    tooltip: {
        //        visible: true
        //    }
        //});

        //this.setState({chart: chart, render: false});
    }

});
