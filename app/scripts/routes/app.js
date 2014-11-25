/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var {Route, RouteHandler} = Router;
var CategoryNav = require('../components/categorynav');
var data = require('../models/navigationData');

var Sidebar = React.createClass({

    mixins: [Router.State],

    renderItem: function(item, idx) {
        var itemProps = {
            name: item.name,
            title: item.title
        };

        var isActive = this.isActive(
            item.route,
            item.route === 'Result' ? itemProps : null,
            null);

        return <CategoryNav
            key={idx}
            defaultIsActive={isActive}
            params={itemProps}
            route={item.route}
            title={itemProps.title}
            />;
    },

    render: function () {
        return (
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar">
                    {this.props.categories.map(this.renderItem)}
                </ul>
            </div>
        );
    }
});

var App = React.createClass({

    render: function () {
        return (
            <div className="row">
                <Sidebar categories={data} />
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <RouteHandler />
                </div>
            </div>
        );
    }

});

module.exports = App;
