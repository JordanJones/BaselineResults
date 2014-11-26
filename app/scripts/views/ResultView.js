/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('react-router');

var ResultDataView = require('./ResultDataView');

module.exports = React.createClass({

    mixins: [Router.State],

    render: function() {
        var params = this.getParams();
        return (<ResultDataView title={params.title} name={params.name} />);
    }

});
