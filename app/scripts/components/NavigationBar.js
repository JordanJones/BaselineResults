/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('react-router');
var CategoryNav = require('../components/CategoryNav');

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
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-pills nav-stacked">
                    {this.props.categories.map(this.renderItem)}
                </ul>
            </div>
        );
    }
});
