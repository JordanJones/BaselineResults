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

            var httpSummary = ReduceHttpSummary(data.http, HTTPSUMMARY);

            var perfSummary = ReducePerfSummary(data.perf, {
                values: [],
                avgCpu: {iis: 0, sql: 0},
                avgMem: {iis: 0, sql: 0}
            });

            file.contents = new Buffer(JSON.stringify({
                name: data.name,
                http: httpSummary,
                perf: perfSummary
            }));
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

function ReduceHttpSummary(items, ctx) {
    var size = items.length;

    ctx.reqs = _.reduce(items, function (x, y) { return x + y.reqs; }, 0) / size;
    ctx.total = _.reduce(items, function (x, y) { return x + y.total; }, 0) / size;

    ctx.latency.avg = _.reduce(items, function (x, y) { return x + y.latency.avg; }, 0) / size;
    ctx.latency.std = _.reduce(items, function (x, y) { return x + y.latency.std; }, 0) / size;
    ctx.latency.max = _.reduce(items, function (x, y) { return x + y.latency.max; }, 0) / size;

    ctx.errors.connect = _.reduce(items, function (x, y) { return x + y.errors.connect; }, 0) / size;
    ctx.errors.read = _.reduce(items, function (x, y) { return x + y.errors.read; }, 0) / size;
    ctx.errors.write = _.reduce(items, function (x, y) { return x + y.errors.write; }, 0) / size;
    ctx.errors.timeout = _.reduce(items, function (x, y) { return x + y.errors.timeout; }, 0) / size;

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

var SMA_VALUE = 3;

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

        r.iisCpu = AdjustCpuUsage(r.iisCpu);
        r.sqlCpu = AdjustCpuUsage(r.sqlCpu);
    });

    return ctx;
}

function AveragePerfData(items, ctx) {
    var c = [];
    items.forEach(function (item) {
        item.forEach(function (x) {
            c.push(x);
        });
    });
    var size = c.length;

    ctx.avgMem.iis = _.reduce(c, function (x, y) { return x + y.iisMem; }, 0) / size;
    ctx.avgCpu.iis = _.reduce(c, function (x, y) { return x + y.iisCpu; }, 0) / size;
    ctx.avgMem.sql = _.reduce(c, function (x, y) { return x + y.sqlMem; }, 0) / size;
    ctx.avgCpu.sql = _.reduce(c, function (x, y) { return x + y.sqlCpu; }, 0) / size;


    ctx.avgCpu.iis = AdjustCpuUsage(ctx.avgCpu.iis);
    ctx.avgCpu.sql = AdjustCpuUsage(ctx.avgCpu.sql);
}

function AdjustCpuUsage(num) {
    return num / 4;
}
