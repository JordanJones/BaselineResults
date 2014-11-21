/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');

module.exports = React.createClass({

    propTypes: {
        data: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string
        ])
    },

    getDefaultProps: function () {
        return {
            data: []
        };
    },

    componentDidMount: function () {
        if (this.isMounted()) {
            this._loadDataOrRenderGraphic();
        }
    },

    componentDidUpdate: function() {
        this._loadDataOrRenderGraphic();
    },

    render: function() {
        return (
            <div className="resourceChart"></div>
        );
    },

    _loadDataOrRenderGraphic: function() {

        var data = this.props.data;

        if (!_.isArray(data))
        {
            data = testData();
        }

        this._renderGraphic(data);
    },

    _renderGraphic: function (data) {
        var opts = {
            animate_on_load: true,
            area: false,
            data: data,
            width: 600,
            height: 480,
            target: '.resourceChart',
            y_accessor: 'y',
            x_accessor: 'x',
            x_rug: false,
            min_y: _.chain(data).pluck('y').min().value(),
            max_y: _.chain(data).pluck('y').max().value(),
            y_extended_ticks: true
        };
        data_graphic(opts);
    }

});

function testData()
{
    var y = d3.random.irwinHall(100);
    var results = [];
    for (var i = 0; i < 75; i++) {
        results[i] = {
            id: i + '_' + y(),
            x: i + 1,
            y: y()
        };
    }
    return results;
}
