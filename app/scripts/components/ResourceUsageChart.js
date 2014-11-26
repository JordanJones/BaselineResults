/** @jsx React.DOM */
'use strict';

var React = require('react');
var c3 = require('c3');
var moment = require('moment');

module.exports = React.createClass({

    propTypes: {
        chartId: React.PropTypes.string.isRequired,
        data: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            chart: null
        };
    },

    componentWillReceiveProps: function (props){
        if (this.state.chart != null) {
            this.state.chart.destroy();
        }
        this._renderGraphic(props);
    },

    componentWillUnmount: function () {
        if (this.state.chart != null) {
            this.state.chart.destroy();
        }
    },

    render: function() {
        return (<div id={this.props.chartId} className="resourceChart"></div>);
    },

    _renderGraphic: function (props) {
        var chart = c3.generate({
            axis: {
                x: {
                    label: props.xLabel,
                    show: true,
                    tick: {
                        fit: false,
                        format: function (x) {
                            return moment.duration(x, 'seconds').humanize(false);
                        }
                    }
                },
                y: {
                    label: props.yLabel
                }
            },
            bindto: '#' + props.chartId,
            data: {
                x: 'x',
                columns: props.data.columns,
                type: 'spline'
            },
            grid: {
                x: {
                    lines: false,
                    show: false
                }
            },
            point: {
                show: false
            },
            subchart: {
                show: false
            },
            tooltip: {
                show: true
            },
            zoom: {
                enabled: false
            }
        });

        this.setState({chart: chart});
    }

});


// MOMENT Bullcrap


// default relative time thresholds
var relativeTimeThresholds = {
    s: 59,  // seconds to minute
    m: 59,  // minutes to hour
    h: 22,  // hours to day
    d: 26,  // days to month
    M: 11   // months to year
};

var round = Math.round;

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime(posNegDuration, withoutSuffix, locale) {
    var duration = moment.duration(posNegDuration).abs(),
        seconds = round(duration.as('s')),
        minutes = round(duration.as('m')),
        hours = round(duration.as('h')),
        days = round(duration.as('d')),
        months = round(duration.as('M')),
        years = round(duration.as('y')),

        args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
            minutes === 1 && ['m'] ||
            minutes < relativeTimeThresholds.m && ['mm', minutes] ||
            hours === 1 && ['h'] ||
            hours < relativeTimeThresholds.h && ['hh', hours] ||
            days === 1 && ['d'] ||
            days < relativeTimeThresholds.d && ['dd', days] ||
            months === 1 && ['M'] ||
            months < relativeTimeThresholds.M && ['MM', months] ||
            years === 1 && ['y'] || ['yy', years];

    args[2] = withoutSuffix;
    args[3] = +posNegDuration > 0;
    args[4] = locale;
    return substituteTimeAgo.apply({}, args);
}

moment.duration.fn.humanize = function (withSuffix) {
    var output = relativeTime(this, !withSuffix, this.localeData());

    if (withSuffix) {
        output = this.localeData().pastFuture(+this, output);
    }

    return this.localeData().postformat(output);
};
