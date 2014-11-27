/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({

    getDefaultProps: function() {
        return {
            data: {requests: 0}
        };
    },

    render: function() {
        return (
            <div className="well well-sm container-fluid">
                <h1 className="text-center">{this.props.data.requests} <small>requests per second</small></h1>
                <div className="row">
                    <div className="col-xs-6 col-xs-offset-3">
                    <table className="table table-bordered table-compact average-container">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Average Cpu %</th>
                                <th>Average Memory</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>IIS</td>
                                <td>{this.props.data.iis.avgCpu}</td>
                                <td>{this.props.data.iis.avgMem}</td>
                            </tr>
                            <tr>
                                <td>SQL</td>
                                <td>{this.props.data.sql.avgCpu}</td>
                                <td>{this.props.data.sql.avgMem}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        );
    }

});
