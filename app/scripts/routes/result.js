/** @jsx React.DOM */

var React = require('react');

var ResourceUsageChart = require('../components/charts/ResourceUsage');

var d3 = require('d3');

module.exports = React.createClass({

    render: function() {
        return (
            <div>
                <h1 className="page-header">{this.props.params.resultName}</h1>
                <ResourceUsageChart data={this.props.params.resultName} />
            </div>
        );
    }

});
