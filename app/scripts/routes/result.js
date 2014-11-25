/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');

var ResourceUsageChart = require('../components/charts/ResourceUsage');

module.exports = React.createClass({

    mixins: [Router.State],

    render: function() {
        var params = this.getParams();
        return (
            <div>
                <h1 className="page-header">{params.title}</h1>
                <ResourceUsageChart data={params.name} />
            </div>
        );
    }

});
