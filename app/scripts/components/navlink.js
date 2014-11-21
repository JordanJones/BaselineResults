/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var _ = require('underscore');

module.exports = React.createClass({

    mixins: [ ActiveState ],

    render: function () {
        var isActive = this.isActive(this.props.to, this.props.params, this.props.query);
        var className = isActive ? 'active' : '';

        var link = Link(_.extend(this.props, {activeClassName: ''}));

        return (
            <li className={className}>{link}</li>
        );
    }

});

