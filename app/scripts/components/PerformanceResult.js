/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({

    getDefaultProps: function() {
        return {
            data: {requests: 0}
        };
    },

    render: function() {
        return (
            <div className="well well-sm">
                <h1 className="text-center">{this.props.data.requests} <small>requests per second</small></h1>
            </div>
        );
    }

});
