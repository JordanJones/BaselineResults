/** @jsx React.DOM */
'use strict';

var React = require('react');
var SummarySection = require('../components/SummarySection');
var NavigationModel = require('../models/NavigationModel');
var ResultModel = require('../models/ResultModel');

module.exports = React.createClass({

    render: function () {
        var summaryData = NavigationModel.getResultRoutes();

        var itemLoader = ResultModel.getAsyncState.bind(ResultModel);

        return (
            <div className="summary-container">

                <SummarySection
                    sectionId="sum-1"
                    heading="Requests per second"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getRequestsPerSecondData.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-3"
                    heading="Average IIS Cpu Usage %"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageIisCpuUsage.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-5"
                    heading="Average SQL Server Cpu Usage %"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageSqlCpuUsage.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-4"
                    heading="Average IIS Memory Usage (MB)"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageIisMemUsage.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-6"
                    heading="Average SQL Server Memory Usage (MB)"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageSqlMemUsage.bind(ResultModel)}
                />

            </div>
        );
    }

});
