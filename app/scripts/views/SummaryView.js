/** @jsx React.DOM */
'use strict';

var React = require('react');
var SummarySection = require('../components/SummarySection');
var NavigationModel = require('../models/NavigationModel');
var ResultModel = require('../models/ResultModel');

module.exports = React.createClass({

    render: function () {
        var summaryData = [];
        NavigationModel.routes.forEach(function(x) {
            if (x.route === 'Result') {
                summaryData.push({
                    name: x.name,
                    title: x.title
                });
            }
        });

        var itemLoader = ResultModel.getAsyncState.bind(ResultModel);

        return (
            <div className="summary-container">
                <div className="page-header"><h1>Summary</h1></div>

                <SummarySection
                    sectionId="sum-1"
                    heading="Requests per second"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getRequestsPerSecondData.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-2"
                    heading="Average Latency"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageLatencies.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-3"
                    heading="Average IIS Cpu Usage"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageIisCpuUsage.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-4"
                    heading="Average IIS Memory Usage"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageIisMemUsage.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-5"
                    heading="Average SQL Cpu Usage"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageSqlCpuUsage.bind(ResultModel)}
                />

                <SummarySection
                    sectionId="sum-6"
                    heading="Average SQL Memory Usage"
                    items={summaryData}
                    itemLoader={itemLoader}
                    stateLoader={ResultModel.getAverageSqlMemUsage.bind(ResultModel)}
                />

            </div>
        );
    }

});
