/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var CategoryNav = require('../components/CategoryNav');
var NavigationModel = require('../models/NavigationModel');
require('jasny-bootstrap');

module.exports = React.createClass({

    mixins: [Router.State],

    renderItem: function(item, idx) {
        var itemProps = {
            name: item.name,
            title: item.title
        };

        var route = item.route;
        var isActive = this.isActive(
            route,
            route === 'Result' ? itemProps : null,
            null);

        return <CategoryNav
            key={idx}
            defaultIsActive={isActive}
            params={itemProps}
            route={route}
            title={itemProps.title}
        />;
    },

    render: function () {
        return (
            <div className="clearfix">
                <nav id="app-nav" className="navmenu navmenu-inverse navmenu-fixed-left offcanvas-sm" role="navigation">
                    <Link to={NavigationModel.baseName} className="navmenu-brand visible-md visible-lg">Baseline Results</Link>
                    <ul className="nav navmenu-nav">
                            {this.props.categories.map(this.renderItem)}
                    </ul>
                </nav>

                <div className="navbar navbar-inverse navbar-fixed-top hidden-md hidden-lg">
                    <button type="button" className="navbar-toggle" data-toggle="offcanvas" data-target="#app-nav">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link to={NavigationModel.baseName} className="navbar-brand">Baseline Results</Link>
                </div>
            </div>
        );
    }
});
