/** @jsx React.DOM */
'use strict';

var React = require('react');
var ResultModel = require('../models/ResultModel');
var NavigationModel = require('../models/NavigationModel');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            preloaded: false
        }
    },

    componentWillMount: function () {
        if (this.state.preloaded === true) return;

        ResultModel.preload(NavigationModel.getResultRoutes());
        this.setState({preloaded: true});
    },

    render: function () {
        return (
            <div className="overview-container">

                <div className="container-fluid">

                    <div className="row code-row">

                        <div className="col-md-3">Base Repository</div>
                        <div className="col-md-8 code-link"><a href="https://github.com/JordanJones/Baseline/">github.com/JordanJones/Baseline/</a></div>

                    </div>

                    <div className="row code-row">

                        <div className="col-md-3">Resource Monitor Command</div>
                        <div className="col-md-8">
                            <pre>typeperf -cf PerformanceCounters.txt -f csv -o perf$NUM.csv -si 1 -sc 3610</pre>
                        </div>

                    </div>

                    <div className="row code-row">

                        <div className="col-md-3">PerformanceCounters.txt</div>
                        <div className="col-md-8">
                            <pre>
                            \Process(w3wp)\Working Set - Private<br />
                            \Process(w3wp)\% Processor Time<br />
                            \Process(sqlservr)\Working Set - Private<br />
                            \Process(sqlservr)\% Processor Time<br />
                            \SQLServer:Transactions\Transactions<br />
                            \.NET Data Provider for SqlServer(*)\SoftConnectsPerSecond<br />
                            \.NET Data Provider for SqlServer(*)\NumberOfPooledConnections<br />
                            \.NET Data Provider for SqlServer(*)\NumberOfActiveConnections<br />
                            </pre>
                        </div>

                    </div>

                    <div className="row code-row">

                        <div className="col-md-3">HTTP Perf Command</div>
                        <div className="col-md-8">
                            <pre>wrk -H "Accept: application/json" -c 10 -t 10 -d 60m http://10.5.32.80/Users</pre>
                        </div>

                    </div>

                    <div className="row code-row">

                        <div className="col-md-3">Database</div>
                        <div className="col-md-8">
                            <pre>
CREATE TABLE [Users](<br />
[Id] [int] NOT NULL CONSTRAINT [PK_Users] PRIMARY KEY IDENTITY(1,1),<br />
[FirstName] nvarchar(255),<br />
[LastName] nvarchar(255),<br />
[EmailAddress] nvarchar(255) NOT NULL<br />
) ON [PRIMARY]<br />
                                <br />
GO
                            </pre>
                        </div>

                    </div>

                </div>
            </div>
        );
    }

});
