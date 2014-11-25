/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');
var c3 = require('c3');
var moment = require('moment');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            data: null,
            chart: null,
            render: true
        };
    },

    componentWillUpdate: function (nextProps, nextState) {
        if (this.state.chart != null && nextState.render) {
            this.state.chart.destroy();
        }
    },

    componentDidUpdate: function () {
        if (this.state.render && _.isObject(this.state.data) && _.isArray(this.state.data.columns)) {
            this._renderGraphic();
        }
    },

    componentWillUnmount: function () {
        if (this.state.chart != null) {
            this.state.chart.destroy();
        }
    },

    render: function() {
        return (<div id={this.props.chartId} className="resourceChart"></div>);
    },

    _renderGraphic: function () {
        var chart = c3.generate({
            axis: {
                x: {
                    label: this.props.xLabel,
                    show: true,
                    tick: {
                        fit: false,
                        format: function (x) {
                            return moment.duration(x, 'seconds').humanize(false);
                        }
                    }
                },
                y: {
                    label: this.props.yLabel
                }
            },
            bindto: '#' + this.props.chartId,
            data: {
                x: 'x',
                columns: this.state.data.columns,
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

        this.setState({chart: chart, render: false});
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
