/** @jsx React.DOM */

var React = require('react');

var lineChart = require('./types/line');

module.exports = React.createClass({

    propTypes: {
        data: React.PropTypes.array,
        domain: React.PropTypes.object
    },

    componentDidMount: function() {
        var el = this.getDOMNode();
        lineChart.create(
            el,
            {
                width: '100%',
                height: 300
            },
            this.getChartState()
        );
    },

    componentDidUpdate: function() {
        var el = this.getDOMNode();
        lineChart.update(el, this.getChartState());
    },

    getChartState: function () {
        return {
            data: this.props.data,
            domain: this.props.domain
        };
    },

    componentWillUnmount: function() {
        var el = this.getDOMNode();
        lineChart.destroy(el);
    },

    render: function() {
        return (
            <div className="resourceChart"></div>
        );
    }

});
