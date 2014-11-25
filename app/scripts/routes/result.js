/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');

var View = require('../views/ResultView');

module.exports = React.createClass({

    mixins: [Router.State],

    render: function() {
        var params = this.getParams();
        return (<View title={params.title} name={params.name} />);
    }

});
