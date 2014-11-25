/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var { Route, Link } = Router;

module.exports = React.createClass({

    getInitialState: function () {
        return { isActive: this.props.defaultIsActive };
    },

    getDefaultProps: function() {
        return {isActive: false};
    },

    componentWillReceiveProps: function(newProps) {
        if (this.state.isActive != newProps.defaultIsActive) {
            this.setState({isActive: newProps.defaultIsActive});
        }
    },


    buildClassName: function () {
        var className = 'nav-item-' + this.props.params.name;
        if (this.state.isActive) {
            className += ' active';
        }
        return className;
    },

    render: function () {
        return (
            <li className={this.buildClassName()}>
                <Link to={this.props.route}
                    params={this.props.params}>{this.props.title}</Link>
            </li>
        );
    }

});
