'use strict';
var when = require('when');

var DataCache = {};

var ResultDataStore = {

    state: {
        name: 'Unknown',
        data: {
            raw: {
                http: [{reqs: 0}],
                summary: {
                    http: { reqs: 0 }
                }
            },
            cpu: {
                columns: [[], [], []],
                label: 'Unknown'
            },
            mem: {
                columns: [[], [], []],
                label: 'Unknown'
            }
        }
    },

    getState: function () {
        return this.state;
    },

    getAsyncState: function(name) {
        return when
            .promise(LoadData.bind(this, name))
            .then(ProcessData.bind(this))
            .then(TryCacheData.bind(this))
            .then(SetState.bind(this));
    }

};

module.exports = ResultDataStore;

var SetState = function(data) {
    if (data != null && data.parsed != null) {
        this.state = {
            name: data.name,
            data: {
                raw: data.original,
                cpu: {
                    columns: [data.parsed.cpu.x, data.parsed.cpu.iis, data.parsed.cpu.sql],
                    label: data.parsed.name
                },
                mem: {
                    columns: [data.parsed.mem.x, data.parsed.mem.iis, data.parsed.mem.sql],
                    label: data.parsed.name
                }
            }
        };
    }

    return this.getState();
};

var LoadData = function(name, cb) {
    if (DataCache[name] !== undefined) {
        cb(DataCache[name]);
    }
    else {
        var perfData = {
            name: name,
            original: null,
            parsed: null
        };

        var url = 'data/' + name + '/Results.json?bust=' + (new Date()).getTime();
        $.get(url, function (data) {
            if (data != null) {
                perfData.original = data;
            }
            cb(perfData);
        })
        .fail(function () { cb(perfData); });
    }
};

var TryCacheData = function(obj) {
    if (obj != null && obj.original != null && DataCache[obj.name] === undefined) {
        DataCache[obj.name] = obj;
    }

    return obj;
};

var ProcessData = function(data) {
    var parsed = {
        name: data.name,
        cpu: null,
        mem: null
    };

    var hasParsed = data.parsed !== null;

    if (data.original == null || !hasParsed) {
        parsed.cpu = CPU_COLS();
        parsed.mem = MEM_COLS();
        data.parsed = parsed;
    }

    if (data.original != null && !hasParsed && Array.isArray(data.original.summary.perf)) {
        var perfData = data.original.summary.perf;
        var cpuCols = parsed.cpu || CPU_COLS();
        var memCols = parsed.mem || MEM_COLS();

        perfData.forEach(ProcessPerfData.bind(this, cpuCols, memCols));
        parsed.cpu = cpuCols;
        parsed.mem = memCols;
    }

    return data;
};

var ProcessPerfData = function (cpuCols, memCols, o) {
    var d = ProcessDataSlice(o);

    var id = d.id;
    cpuCols.x.push(id);
    memCols.x.push(id);

    cpuCols.iis.push(d.iisCpu);
    memCols.iis.push(d.iisMem);

    cpuCols.sql.push(d.sqlCpu);
    memCols.sql.push(d.sqlMem);
};

var ProcessDataSlice = function (o) {
    return {
        id: o.id,
        iisCpu: o.iisCpu.toPrecision(3),
        sqlCpu: o.sqlCpu.toPrecision(3),
        iisMem: BytesToSize(o.iisMem),
        sqlMem: BytesToSize(o.sqlMem)
    };
}

var BytesToSize = function(bytes) {
    if (bytes == 0) return bytes;
    var k = 1024;
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(5);
    //return bytes;
};


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
