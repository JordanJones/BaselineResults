'use strict';
var $ = require('jquery');
var when = require('when');
var numeral = require('numeral');

module.exports = (function () {

    var ResultDataStore = {

        state: GetDefaultData('Unknown'),

        cache: new Map(),

        getState: function () {
            return this.state;
        },

        getAsyncState: function(name, title) {
            return when
                .promise(LoadData.bind(this, name, title))
                .then(ProcessData.bind(this))
                .then(TryCacheData.bind(this))
                .then(SetState.bind(this));
        },

        getRequestsPerSecondData: function () {
            var results = {};
            this.cache.forEach(function(val, key) {
                results[key] = {
                    name: key,
                    title: val.title,
                    value: val.summary.requests
                };
            });
            return results;
        },

        getAverageLatencies: function () {
            var results = {};
            this.cache.forEach(function(val, key) {
                results[key] = {
                    name: key,
                    title: val.title,
                    value: val.summary.latency
                };
            });
            return results;
        },

        getAverageIisCpuUsage: function () {
            var results = {};
            this.cache.forEach(function(val, key) {
                results[key] = {
                    name: key,
                    title: val.title,
                    value: parseFloat(val.summary.iis.avgCpu)
                };
            });
            return results;
        },

        getAverageIisMemUsage: function () {
            var results = {};
            this.cache.forEach(function(val, key) {
                results[key] = {
                    name: key,
                    title: val.title,
                    value: parseFloat(val.summary.iis.avgMem)
                };
            });
            return results;
        },

        getAverageSqlCpuUsage: function () {
            var results = {};
            this.cache.forEach(function(val, key) {
                results[key] = {
                    name: key,
                    title: val.title,
                    value: parseFloat(val.summary.sql.avgCpu)
                };
            });
            return results;
        },

        getAverageSqlMemUsage: function () {
            var results = {};
            this.cache.forEach(function(val, key) {
                results[key] = {
                    name: key,
                    title: val.title,
                    value: parseFloat(val.summary.sql.avgMem)
                };
            });
            return results;
        }

    };

    var SetState = function(data) {
        if (data != null) {
            this.state = data;
        }

        return this.getState();
    };

    var LoadData = function(name, title, cb) {
        if (this.cache.has(name)) {
            cb(this.cache.get(name));
        }
        else {
            var perfData = GetDefaultData(name, title);

            var url = 'data/' + name + '/Results.json?bust=' + (new Date()).getTime();
            $.get(url, function (data) {
                if (data != null) {
                    perfData.raw = data;
                }
                cb(perfData);
            })
                .fail(function () { cb(perfData); });
        }
    };

    var TryCacheData = function(data) {
        if (data != null && data.raw != null && data.isProcessed && !this.cache.has(data.name)) {
            this.cache.set(data.name, data);
        }

        return data;
    };

    var ProcessData = function(data) {
        if (data.raw != null && !data.isProcessed && Array.isArray(data.raw.summary.perf.values)) {
            var raw = data.raw.summary.perf.values;
            var cpuCols = data.cpu.values || [];
            var memCols = data.mem.values || [];

            raw.forEach(ProcessPerfData.bind(this, cpuCols, memCols));
            data.cpu.values = cpuCols;
            data.mem.values = memCols;
            data.summary = ProcessSummaryData(data.raw.summary);
            data.isProcessed = true;
        }

        return data;
    };

    var ProcessSummaryData = function (rawSummary) {
        return {
            requests: parseFloat(numeral(rawSummary.http.reqs).format('0.00')),
            latency: parseFloat(numeral(rawSummary.http.latency.avg).format('0.00')),
            iis: {
                avgCpu: numeral(rawSummary.perf.avgCpu.iis / 100).format('0.00%'),
                avgMem: numeral(rawSummary.perf.avgMem.iis).format('0.000 b')
            },
            sql: {
                avgCpu: numeral(rawSummary.perf.avgCpu.sql / 100).format('0.00%'),
                avgMem: numeral(rawSummary.perf.avgMem.sql).format('0.000 b')
            }
        };
    };

    var ProcessPerfData = function (cpuCols, memCols, o) {
        var d = ProcessDataSlice(o);

        cpuCols.push({
            instance: d.id,
            iis: d.iisCpu,
            sql: d.sqlCpu
        });

        memCols.push({
            instance: d.id,
            iis: d.iisMem,
            sql: d.sqlMem
        });
    };

    var ProcessDataSlice = function (o) {
        return {
            id: o.id,
            iisCpu: parseFloat(numeral(o.iisCpu).format('0.0')),
            sqlCpu: parseFloat(numeral(o.sqlCpu).format('0.0')),
            iisMem: parseFloat(numeral(o.iisMem).format('0.000b')),
            sqlMem: parseFloat(numeral(o.sqlMem).format('0.000b'))
        };
    };

    function GetDefaultData (name, title) {
        return {
            name: name,
            title: title,
            cpu: {
                label: name,
                values: []
            },
            mem: {
                label: name,
                values: []
            },
            summary: {
                requests: 0,
                latency: 0,
                iis: {avgCpu: 0, avgMem: 0},
                sql: {avgCpu: 0, avgMem: 0}
            },
            raw: null,
            isProcessed: false
        };
    }

    return ResultDataStore;

})();
