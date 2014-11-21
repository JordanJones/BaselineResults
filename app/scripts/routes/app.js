/** @jsx React.DOM */

var React = require('react');
var NavLink = require('../components/navlink');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-sm-3 col-md-2 sidebar">
                    <ul className="nav nav-sidebar">
                        <NavLink to="overview">Overview</NavLink>
                    </ul>
                    <ul className="nav nav-sidebar">
                        <NavLink to="result" params={{resultName: "blah"}}>Blah</NavLink>
                        <NavLink to="result" params={{resultName: "foo"}}>Foo</NavLink>
                        <NavLink to="result" params={{resultName: "bar"}}>Bar</NavLink>
                    </ul>
                    <ul className="nav nav-sidebar">
                        <NavLink to="summary">Summary</NavLink>
                    </ul>
                </div>
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <this.props.activeRouteHandler />
                </div>
            </div>
        );
    }
});
