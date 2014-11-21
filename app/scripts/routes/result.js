/** @jsx React.DOM */

var React = require('react');

var ResourceUsageChart = require('../components/charts/ResourceUsage');

var d3 = require('d3');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            data: [],
            domain: testDomain
        }
    },

    componentDidMount: function () {
      if (this.isMounted()) {
          this.setState({
              data: testData(),
              domain: testDomain
          });
      }
    },

    render: function() {
        return (
            <div>
                <h1 className="page-header">{this.props.params.resultName}</h1>
                <ResourceUsageChart data={this.state.data} domain={this.state.domain} />
            </div>
        );
    }

});

var testDomain = {x: [0, 15], y: [0, 10]};

function testData()
{
    var y = d3.random.irwinHall(10);
    var results = [];
    for (var i = 0; i < 10; i++) {
        results[i] = {
            id: i + '_' + y(),
            x: i + 1,
            y: y()
        };
    }
    return results;
}
