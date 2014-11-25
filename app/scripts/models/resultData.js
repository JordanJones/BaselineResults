'use strict';
var Cortex = require('cortexjs');
var _ = require('underscore');
var when = require('when');

_.extend(Cortex.prototype, {

    load: function (key, url) {
        return when
            .promise(_.bind(this._loadOrFetch, this, key, url))
            .then(_.bind(this._tryCache, this));
    },

    _loadOrFetch: function (key, url, cb) {
        var perfData = {
            name: key,
            original: null/*{
             name: key,
             http: [],
             perf: [],
             summary: {
             http: {
             reqs: 0,
             total: 0,
             latency: {avg: 0, std: 0, max: 0, maxAvg: 0},
             errors: {connect: 0, read: 0, write: 0, timeout: 0}
             },
             perf: []
             }
             }*/,
            parsed: null
        };

        if (this.hasKey(key)) {
            console.log('HasKey: %o', this.hasKey(key));
        }
        else {
            $.get(url, function (data) {
                if (data != null) {
                    perfData.original = data;
                }
                cb(perfData);
            })
            .fail(function () {
                cb(perfData);
            });
        }
    },

    _tryCache: function (obj) {
        if (obj == null || obj.original == null || this.hasKey(obj.name)) return obj;

        return this.add(obj.name, obj);
    },

    process: function (data) {
        var parsed = {
            name: data.name,
            cpu: null,
            mem: null
        };

        if (data.original == null || data.parsed == null) {
            parsed.cpu = CPU_COLS();
            parsed.mem = MEM_COLS();
            data.parsed = parsed;
        }

        if (data.original != null && _.isArray(data.original.summary.perf)) {
            var perfData = data.original.summary.perf;

            _.each(perfData, _.bind(this._processPerfData, this, parsed.cpu, parsed.mem));

            if (this.hasKey(data.name)) {
                data.parsed = parsed;
                this[data.name].set(data);
            }
        }
        else if (data.original == null) {
            // Fake some data so graphs don't fail
            parsed.cpu.x.push(0);
            parsed.cpu.iis.push(0);
            parsed.cpu.sql.push(0);
            parsed.mem.x.push(0);
            parsed.mem.iis.push(0);
            parsed.mem.sql.push(0);
        }

        return data;
    },

    _processPerfData: function (cpuCols, memCols, o) {
        var d = this._processDataSlice(o);

        var id = d.id;
        cpuCols.x.push(id);
        memCols.x.push(id);

        cpuCols.iis.push(d.iisCpu);
        memCols.iis.push(d.iisMem);

        cpuCols.sql.push(d.sqlCpu);
        memCols.sql.push(d.sqlMem);
    },

    _processDataSlice: function (o) {
        return {
            id: o.id,
            iisCpu: o.iisCpu.toPrecision(3),
            sqlCpu: o.sqlCpu.toPrecision(3),
            iisMem: this._bytesToSize(o.iisMem),
            sqlMem: this._bytesToSize(o.sqlMem)
        };
    },

    _bytesToSize: function (bytes) {
        if (bytes == 0) return bytes;
        var k = 1024;
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(5);
        //return bytes;
    }

});

module.exports = Cortex;



var CPU_COLS = function () {
    return {
        x: ['x'],
        iis: ['IIS Cpu'],
        sql: ['SqlServer Cpu']
    };
};

var MEM_COLS = function () {
    return {
        x: ['x'],
        iis: ['IIS Memory'],
        sql: ['SqlServer Memory']
    };
};
