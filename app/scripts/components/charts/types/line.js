'use strict';

var d3 = require('d3');

module.exports = {
    create: function (el, props, state) {

        var svg = d3.select(el).append('svg')
            .attr('class', 'd3')
            .attr('width', props.width)
            .attr('height', props.height)
        .append('g')
            .attr('class', 'd3-lines')
            .attr('transform', 'translate(50, 10)');

        var scale = this._scales(el, state.domain);
        var line = this._line(scale);

        var xAxis = d3.svg.axis()
            .scale(scale.x)
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(scale.y)
            .orient('left');

        var data = state.data;

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (props.height -50) + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('blah');

        svg.append('path')
            .datum(data)
            .attr('class', 'd3-line')
            .attr('d', line);

    },

    update: function (el, state) {
        var scales = this._scales(el, state.domain);
        this._draw(el, scales, state.data);
    },

    destroy: function(el) {

    },

    _scales: function(el, domain) {
        if (!domain) return null;

        var width = el.offsetWidth;
        var height = el.offsetHeight;

        var x = d3.scale.linear()
            .range([0, width])
            .domain(domain.x);

        var y = d3.scale.linear()
            .range([0, height])
            .domain(domain.y);

        return {x: x, y: y};
    },

    _draw: function(el, scales, data) {
        var g = d3.select(el).selectAll('.d3-lines');

        var line = g.selectAll('path');

        line
            .datum(data)
            .attr('d', this._line(scales));
    },

    _line: function (scales) {
        return d3.svg.line()
            .interpolate('cardinal')
            .x(function (d) { return scales.x(d.x); })
            .y(function (d) { return scales.y(d.y); });
    }
};
