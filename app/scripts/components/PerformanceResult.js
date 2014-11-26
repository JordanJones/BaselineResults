/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            data: null
        };
    },

    render: function() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td>Requests/second</td>
                        <td className="active">value</td>

                        <td></td>
                        <td className="active">value</td>

                        <td>Latency Average</td>
                        <td className="active">value</td>
                    </tr>
                    <tr>
                        <td>Total Requests</td>
                        <td className="active">value</td>

                        <td></td>
                        <td className="active">value</td>

                        <td>Latency Stdev</td>
                        <td className="active">value</td>
                    </tr>
                    <tr>
                        <td>Requests/second</td>
                        <td className="active">value</td>

                        <td></td>
                        <td className="active">value</td>

                        <td>Latency Max</td>
                        <td className="active">value</td>
                    </tr>
                </tbody>
            </table>
        );
    }

});
