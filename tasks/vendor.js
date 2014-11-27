'use strict';

var buildOptions = {};

var gulp = require('gulp'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream');

// Plugins
var $ = require('gulp-load-plugins')({lazy: false});

var VendorLibs = [
    {name: 'jquery', file: './app/bower_components/jquery/dist/jquery.js'},
    {name: 'react', file: './node_modules/react/react.js'},
    {name: 'react-router', file: './node_modules/react-router/dist/react-router.js'},
    {name: 'moment', file: './node_modules/moment/min/moment-with-locales.min.js'},
    {name: 'when', file: './node_modules/when/when.js'},
    {name: 'd3', file: './app/bower_components/d3/d3.min.js' },
    {name: 'c3', file: './app/bower_components/c3/c3.min.js', depends: ['d3']},
    {name: 'bootstrap', file: './app/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js', depends: ['jquery']},
    {name: 'jasny-bootstrap', file: './app/bower_components/jasny-bootstrap/dist/js/jasny-bootstrap.js', depends: ['jquery', 'bootstrap']},
    {name: 'numeral', file: './node_modules/numeral/numeral.js'}
];

gulp.task('vendor', function () {
    var params = {
        debug: buildOptions.dev === true,
        cache: {},
        packageCache: {},
        fullPaths: true
    };
    var b = browserify('./app/scripts/Vendor.js', params);
    VendorLibs.forEach(function (o) {
        var opts = {expose: o.name};
        if (o.depends || Array.isArray(o.depends)) {
            opts.depends = o.depends;
        }
        b.require(o.file, opts);
    });

    return b
        .bundle()
        .pipe(source('Vendor.js'))
        .pipe($.if(buildOptions.dev === true, buffer()))
        .pipe($.if(buildOptions.dev === true, $.sourcemaps.init({loadMaps: true})))
        .pipe($.if(buildOptions.dev !== true, $.streamify($.uglify())))
        .pipe($.if(buildOptions.dev === true, $.sourcemaps.write('./')))
        .pipe(gulp.dest('dist/scripts'));
});

module.exports = function (buildOpts) {
    buildOptions = buildOpts;
    return VendorLibs;
};
