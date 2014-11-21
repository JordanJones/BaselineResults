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
                        <NavLink to="result" params={{resultName: "WebApiSqlClient"}}>WebApi SqlClient</NavLink>
                        <NavLink to="result" params={{resultName: "ODataEntityFramework"}}>OData Entity Framework (DB First)</NavLink>
                        <NavLink to="result" params={{resultName: "ODataEntityFrameworkCodeFirst"}}>OData Entity Framework (Code First)</NavLink>
                        <NavLink to="result" params={{resultName: "ODataLinq2Db"}}>OData Linq2Db</NavLink>
                        <NavLink to="result" params={{resultName: "WebApiEntityFramework"}}>WebApi Entity Framework (DB First)</NavLink>
                        <NavLink to="result" params={{resultName: "WebApiEntityFrameworkCodeFirst"}}>WebApi Entity Framework (Code First)</NavLink>
                        <NavLink to="result" params={{resultName: "WebApiLinq2Db"}}>WebApi Linq2Db</NavLink>
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
