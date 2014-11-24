'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var csv = require('fast-csv');

var cache = {};

module.exports = function(data, options) {

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        try
        {
            var dirName = path.dirname(file.relative);

            if (!cache[dirName]) {
                var resultsJson = JSON.parse(
                    fs.readFileSync(path.join(path.dirname(file.path), 'Results.json'))
                );
                cache[dirName] = resultsJson;
            }

            var results = cache[dirName];
            var skippedHeaders = false;
            var pefData = results.perf[results.perf.length] = [];

            var idx = 0;

            file.contents.pipe(csv())
                .on('data', function (csvData) {
                    if (!skippedHeaders) {
                        skippedHeaders = true;
                        return;
                    }
                    if ((csvData[2] == ' ' || csvData[2] == '0')
                        && (csvData[4] == ' ' || csvData[4] == '0')
                        && (csvData[6] == ' ' || csvData[6] == '0')
                        && (csvData[8] == ' ' || csvData[8] == '0')
                    ) {
                        return;
                    }

                    pefData.push({
                        id: idx++,
                        ts: csvData[0],
                        iisMem: parseInt(csvData[1]),
                        iisCpu: csvData[2] == ' ' ? 0.0 : parseFloat(csvData[2]),
                        sqlMem: parseInt(csvData[3]),
                        sqlCpu: csvData[4] == ' ' ? 0.0 : parseFloat(csvData[4]),
                        trans: parseInt(csvData[5]),
                        conns: csvData[6] == ' ' ? 0.0 : parseFloat(csvData[6]),
                        poolConn: parseInt(csvData[7]),
                        activeConn: parseInt(csvData[8])
                    });
                })
                .on('end', function () {
                    var resultFile = new gutil.File({
                        base: file.base,
                        cwd: file.cwd,
                        path: path.join(file.base, dirName, 'Results.json')
                    });
                    resultFile.contents = new Buffer(JSON.stringify(results, null, ' '));
                    cb(null, resultFile);
                });
        }
        catch (err) {
            this.emit('error', new gutil.PluginError('resultify', err, {fileName: file.path}));
        }

        //cb();
    });

};
