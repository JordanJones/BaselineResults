/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({

    propTypes: {
        text: React.PropTypes.string.isRequired,
        iis: React.PropTypes.string.isRequired,
        sql: React.PropTypes.string.isRequired
    },

    render: function () {
        return (
            <div className="panel-heading">{this.props.text} - Average IIS: <strong>{this.props.iis}</strong>, Average SQL Server: <strong>{this.props.sql}</strong></div>
        );
    }

});
