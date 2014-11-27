'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('underscore');

module.exports = function () {
    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        try {
            var data = JSON.parse(String(file.contents));
            var httpSummary = _.chain(data.http)
                .reduce(ReduceHttpSummary, HTTPSUMMARY)
                .value();

            var perfSummary = ReducePerfSummary(data.perf, {
                values: [],
                avgCpu: {iis: 0, sql: 0},
                avgMem: {iis: 0, sql: 0}
            });

            data['summary'] = {
                http: httpSummary,
                perf: perfSummary
            };

            file.contents = new Buffer(JSON.stringify(data));
            cb(null, file);
        }
        catch (err) {
            this.emit('error', new gutil.PluginError('summarizer', err, {fileName: file.path}));
        }

    });
};

var HTTPSUMMARY = {
    reqs: 0,
    total: 0,
    latency: {
        avg: 0,
        std: 0,
        max: 0
    },
    errors: {
        connect: 0,
        read: 0,
        write: 0,
        timeout: 0
    }
};

function ReduceHttpSummary(ctx, item, idx) {
    ctx.reqs = (ctx.reqs + item.reqs) / (idx + 1);
    ctx.total += item.total;
    ctx.latency.avg = (ctx.latency.avg + item.latency.avg) / (idx + 1);
    ctx.latency.std = (ctx.latency.std + item.latency.std) / (idx + 1);
    ctx.latency.max = Math.max(ctx.latency.max, item.latency.max);
    ctx.latency.maxAvg = (ctx.latency.max + item.latency.max) / (idx + 1);
    ctx.errors.connect = (ctx.errors.connect + item.errors.connect) / (idx + 1);
    ctx.errors.read = (ctx.errors.read + item.errors.read) / (idx + 1);
    ctx.errors.write = (ctx.errors.write + item.errors.write) / (idx + 1);
    ctx.errors.timeout = (ctx.errors.timeout + item.errors.timeout) / (idx + 1);
    return ctx;
}

var PERFSUMMARY = {
    id: 0,
    iisMem: 0,
    iisCpu: 0,
    sqlMem: 0,
    sqlCpu: 0,
    trans: 0,
    conns: 0,
    poolConn: 0,
    activeConn: 0,
    ts: ''
};

var SMA_VALUE = 10;

function ReducePerfSummary(items, ctx) {
    AveragePerfData(items, ctx);

    var size = _.chain(items)
        .map(function (x) { return _.size(x);})
        .max()
        .value();
    var total = Math.ceil((size / SMA_VALUE));
    var nums = _.range(total);

    var chunks = _.chain(nums)
        .map(function () { return []; })
        .value();

    _.each(items, function (item) {
            _.each(nums, function (i) {
                var offset = (i * SMA_VALUE);
                var count = offset + SMA_VALUE;

                Array.prototype.push.apply(chunks[i], item.slice(offset, Math.min(count, size)));
            });
        });

    _.each(chunks, function (c, idx) {
        if (!_.isArray(ctx.values[idx])) {
            ctx.values[idx] = _.clone(PERFSUMMARY);
        }
        var size = c.length;
        var r = ctx.values[idx];

        r.id = (idx * SMA_VALUE);
        r.iisMem = _.reduce(c, function (x, y) { return x + y.iisMem; }, 0) / size;
        r.iisCpu = _.reduce(c, function (x, y) { return x + y.iisCpu; }, 0) / size;
        r.sqlMem = _.reduce(c, function (x, y) { return x + y.sqlMem; }, 0) / size;
        r.sqlCpu = _.reduce(c, function (x, y) { return x + y.sqlCpu; }, 0) / size;
    });

    return ctx;
}

function AveragePerfData(items, ctx) {
    var c = _.flatten(items);
    var size = c.length;

    ctx.avgMem.iis = _.reduce(c, function (x, y) { return x + y.iisMem; }, 0) / size;
    ctx.avgCpu.iis = _.reduce(c, function (x, y) { return x + y.iisCpu; }, 0) / size;
    ctx.avgMem.sql = _.reduce(c, function (x, y) { return x + y.sqlMem; }, 0) / size;
    ctx.avgCpu.sql = _.reduce(c, function (x, y) { return x + y.sqlCpu; }, 0) / size;
}
